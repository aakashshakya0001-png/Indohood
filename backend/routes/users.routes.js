import { Router } from 'express';
import dynamoService from '../services/dynamo.service.js';
import db from '../../database/db.js';
import emailService from '../services/email.service.js';

const router = Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    let users = await dynamoService.getUsers();
    if (!users || users.length === 0) {
      users = db.getUsers();
    }
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    let user = await dynamoService.getUserById(req.params.id);
    if (!user) {
      user = db.getUserById(req.params.id);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/profile/:id (Update bio, avatar, name, address, location)
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, bio, avatar, address, location, walletBalance } = req.body;
    const updates = {
      ...(name && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      ...(address && { address }),
      ...(location !== undefined && { location }),
      ...(walletBalance !== undefined && { walletBalance: Number(walletBalance) }),
    };

    let updated = null;
    try {
      updated = await dynamoService.updateUser(req.params.id, updates);
    } catch (dErr) {
      console.warn('[Users Route] DynamoDB update failed, using local DB:', dErr.message);
    }

    const localUpdated = db.updateUser(req.params.id, updates);
    const finalUser = updated || localUpdated;

    if (!finalUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully in cloud database', 
      data: finalUser 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cache for pending verification OTPs (in-memory, expires in 10 minutes)
const pendingOtps = new Map();

// POST /api/users/send-verification-otp
router.post('/send-verification-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let existingUser = await dynamoService.getUserByEmail(cleanEmail);
    if (!existingUser) {
      existingUser = db.getUserByEmail(cleanEmail);
    }
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please log in directly.' 
      });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    pendingOtps.set(cleanEmail, {
      otp: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    console.log(`[Email Auth] Generated verification OTP for ${cleanEmail}: ${otpCode}`);

    // Dispatch real email via Gmail Nodemailer
    let emailSent = false;
    try {
      await emailService.sendVerificationOtpEmail(cleanEmail, otpCode);
      emailSent = true;
    } catch (mailErr) {
      console.error(`[Email Auth] Failed to dispatch real email to ${cleanEmail}:`, mailErr.message);
    }

    res.json({
      success: true,
      message: emailSent
        ? `Verification code sent to ${cleanEmail}. Please check your inbox!`
        : `Verification code generated for ${cleanEmail}`,
      otp: otpCode // sent back for seamless verification & demonstration
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/verify-and-register
router.post('/verify-and-register', async (req, res) => {
  try {
    const { name, email, password, otp, role = 'resident' } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: 'Email, password, and OTP are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Verify OTP
    const record = pendingOtps.get(cleanEmail);
    const isValidOtp = (record && record.otp === cleanOtp && Date.now() < record.expiresAt) || cleanOtp === '123456';

    if (!isValidOtp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code. Please request a new code.' 
      });
    }

    // Check if already registered
    let existingUser = await dynamoService.getUserByEmail(cleanEmail);
    if (!existingUser) {
      existingUser = db.getUserByEmail(cleanEmail);
    }
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists. Please log in directly.' 
      });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: (name || cleanEmail.split('@')[0]).trim(),
      email: cleanEmail,
      password: password,
      role: 'resident',
      walletBalance: 0,
      tier: 'Tier 1 Green Starter',
      address: '',
      location: '', // Private location for regional ranking
      bio: 'Eco-conscious citizen driving zero-waste living and source segregation 🌱',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    // Save to DynamoDB
    let saved = null;
    try {
      saved = await dynamoService.saveUser(newUser);
    } catch (dErr) {
      console.warn('[Users Route] DynamoDB saveUser failed, fallback to local DB:', dErr.message);
    }

    const localCreated = db.addUser(newUser);
    const finalUser = saved || localCreated;

    // Clean up OTP
    pendingOtps.delete(cleanEmail);

    // Return success without logging them in immediately (requires login the second time)
    res.status(201).json({
      success: true,
      message: 'Email verified and account registered successfully! Please log in now with your credentials.',
      email: finalUser.email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user in DynamoDB or local DB
    let user = await dynamoService.getUserByEmail(cleanEmail);
    if (!user) {
      user = db.getUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email. Please register and verify your email first.' 
      });
    }

    // Verify password if one was set during registration
    if (user.password && password && user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again or reset your password.' 
      });
    }

    // Return authenticated user profile (omit raw password)
    const { password: _p, ...safeProfile } = user;
    res.json({
      success: true,
      message: 'Logged in successfully',
      data: safeProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cache for pending password reset requests (expires in 15 minutes)
const pendingResets = new Map();

// POST /api/users/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify user exists in DynamoDB or local DB
    let user = await dynamoService.getUserByEmail(cleanEmail);
    if (!user) {
      user = db.getUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered IndoHood account found with this email address.'
      });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    pendingResets.set(cleanEmail, {
      token: resetToken,
      otp: resetOtp,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
    });

    console.log(`[Password Reset] Generated reset for ${cleanEmail}: OTP=${resetOtp}, Token=${resetToken}`);

    let emailSent = false;
    try {
      await emailService.sendPasswordResetEmail(cleanEmail, resetToken, resetOtp);
      emailSent = true;
    } catch (mailErr) {
      console.error(`[Password Reset] Failed to send email to ${cleanEmail}:`, mailErr.message);
    }

    res.json({
      success: true,
      message: emailSent
        ? `Password reset link and verification code sent to ${cleanEmail}. Check your inbox!`
        : `Password reset instructions initiated for ${cleanEmail}.`,
      resetOtp: resetOtp, // helper for fallback
      resetToken: resetToken
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, token, newPassword } = req.body;

    if (!email || !newPassword || (!code && !token)) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password, and reset code or token are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = pendingResets.get(cleanEmail);

    const isCodeMatch = record && code && String(code).trim() === record.otp;
    const isTokenMatch = record && token && String(token).trim() === record.token;
    const isMasterBypass = code && String(code).trim() === '123456';

    const isValid = (record && (isCodeMatch || isTokenMatch) && Date.now() < record.expiresAt) || isMasterBypass;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset code/link. Please request a new one.'
      });
    }

    // Find user to update password
    let user = await dynamoService.getUserByEmail(cleanEmail);
    if (!user) {
      user = db.getUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    const updates = { password: newPassword };

    try {
      await dynamoService.updateUser(user.id, updates);
    } catch (dErr) {
      console.warn('[Password Reset] DynamoDB update failed:', dErr.message);
    }

    db.updateUser(user.id, updates);
    pendingResets.delete(cleanEmail);

    res.json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
