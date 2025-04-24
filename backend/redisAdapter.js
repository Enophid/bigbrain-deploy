import { Redis } from "@upstash/redis";

// Validate Redis URL
if (!process.env.UPSTASH_REDIS_URL) {
  console.error('ERROR: UPSTASH_REDIS_URL environment variable is not set!');
  console.error('Please set this variable with your Redis connection string.');
}

// Initialize Redis client with options
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Connection events
redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

// Database key
const DB_KEY = 'bigbraindb';

// Database operations
const redisAdapter = {
  async isConnected() {
    try {
      const pong = await redis.ping();
      return pong === 'PONG';
    } catch (error) {
      console.error('Redis connection check failed:', error);
      return false;
    }
  },

  async get(key) {
    try {
      console.log(`Getting key: ${key}`);
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },
  
  async set(key, value) {
    try {
      console.log(`Setting key: ${key}`);
      await redis.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },
  
  async delete(key) {
    try {
      console.log(`Deleting key: ${key}`);
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      return false;
    }
  },

  // Read database
  read: async () => {
    try {
      console.log(`Reading from database key: ${DB_KEY}`);
      const data = await redis.get(DB_KEY);
      if (!data) {
        console.log('No data found in Redis');
        return { admins: {}, games: {}, sessions: {} };
      }
      
      const parsedData = JSON.parse(data);
      console.log(`Data retrieved successfully: ${Object.keys(parsedData).join(', ')}`);
      return parsedData;
    } catch (error) {
      console.error('Error reading from Redis:', error);
      return { admins: {}, games: {}, sessions: {} };
    }
  },

  // Write to database
  write: async (data) => {
    try {
      if (!data) {
        throw new Error('No data provided to write');
      }
      console.log(`Writing to database key: ${DB_KEY}, data keys: ${Object.keys(data).join(', ')}`);
      const result = await redis.set(DB_KEY, JSON.stringify(data));
      console.log('Data written successfully');
      return result === 'OK';
    } catch (error) {
      console.error('Error writing to Redis:', error);
      return false;
    }
  },

  // Reset database
  reset: async () => {
    try {
      console.log(`Resetting database key: ${DB_KEY}`);
      await redis.del(DB_KEY);
      console.log('Database reset successfully');
      return true;
    } catch (error) {
      console.error('Error resetting Redis database:', error);
      return false;
    }
  }
};

module.exports = redisAdapter;
