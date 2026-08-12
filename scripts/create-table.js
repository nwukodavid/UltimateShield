const { sql } = require('@vercel/postgres');

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        address VARCHAR(100) NOT NULL,
        comment TEXT,
        ip VARCHAR(45),
        reported_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_reports_address ON reports (address);
    `;
    console.log('✅ Reports table created successfully');
  } catch (error) {
    console.error('❌ Failed to create table:', error);
  }
}

createTable();
