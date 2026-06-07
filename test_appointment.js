// Test script to verify appointment booking works without authentication

const http = require('http');

const testAppointment = {
  name: "Test Patient",
  number: "+919876543210",
  email: "test@example.com",
  preferdDate: "2026-06-20",
  preferdTime: "2:00 PM",
  message: "Test booking"
};

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/appointment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
    
    if (res.statusCode === 201 && JSON.parse(data).success) {
      console.log('\n✅ TEST PASSED: Appointment booking works without authentication!');
    } else {
      console.log('\n❌ TEST FAILED: Unexpected response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ TEST FAILED: Error:', error.message);
});

req.write(JSON.stringify(testAppointment));
req.end();
