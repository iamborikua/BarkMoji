const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const os = require('os');

// Set up SQLite DB - use temp directory for Heroku compatibility
const dbPath = path.join(os.tmpdir(), 'barkmoji_shares.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS shares (
    shareId TEXT PRIMARY KEY,
    name TEXT,
    breed TEXT,
    age TEXT,
    mood TEXT,
    moodData TEXT,
    imageUrl TEXT,
    createdAt TEXT
  )`);
});

router.post('/generate-image', async (req, res) => {
  const { name, breed, mood } = req.body;
  const prompt = `A funny cartoon of a ${breed} dog named ${name} feeling ${mood}, digital art, pastel colors, cute, playful`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ imageUrl: response.data.data[0].url });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

// POST /share: Generate image, store share, return shareId and imageUrl
router.post('/share', async (req, res) => {
  const { name, breed, age, mood, moodData } = req.body;
  const safeBreed = breed || 'breed n/a';
  const moodObj = typeof moodData === 'object' ? moodData : { caption: mood, emoji: '', prompt: mood };
  const prompt = `A funny cartoon dog, breed: ${safeBreed}, named ${name}, age ${age}, looking ${moodObj.caption || moodObj.prompt} ${moodObj.emoji || ''}, in a playful, colorful, cartoon style, with confetti, and a small BarkMoji logo in the corner.`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const imageUrl = response.data.data[0].url;
    const shareId = uuidv4().slice(0, 8);
    const createdAt = new Date().toISOString();
    db.run(
      `INSERT INTO shares (shareId, name, breed, age, mood, moodData, imageUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [shareId, name, safeBreed, age, mood, JSON.stringify(moodObj), imageUrl, createdAt],
      err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save share.' });
        }
        res.json({ shareId, imageUrl });
      }
    );
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    res.status(500).json({ error: 'Image generation failed. Please try again for a new dose of BarkMoji magic!' });
  }
});

// GET /share/:shareId: Retrieve share data
router.get('/share/:shareId', (req, res) => {
  const { shareId } = req.params;
  db.get('SELECT * FROM shares WHERE shareId = ?', [shareId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch share.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Share not found. Maybe the dog ran off with it?' });
    }
    // Parse moodData back to object
    row.moodData = row.moodData ? JSON.parse(row.moodData) : {};
    res.json(row);
  });
});

module.exports = router; 