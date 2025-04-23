const fs = require('fs');
const redisAdapter = require('./redisAdapter');

// Check if running in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Initial data structure
const initialData = {
  users: [],
  games: []
};

// Load data from Redis in production or from file in development
async function getData() {
  if (isProduction) {
    // In production, use Redis
    const data = await redisAdapter.get('database');
    return data || initialData;
  } else {
    // In development, use file system
    try {
      return JSON.parse(fs.readFileSync('./database.json', 'utf8'));
    } catch (error) {
      console.log('Error reading database file, using initial data');
      return initialData;
    }
  }
}

// Save data to Redis in production or to file in development
async function saveData(data) {
  if (isProduction) {
    // In production, use Redis
    return await redisAdapter.set('database', data);
  } else {
    // In development, use file system
    try {
      fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving database file:', error);
      return false;
    }
  }
}

module.exports = {
  getData,
  saveData
};