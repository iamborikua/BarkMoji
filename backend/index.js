require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dalle = require('./dalle');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', dalle);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`BarkMoji backend listening on port ${PORT}`));
}

module.exports = app; 