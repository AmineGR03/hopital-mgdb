// Test script for API CRUD operations
const http = require('http');

const API_BASE = 'http://localhost:3000';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🧪 Testing API CRUD operations...\n');

    // Test 1: GET all patients
    console.log('1. Testing GET /patients');
    const patientsResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/patients',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (patientsResult.status !== 200) {
      console.log('❌ GET failed:', patientsResult.status);
      return;
    }

    const patients = patientsResult.data;
    console.log(`   Found ${patients.length} patients`);

    if (patients.length === 0) {
      console.log('❌ No patients found');
      return;
    }

    const firstPatient = patients[0];
    console.log(`   First patient: ${firstPatient.nom} ${firstPatient.prenom} (ID: ${firstPatient._id})`);

    // Test 2: DELETE patient
    console.log('\n2. Testing DELETE /patients/:id');
    const deleteResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/patients/${firstPatient._id}`,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (deleteResult.status === 200) {
      console.log(`   ✅ DELETE successful: ${deleteResult.data.message}`);
    } else {
      console.log(`   ❌ DELETE failed: ${deleteResult.status} - ${JSON.stringify(deleteResult.data)}`);
    }

    // Test 3: CREATE new patient
    console.log('\n3. Testing POST /patients');
    const newPatient = {
      nom: 'Test',
      prenom: 'User',
      dateNaissance: '1990-01-01T00:00:00.000Z',
      sexe: 'Homme',
      contact: { telephone: '0611111111', adresse: 'Test City' },
      historique_medical: {
        groupe_sanguin: 'O+',
        allergies: [],
        diagnostics_passes: []
      }
    };

    const createResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/patients',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newPatient);

    if (createResult.status === 201) {
      console.log(`   ✅ CREATE successful: ${createResult.data.nom} ${createResult.data.prenom}`);
    } else {
      console.log(`   ❌ CREATE failed: ${createResult.status} - ${JSON.stringify(createResult.data)}`);
    }

    console.log('\n✅ CRUD operations test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
