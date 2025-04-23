const fs = require('fs');
const redisAdapter = require('./redisAdapter');

// Determine if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Database operations
const db = {
  // Read database
  read: async () => {
    if (isProduction) {
      return await redisAdapter.read();
    } else {
      // Original file-based implementation
      try {
        const data = JSON.parse(fs.readFileSync('./database.json'));
        return data;
      } catch (err) {
        return { games: [] };
      }
    }
  },

  // Write to database
  write: async (data) => {
    if (isProduction) {
      return await redisAdapter.write(data);
    } else {
      // Original file-based implementation
      try {
        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
        return true;
      } catch (err) {
        return false;
      }
    }
  },

  // Clear database
  clear: async () => {
    if (isProduction) {
      return await redisAdapter.clear();
    } else {
      // Original file-based implementation
      try {
        fs.writeFileSync('./database.json', JSON.stringify({ games: [] }, null, 2));
        return true;
      } catch (err) {
        return false;
      }
    }
  },

  // Reset database to initial state
  reset: async () => {
    if (isProduction) {
      return await redisAdapter.reset();
    } else {
      // Original file-based implementation
      try {
        const defaultData = JSON.parse(fs.readFileSync('./database.default.json'));
        fs.writeFileSync('./database.json', JSON.stringify(defaultData, null, 2));
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};

module.exports = db;