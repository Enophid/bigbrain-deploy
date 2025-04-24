import { Redis } from "@upstash/redis";

import dotenv from 'dotenv';
dotenv.config();

// Create a dummy adapter for environments where Redis is not configured
const createDummyAdapter = () => {
  console.warn('WARNING: Using dummy Redis adapter. Data will not persist between function invocations.');
  
  // In-memory storage for development/testing
  const memoryStore = {
    bigbraindb: JSON.stringify({ admins: {}, games: {}, sessions: {} })
  };
  
  return {
    async isConnected() {
      return true;
    },
    async get(key) {
      console.log(`[DUMMY] Getting key: ${key}`);
      const value = memoryStore[key];
      return value ? JSON.parse(value) : null;
    },
    async set(key, value) {
      console.log(`[DUMMY] Setting key: ${key}`);
      memoryStore[key] = JSON.stringify(value);
      return true;
    },
    async del(key) {
      console.log(`[DUMMY] Deleting key: ${key}`);
      delete memoryStore[key];
      return true;
    },
    async ping() {
      return 'PONG';
    }
  };
};

// Initialize Redis client or fallback to dummy adapter
let redis;
try {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    console.warn('WARNING: UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN environment variables not set!');
    console.warn('Using in-memory storage instead. Data will not persist between function invocations.');
    redis = createDummyAdapter();
  } else {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  }
} catch (error) {
  console.error('Error initializing Redis client:', error);
  redis = createDummyAdapter();
}

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
      // Return empty data structure in case of error
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
      await redis.set(DB_KEY, JSON.stringify(data));
      console.log('Data written successfully');
      return true;
    } catch (error) {
      console.error('Error writing to Redis:', error);
      return false;
    }
  },

  reset: async () => {
    try {
      await redis.del(DB_KEY);
      console.log('Database reset successfully');
    } catch (error) {
      console.error('Error resetting Redis:', error);
      return false;
    }
  }
};


// Use ES modules export syntax
export default redisAdapter;
