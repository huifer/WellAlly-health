const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findClientComponentsWithLoader() {
  const result = execSync(
    `cd app && grep -r "'use client'" **/page.tsx **/**/page.tsx 2>/dev/null | cut -d: -f1 | sort | uniq`,
    { cwd: path.resolve(process.cwd(), 'admin-dashboard'), encoding: 'utf-8' }
  );

  const files = result.split('\n').filter(f => f);
  const problematicFiles = [];

  for (const file of files) {
    const filePath = path.join('admin-dashboard/app', file);
    const content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes("from '@/lib/data/loader'")) {
      problematicFiles.push(filePath);
    }
  }

  return problematicFiles;
}

function hasUseEffectWithLoader(content) {
  // Check if file has useEffect that calls loader functions
  return content.includes('useEffect') &&
         (content.includes('loadProfileData') ||
          content.includes('loadLabTests') ||
          content.includes('loadScreeningData') ||
          content.includes('loadVaccinationData') ||
          content.includes('loadCycleTrackerData') ||
          content.includes('loadMedicationPlan') ||
          content.includes('loadMedicationLogs') ||
          content.includes('loadVitalSignsLogs') ||
          content.includes('loadPregnancyTracker') ||
          content.includes('loadMenopauseTracker') ||
          content.includes('loadRadiationRecords') ||
          content.includes('loadHealthReport') ||
          content.includes('loadAllergies') ||
          content.includes('loadReminders'));
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Remove the loader import line
  content = content.replace(/\nimport\s*\{[^}]*\}\s*from\s*'@\/lib\/data\/loader';?\n/g, '\n');

  // Find useEffect that uses loader functions and convert to async
  const useEffectRegex = /useEffect\(\(\)\s*=>\s*\{[\s\S]*?const\s+loadData\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\};[\s\S]*?loadData\(\);[\s\S]*?\},\s*\[([^\]]*)\]\);/g;

  content = content.replace(useEffectRegex, (match, deps) => {
    // Extract the function calls inside loadData
    const calls = match.match(/load\w+\(/g);
    if (!calls || calls.length === 0) return match;

    const fetchCalls = [];
    const apiEndpoints = [];

    for (const call of calls) {
      const funcName = call.replace('load', '').replace('(', '');
      let endpoint = funcName.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase()).toLowerCase();
      if (endpoint === 'health-report') {
        endpoint = 'health-report?year=${selectedYear}';
      }
      apiEndpoints.push(`'${endpoint}'`);
    }

    if (apiEndpoints.length === 0) return match;

    const fetchCode = `
  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
${apiEndpoints.map(e => `          fetch('/api/data/${e}'),`).join('\n')}
        ]);
        const data = await Promise.all(responses.map(r => r.json()));
        ${data.map((d, i) => `set${apiEndpoints[i].split('?')[0].split('-').map((s, idx) => idx === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s).join('')}(data[${i}]);`).join('\n        ')}
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [${deps}]);`;

    return fetchCode;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

const files = findClientComponentsWithLoader();
console.log(`Found ${files.length} client components importing loader:`);
files.forEach(f => console.log(`  - ${f}`));

let fixedCount = 0;
for (const file of files) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\nFixed ${fixedCount} files`);
