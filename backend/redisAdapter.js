const Redis = require('ioredis');

// Initialize Redis client
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Database key
const DB_KEY = 'bigbrain_data';

// Database operations
const redisAdapter = {
  async get(key) {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },
  
  async set(key, value) {
    try {
      await redis.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },
  
  async delete(key) {
    try {
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
      const data = await redis.get(DB_KEY);
      return data ? JSON.parse(data) : { games: [] };
    } catch (error) {
      console.error('Error reading from Redis:', error);
      return { games: [] };
    }
  },

  // Write to database
  write: async (data) => {
    try {
      await redis.set(DB_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error writing to Redis:', error);
      return false;
    }
  },

  // Clear database
  clear: async () => {
    try {
      await redis.del(DB_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing Redis:', error);
      return false;
    }
  },

  // Reset database to initial state
  reset: async () => {
    const initialData = { games: [] };
    try {
      await redis.set(DB_KEY, JSON.stringify(initialData));
      return true;
    } catch (error) {
      console.error('Error resetting Redis:', error);
      return false;
    }
  }
};

module.exports = redisAdapter;
