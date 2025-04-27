import { Redis } from "@upstash/redis";

import dotenv from 'dotenv';
dotenv.config();

// Validate Redis URL and token
if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  console.error('ERROR: UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN environment variables must be set!');
  console.error('Make sure these variables are set in your .env file or Vercel dashboard.');
}


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
})


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
      
      // Check if data is already an object
      let parsedData;
      if (typeof data === 'object' && data !== null) {
        parsedData = data;
        console.log('Data already parsed, using as is');
      } else {
        try {
          parsedData = JSON.parse(data);
        } catch (parseError) {
          console.error('Error parsing Redis data:', parseError);
          console.log('Raw data type:', typeof data);
          console.log('Raw data preview:', typeof data === 'string' ? data.substring(0, 100) : data);
          return { admins: {}, games: {}, sessions: {} };
        }
      }
      
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
