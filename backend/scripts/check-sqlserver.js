const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let sql;
try {
  sql = require('mssql');
} catch {
  console.error('Missing dependency: mssql');
  console.error('Run this inside backend first: npm install mssql');
  process.exit(1);
}

const requiredEnv = [
  'SQLSERVER_HOST',
  'SQLSERVER_DATABASE',
  'SQLSERVER_USER',
  'SQLSERVER_PASSWORD',
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing required env values: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const config = {
  server: process.env.SQLSERVER_HOST,
  database: process.env.SQLSERVER_DATABASE,
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === 'true',
    trustServerCertificate:
      process.env.SQLSERVER_TRUST_SERVER_CERTIFICATE === 'true',
  },
};

async function checkConnection() {
  console.log('Checking SQL Server connection...');
  console.log(`Server: ${config.server}`);
  console.log(`Database: ${config.database}`);
  console.log(`User: ${config.user}`);

  const pool = await sql.connect(config);
  const result = await pool.request().query('SELECT 1 AS connected');

  console.log('Connection successful.');
  console.log('Test query result:', result.recordset[0]);

  await pool.close();
}

checkConnection().catch(async (error) => {
  console.error('Connection failed.');
  console.error(error.message);

  try {
    await sql.close();
  } catch {
    // Ignore cleanup errors after a failed connection attempt.
  }

  process.exit(1);
});
