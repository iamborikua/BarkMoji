require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dalle = require('./dalle');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', dalle);

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`BarkMoji backend listening on port ${PORT}`));
}

module.exports = app; 