const dotenv = require("dotenv")
dotenv.config()

const secrets = {
  dbUri: process.env.DB_URI || 'YOUR MONGODB URI HERE',
};

const getSecret = (key) => secrets[key];

module.exports = { getSecret };
