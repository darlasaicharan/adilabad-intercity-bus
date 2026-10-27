/**
 * Automated Test Suite for Adilabad Intercity Bus REST API
 */

const http = require('http');

function makeRequest(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          path,
          status: res.statusCode,
          expectedStatus,
          passed: res.statusCode === expectedStatus,
          durationMs: duration,
          data: json
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        status: 'CONNECTION_ERROR',
        expectedStatus,
        passed: false,
        durationMs: 0,
        error: err.message
      });
    });
  });
}

async function runAllTests() {
  console.log('====================================================');
  console.log('🧪 TESTING ALL BACKEND REST API ENDPOINTS');
  console.log('====================================================\n');

  const tests = [
    { name: '1. Health Check', path: '/api/health', expected: 200 },
    { name: '2. All Available Cities', path: '/api/cities', expected: 200 },
    { name: '3. All Bus Records', path: '/api/buses', expected: 200 },
    { name: '4. Search: Adilabad -> Hyderabad', path: '/api/buses/search?from=Adilabad&to=Hyderabad', expected: 200 },
    { name: '5. Search: Adilabad -> Nirmal', path: '/api/buses/search?from=Adilabad&to=Nirmal', expected: 200 },
    { name: '6. Search: Adilabad -> Nizamabad', path: '/api/buses/search?from=Adilabad&to=Nizamabad', expected: 200 },
    { name: '7. Search: Adilabad -> Karimnagar', path: '/api/buses/search?from=Adilabad&to=Karimnagar', expected: 200 },
    { name: '8. Search: Return Trip (Hyderabad -> Adilabad)', path: '/api/buses/search?from=Hyderabad&to=Adilabad', expected: 200 },
    { name: '9. Validation: Same City (Adilabad -> Adilabad)', path: '/api/buses/search?from=Adilabad&to=Adilabad', expected: 400 },
    { name: '10. Validation: Missing Destination City', path: '/api/buses/search?from=Adilabad', expected: 400 },
    { name: '11. Validation: Missing Starting City', path: '/api/buses/search?to=Hyderabad', expected: 400 },
    { name: '12. Bus Details by ID: TS-ADB-101', path: '/api/buses/TS-ADB-101', expected: 200 },
    { name: '13. Bus Details by ID: TS-ADB-102', path: '/api/buses/TS-ADB-102', expected: 200 },
    { name: '14. Validation: Invalid Bus ID', path: '/api/buses/INVALID-BUS-999', expected: 404 }
  ];

  let passCount = 0;
  let totalTime = 0;

  for (const t of tests) {
    const res = await makeRequest(t.path, t.expected);
    totalTime += res.durationMs;
    const icon = res.passed ? '✅ PASS' : '❌ FAIL';
    if (res.passed) passCount++;

    let summary = '';
    if (res.passed) {
      if (t.path === '/api/cities') {
        summary = `Count: ${res.data.count} cities (${res.data.cities.slice(0, 4).join(', ')}...)`;
      } else if (t.path === '/api/buses') {
        summary = `Total Buses: ${res.data.totalCount}`;
      } else if (t.path.includes('/api/buses/search')) {
        summary = res.status === 200 ? `Matches: ${res.data.totalResults} buses` : `Handled: "${res.data.message}"`;
      } else if (t.path.includes('/api/buses/TS-')) {
        summary = `Name: "${res.data.bus.busName}", Fare: ₹${res.data.bus.fare}`;
      } else if (res.status === 404) {
        summary = `Handled: "${res.data.message}"`;
      } else if (t.path === '/api/health') {
        summary = `Status: ${res.data.status}`;
      }
    } else {
      summary = `Error: Expected ${t.expected}, Got ${res.status}`;
    }

    console.log(`${icon} [${res.durationMs}ms] ${t.name}`);
    console.log(`    URL: http://localhost:3000${t.path}`);
    console.log(`    HTTP ${res.status} | ${summary}\n`);
  }

  console.log('====================================================');
  console.log(`📊 FINAL RESULT: ${passCount} / ${tests.length} TESTS PASSED`);
  console.log(`⚡ Average Response Time: ${(totalTime / tests.length).toFixed(1)} ms`);
  console.log('====================================================');
}

runAllTests();
