const { sql } = require('@vercel/postgres');

async function updateTable() {
  try {
    await sql`
      ALTER TABLE reports 
      ADD COLUMN IF NOT EXISTS risk_type VARCHAR(50) DEFAULT 'Suspicious',
      ADD COLUMN IF NOT EXISTS tx_hash VARCHAR(100),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING',
      ADD COLUMN IF NOT EXISTS user_agent TEXT
    `;
    console.log('✅ Reports table updated successfully');
  } catch (error) {
    console.error('❌ Failed to update table:', error);
  }
}

updateTable();
