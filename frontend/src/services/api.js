// IndoHood API Client Service
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Health Check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', message: err.message };
    }
  },

  // AI Multimodal Waste Classification
  classifyWaste: async ({ imageBase64, itemHint }) => {
    try {
      const res = await fetch(`${API_BASE}/ai/classify-waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, itemHint }),
      });
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.message || 'AI Classification failed');
    } catch (err) {
      console.warn('[API Client] Backend unreachable, using client-side fallback:', err.message);
      return null;
    }
  },

  // Pickups
  getPickups: async () => {
    try {
      const res = await fetch(`${API_BASE}/pickups`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('[API Client] Falling back to local state:', err.message);
      return null;
    }
  },

  schedulePickup: async (pickupData) => {
    try {
      const res = await fetch(`${API_BASE}/pickups/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('[API Client] Offline pickup scheduling:', err.message);
      return null;
    }
  },

  completePickup: async (pickupId, credits, co2Grams) => {
    try {
      const res = await fetch(`${API_BASE}/pickups/${pickupId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits, co2Grams }),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('[API Client] Offline pickup completion:', err.message);
      return null;
    }
  },

  // Users
  getUserProfile: async (userId = 'usr_resident_01') => {
    try {
      const res = await fetch(`${API_BASE}/users/profile/${userId}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  updateUserProfile: async (userId, profileData) => {
    try {
      const res = await fetch(`${API_BASE}/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  // Auth & Email Verification
  sendVerificationOtp: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/users/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Falling back to client-generated OTP:', err.message);
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      return { success: true, message: `Verification code sent to ${email}`, otp: fallbackOtp };
    }
  },

  verifyAndRegister: async ({ name, email, password, otp, role }) => {
    try {
      const res = await fetch(`${API_BASE}/users/verify-and-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp, role }),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Falling back to client-side register:', err.message);
      return {
        success: true,
        message: 'Email verified and account registered successfully! Please log in now with your credentials.',
        email
      };
    }
  },

  loginUser: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Falling back to local login:', err.message);
      return {
        success: true,
        data: {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'resident',
          walletBalance: 0
        }
      };
    }
  },

  // Activities
  getActivities: async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  cheerActivity: async (activityId) => {
    try {
      const res = await fetch(`${API_BASE}/activities/${activityId}/cheer`, {
        method: 'POST',
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  // Articles
  getArticles: async () => {
    try {
      const res = await fetch(`${API_BASE}/articles`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },
};

export default api;
