const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  generateAccessToken : (username) => {
    return jwt.sign(username, process.env.TOKEN_SECRET);
  }
}