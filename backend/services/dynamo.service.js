import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';

const rawClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const USERS_TABLE = 'IndoHood_Users';
export const PICKUPS_TABLE = 'IndoHood_Pickups';
export const ACTIVITIES_TABLE = 'IndoHood_Activities';

export const dynamoService = {
  // ================= USERS =================
  async getUsers() {
    try {
      const res = await docClient.send(new ScanCommand({ TableName: USERS_TABLE }));
      return res.Items || [];
    } catch (err) {
      console.error('[DynamoDB getUsers error]:', err.message);
      return [];
    }
  },

  async getUserById(id) {
    try {
      const res = await docClient.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { id }
      }));
      return res.Item || null;
    } catch (err) {
      console.error(`[DynamoDB getUserById ${id} error]:`, err.message);
      return null;
    }
  },

  async getUserByEmail(email) {
    try {
      if (!email) return null;
      const target = email.trim().toLowerCase();
      const users = await this.getUsers();
      return users.find(u => (u.email || '').toLowerCase() === target) || null;
    } catch (err) {
      console.error(`[DynamoDB getUserByEmail ${email} error]:`, err.message);
      return null;
    }
  },

  async saveUser(user) {
    try {
      await docClient.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: user
      }));
      return user;
    } catch (err) {
      console.error('[DynamoDB saveUser error]:', err.message);
      throw err;
    }
  },

  async updateUser(id, updates) {
    try {
      const existing = await this.getUserById(id);
      const merged = existing ? { ...existing, ...updates } : { id, ...updates };
      await this.saveUser(merged);
      return merged;
    } catch (err) {
      console.error(`[DynamoDB updateUser ${id} error]:`, err.message);
      throw err;
    }
  },

  // ================= PICKUPS =================
  async getPickups() {
    try {
      const res = await docClient.send(new ScanCommand({ TableName: PICKUPS_TABLE }));
      const items = res.Items || [];
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    } catch (err) {
      console.error('[DynamoDB getPickups error]:', err.message);
      return [];
    }
  },

  async getPickupById(id) {
    try {
      const res = await docClient.send(new GetCommand({
        TableName: PICKUPS_TABLE,
        Key: { id }
      }));
      return res.Item || null;
    } catch (err) {
      console.error(`[DynamoDB getPickupById ${id} error]:`, err.message);
      return null;
    }
  },

  async savePickup(pickup) {
    try {
      await docClient.send(new PutCommand({
        TableName: PICKUPS_TABLE,
        Item: pickup
      }));
      return pickup;
    } catch (err) {
      console.error('[DynamoDB savePickup error]:', err.message);
      throw err;
    }
  },

  async updatePickup(id, updates) {
    try {
      const existing = await this.getPickupById(id);
      const merged = existing ? { ...existing, ...updates } : { id, ...updates };
      await this.savePickup(merged);
      return merged;
    } catch (err) {
      console.error(`[DynamoDB updatePickup ${id} error]:`, err.message);
      throw err;
    }
  },

  // ================= ACTIVITIES =================
  async getActivities() {
    try {
      const res = await docClient.send(new ScanCommand({ TableName: ACTIVITIES_TABLE }));
      const items = res.Items || [];
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    } catch (err) {
      console.error('[DynamoDB getActivities error]:', err.message);
      return [];
    }
  },

  async saveActivity(activity) {
    try {
      await docClient.send(new PutCommand({
        TableName: ACTIVITIES_TABLE,
        Item: activity
      }));
      return activity;
    } catch (err) {
      console.error('[DynamoDB saveActivity error]:', err.message);
      throw err;
    }
  },

  async cheerActivity(id) {
    try {
      const res = await docClient.send(new GetCommand({
        TableName: ACTIVITIES_TABLE,
        Key: { id }
      }));
      if (!res.Item) return null;
      const cheers = (res.Item.cheers || 0) + 1;
      const updated = { ...res.Item, cheers };
      await this.saveActivity(updated);
      return updated;
    } catch (err) {
      console.error(`[DynamoDB cheerActivity ${id} error]:`, err.message);
      throw err;
    }
  }
};

export default dynamoService;
