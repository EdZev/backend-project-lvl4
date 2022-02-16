// @ts-check
require('dotenv').config();
console.log(process.env);

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?sslmode=require`,
    //connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    useNullAsDefault: true,
    migrations,
  },
};
