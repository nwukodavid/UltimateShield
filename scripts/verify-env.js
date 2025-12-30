#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

console.log('🔧 Verifying UltimateShield Environment Configuration\n');
console.log('='.repeat(50));

const envVars = {
  'QUICKNODE_BTC_ENDPOINT': process.env.QUICKNODE_BTC_ENDPOINT,
  'QUICKNODE_API_KEY': process.env.QUICKNODE_API_KEY
};

let allValid = true;

for (const [key, value] of Object.entries(envVars)) {
  const isValid = value && value.length > 0 && !value.includes('YOUR_');
  const status = isValid ? '✅' : '❌';
  
  console.log(`${status} ${key}:`);
  if (isValid) {
    console.log(`   Configured (${value.substring(0, 20)}...)`);
  } else {
    console.log(`   MISSING or invalid`);
    allValid = false;
  }
  console.log();
}

if (allValid) {
  console.log('🎉 All environment variables are properly configured!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run build');
  console.log('   2. Start your scanner');
  console.log('   3. Test with known addresses');
} else {
  console.log('⚠️  Please check your .env.local file');
  console.log('   Required variables:');
  console.log('   - QUICKNODE_BTC_ENDPOINT');
  console.log('   - QUICKNODE_API_KEY');
  process.exit(1);
}
