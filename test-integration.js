const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  name: 'Test User',
  phone: '9876543210',
  role: 'volunteer',
  religion: 'Hindu',
  caste: 'General',
  pc: 'Lucknow',
  ac: 'Lucknow North',
  panchayat: 'Panchayat A',
  leaderPhone: '9876543211'
};

const testBeneficiary = {
  name: 'Test Beneficiary',
  age: 25,
  phone: '9876543220',
  religion: 'Hindu',
  category: 'General',
  caste: 'Brahmin',
  schemes: ['PM-KISAN'],
  leaderMobile: '9876543211'
};

let authToken = '';
let userData = null;

async function testIntegration() {
  console.log('🚀 Testing Complete Frontend-Backend Integration\n');

  try {
    // Test 1: Reference APIs
    console.log('1. Testing Reference APIs...');
    await testReferenceAPIs();
    console.log('✅ Reference APIs working\n');

    // Test 2: User Signup
    console.log('2. Testing User Signup...');
    await testUserSignup();
    console.log('✅ User signup working\n');

    // Test 3: User Login
    console.log('3. Testing User Login...');
    await testUserLogin();
    console.log('✅ User login working\n');

    // Test 4: Profile Update
    console.log('4. Testing Profile Update...');
    await testProfileUpdate();
    console.log('✅ Profile update working\n');

    // Test 5: Get Profile
    console.log('5. Testing Get Profile...');
    await testGetProfile();
    console.log('✅ Get profile working\n');

    // Test 6: Beneficiary Registration
    console.log('6. Testing Beneficiary Registration...');
    await testBeneficiaryRegistration();
    console.log('✅ Beneficiary registration working\n');

    // Test 7: Beneficiary Verification
    console.log('7. Testing Beneficiary Verification...');
    await testBeneficiaryVerification();
    console.log('✅ Beneficiary verification working\n');

    // Test 8: Get All Beneficiaries
    console.log('8. Testing Get All Beneficiaries...');
    await testGetAllBeneficiaries();
    console.log('✅ Get all beneficiaries working\n');

    console.log('🎉 All Integration Tests Passed!');
    console.log('✅ Frontend and Backend are properly integrated');
    console.log('✅ All API endpoints are working correctly');
    console.log('✅ Data flow is functioning as expected');

  } catch (error) {
    console.error('❌ Integration test failed:', error.response?.data || error.message);
  }
}

async function testReferenceAPIs() {
  // Test schemes
  const schemesResponse = await axios.get(`${API_BASE_URL}/reference/schemes`);
  if (!schemesResponse.data || schemesResponse.data.length === 0) {
    throw new Error('Schemes API returned empty data');
  }

  // Test categories
  const categoriesResponse = await axios.get(`${API_BASE_URL}/reference/categories`);
  if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
    throw new Error('Categories API returned empty data');
  }

  // Test religions
  const religionsResponse = await axios.get(`${API_BASE_URL}/reference/religions`);
  if (!religionsResponse.data || religionsResponse.data.length === 0) {
    throw new Error('Religions API returned empty data');
  }

  // Test PCs
  const pcsResponse = await axios.get(`${API_BASE_URL}/reference/pcs`);
  if (!pcsResponse.data || pcsResponse.data.length === 0) {
    throw new Error('PCs API returned empty data');
  }

  // Test ACs
  const acsResponse = await axios.get(`${API_BASE_URL}/reference/acs?pc=Lucknow`);
  if (!acsResponse.data || acsResponse.data.length === 0) {
    throw new Error('ACs API returned empty data');
  }

  // Test panchayats
  const panchayatsResponse = await axios.get(`${API_BASE_URL}/reference/panchayats`);
  if (!panchayatsResponse.data || panchayatsResponse.data.length === 0) {
    throw new Error('Panchayats API returned empty data');
  }

  console.log(`   - Schemes: ${schemesResponse.data.length} schemes loaded`);
  console.log(`   - Categories: ${categoriesResponse.data.length} categories loaded`);
  console.log(`   - Religions: ${religionsResponse.data.length} religions loaded`);
  console.log(`   - PCs: ${pcsResponse.data.length} parliamentary constituencies loaded`);
  console.log(`   - ACs: ${acsResponse.data.length} assembly constituencies loaded`);
  console.log(`   - Panchayats: ${panchayatsResponse.data.length} panchayats loaded`);
}

async function testUserSignup() {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    name: testUser.name,
    phone: testUser.phone,
    role: testUser.role
  });

  if (!response.data.message || !response.data.otp) {
    throw new Error('Signup response missing required fields');
  }

  console.log(`   - User signup successful for ${testUser.phone}`);
  console.log(`   - OTP: ${response.data.otp}`);
}

async function testUserLogin() {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    phone: testUser.phone,
    otp: '1234'
  });

  if (!response.data.token || !response.data.user) {
    throw new Error('Login response missing token or user data');
  }

  authToken = response.data.token;
  userData = response.data.user;

  console.log(`   - User login successful`);
  console.log(`   - Token received: ${authToken.substring(0, 20)}...`);
  console.log(`   - User ID: ${userData.id}`);
  console.log(`   - User Role: ${userData.role}`);
}

async function testProfileUpdate() {
  const response = await axios.put(`${API_BASE_URL}/auth/profile`, {
    name: testUser.name,
    religion: testUser.religion,
    caste: testUser.caste,
    pc: testUser.pc,
    ac: testUser.ac,
    panchayat: testUser.panchayat,
    leaderPhone: testUser.leaderPhone
  }, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (!response.data.message || !response.data.user) {
    throw new Error('Profile update response missing required fields');
  }

  console.log(`   - Profile updated successfully`);
  console.log(`   - Updated name: ${response.data.user.name}`);
  console.log(`   - Updated religion: ${response.data.user.religion}`);
}

async function testGetProfile() {
  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (!response.data.user) {
    throw new Error('Get profile response missing user data');
  }

  console.log(`   - Profile retrieved successfully`);
  console.log(`   - User name: ${response.data.user.name}`);
  console.log(`   - User phone: ${response.data.user.phone}`);
}

async function testBeneficiaryRegistration() {
  const response = await axios.post(`${API_BASE_URL}/beneficiaries/initiate`, testBeneficiary, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.data.registrationNumber) {
    throw new Error('Beneficiary registration missing registration number');
  }

  console.log(`   - Beneficiary registration initiated`);
  console.log(`   - Registration Number: ${response.data.registrationNumber}`);
  console.log(`   - Beneficiary Phone: ${testBeneficiary.phone}`);
}

async function testBeneficiaryVerification() {
  const response = await axios.post(`${API_BASE_URL}/beneficiaries/verify`, {
    phone: testBeneficiary.phone,
    verificationCode: '1234'
  });

  if (!response.data.success || !response.data.beneficiary) {
    throw new Error('Beneficiary verification failed');
  }

  console.log(`   - Beneficiary verification successful`);
  console.log(`   - Beneficiary name: ${response.data.beneficiary.name}`);
  console.log(`   - Beneficiary verified: ${response.data.beneficiary.verified}`);
}

async function testGetAllBeneficiaries() {
  const response = await axios.get(`${API_BASE_URL}/beneficiaries`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (!response.data.beneficiaries) {
    throw new Error('Get beneficiaries response missing data');
  }

  console.log(`   - Retrieved ${response.data.beneficiaries.length} beneficiaries`);
  
  if (response.data.beneficiaries.length > 0) {
    const beneficiary = response.data.beneficiaries[0];
    console.log(`   - First beneficiary: ${beneficiary.name} (${beneficiary.phone})`);
    console.log(`   - Created by: ${beneficiary.creatorName} (${beneficiary.creatorPhone})`);
  }
}

// Run the integration test
testIntegration();
