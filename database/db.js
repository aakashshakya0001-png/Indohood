import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEEDS_DIR = path.join(__dirname, 'seeds');
const DATA_DIR = (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT)
  ? path.join('/tmp', 'data')
  : path.join(__dirname, 'data');

// Ensure data directory exists for persistent writes
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[DB] Could not create DATA_DIR:', err.message);
  }
}

function loadOrInitialize(entityName) {
  const dataPath = path.join(DATA_DIR, `${entityName}.json`);
  const seedPath = path.join(SEEDS_DIR, `${entityName}.json`);

  if (fs.existsSync(dataPath)) {
    try {
      const content = fs.readFileSync(dataPath, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.warn(`[DB] Error reading ${dataPath}, falling back to seeds:`, e.message);
    }
  }

  if (fs.existsSync(seedPath)) {
    try {
      const content = fs.readFileSync(seedPath, 'utf-8');
      const parsed = JSON.parse(content);
      fs.writeFileSync(dataPath, JSON.stringify(parsed, null, 2), 'utf-8');
      return parsed;
    } catch (e) {
      console.error(`[DB] Error loading seed ${seedPath}:`, e.message);
      return [];
    }
  }

  return [];
}

function persist(entityName, data) {
  const dataPath = path.join(DATA_DIR, `${entityName}.json`);
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`[DB] Failed to persist ${entityName}:`, e.message);
  }
}

// In-memory active cache
let users = loadOrInitialize('users');
let pickups = loadOrInitialize('pickups');
let activities = loadOrInitialize('activities');
let articles = loadOrInitialize('articles');

export const db = {
  // Users
  getUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id),
  updateUser: (id, updates) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      persist('users', users);
      return users[idx];
    }
    return null;
  },

  // Pickups
  getPickups: () => pickups,
  getPickupById: (id) => pickups.find(p => p.id === id),
  addPickup: (pickupData) => {
    const newPickup = {
      id: pickupData.id || `pk_${Date.now()}`,
      bookingRef: pickupData.bookingRef || `IND-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'SCHEDULED',
      ...pickupData
    };
    pickups = [newPickup, ...pickups];
    persist('pickups', pickups);
    return newPickup;
  },
  updatePickup: (id, updates) => {
    const idx = pickups.findIndex(p => p.id === id);
    if (idx !== -1) {
      pickups[idx] = { ...pickups[idx], ...updates };
      persist('pickups', pickups);
      return pickups[idx];
    }
    return null;
  },

  // Activities
  getActivities: () => activities,
  addActivity: (activityData) => {
    const newActivity = {
      id: activityData.id || `act_${Date.now()}`,
      createdAt: new Date().toISOString(),
      cheers: 0,
      ...activityData
    };
    activities = [newActivity, ...activities];
    persist('activities', activities);
    return newActivity;
  },
  cheerActivity: (id) => {
    const act = activities.find(a => a.id === id);
    if (act) {
      act.cheers = (act.cheers || 0) + 1;
      persist('activities', activities);
      return act;
    }
    return null;
  },

  // Articles
  getArticles: () => articles,
  getArticleById: (id) => articles.find(a => a.id === id)
};

export default db;
