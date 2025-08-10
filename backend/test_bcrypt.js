// test_bcrypt.js
const bcrypt = require('bcrypt');

// These are the exact values we know should work.
const myPassword = 'admin';
const myHash = '$2a$12$4fzmgrg1qBjb3LjFX.RY2erVx5hMUigPUk9ip0RKc/QifvlDXMrfK';

async function runTest() {
  console.log('--- Starting Standalone Bcrypt Test ---');
  console.log('Password to test:', myPassword);
  console.log('Hash to compare against:', myHash);

  try {
    const isMatch = await bcrypt.compare(myPassword, myHash);

    console.log('\nResult of comparison (isMatch):', isMatch);

    if (isMatch) {
      console.log('\n✅ SUCCESS: Bcrypt is working correctly on your machine.');
    } else {
      console.log('\n❌ FAILURE: Bcrypt is NOT working correctly on your machine.');
    }
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR: An error occurred during bcrypt.compare().', error);
  }
}

runTest();