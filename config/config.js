require('dotenv').config();

const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const user = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const URI = `postgres://${user}:${password}@${dbHost}:${dbPort}/${dbName}`;

const config = {
  dbUrl: URI,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
};

module.exports = { config };
