require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8000,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};