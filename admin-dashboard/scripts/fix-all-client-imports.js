const fs = require('fs');
const path = require('path');

const clientFiles = [
  'app/lab-tests/compare/page.tsx',
  'app/lab-tests/history/page.tsx',
  'app/lab-tests/imaging/page.tsx',
  'app/medication/history/page.tsx',
  'app/medication/interactions/page.tsx',
  'app/medication/plan/page.tsx',
  'app/medication/reminders/page.tsx',
  'app/preventive-care/plan/page.tsx',
  'app/preventive-care/radiation/page.tsx',
  'app/preventive-care/screening/page.tsx',
  'app/preventive-care/vaccines/page.tsx',
  'app/settings/reminders/page.tsx',
  'app/womens-health/calendar/page.tsx',
  'app/womens-health/cycle/page.tsx',
  'app/womens-health/menopause/page.tsx',
  'app/womens-health/pregnancy/page.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - not found`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  const originalContent = content;

  // Remove loader import
  content = content.replace(
    /import\s*\{[^}]*\}\s*from\s*'@\/lib\/data\/loader';?\n/,
    ''
  );

  // Find and replace synchronous loadData with async fetch
  const loadPattern = /useEffect\(\(\)\s*=>\s*\{\s*const\s+loadData\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\n\s*};\s*\n\s*loadData\(\);\s*\n\s*\},\s*\[\]\);/g;

  content = content.replace(loadPattern, (match) => {
    // Extract which loaders are being called
    const loaders = match.match(/load\w+\(/g);
    if (!loaders) return match;

    const fetchCalls = [];
    const setDataCalls = [];

    for (const loader of loaders) {
      const funcName = loader.replace('load', '').replace('(', '');
      let endpoint = funcName;

      // Convert camelCase to kebab-case
      endpoint = endpoint.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase()).toLowerCase();

      // Special cases
      if (endpoint === 'screening-data') endpoint = 'screening';
      if (endpoint === 'vaccination-data') endpoint = 'vaccines';
      if (endpoint === 'cycle-tracker-data') endpoint = 'cycle';
      if (endpoint === 'pregnancy-tracker') endpoint = 'pregnancy';
      if (endpoint === 'menopause-tracker') endpoint = 'menopause';
      if (endpoint === 'radiation-records') endpoint = 'radiation';
      if (endpoint === 'lab-tests') endpoint = 'lab-tests';
      if (endpoint === 'reminders') endpoint = 'reminders';
      if (endpoint === 'allergies') endpoint = 'allergies';
      if (endpoint === 'vital-signs-logs') endpoint = 'vital-signs';

      fetchCalls.push(`fetch('/api/data/${endpoint}')`);

      // Create setData call based on function name
      let varName = '';
      if (funcName === 'LabTests') varName = 'setLabTests';
      else if (funcName === 'CycleTrackerData') varName = 'setCycleData';
      else if (funcName === 'PregnancyTracker') varName = 'setPregnancyData';
      else if (funcName === 'MenopauseTracker') varName = 'setMenopauseData';
      else if (funcName === 'RadiationRecords') varName = 'setRadiationData';
      else if (funcName === 'ScreeningData') varName = 'setScreeningData';
      else if (funcName === 'VaccinationData') varName = 'setVaccinationData';
      else if (funcName === 'Reminders') varName = 'setReminders';
      else if (funcName === 'Allergies') varName = 'setAllergies';
      else if (funcName === 'VitalSignsLogs') varName = 'setVitalSigns';
      else varName = 'set' + funcName;

      setDataCalls.push({ varName, index: setDataCalls.length });
    }

    if (fetchCalls.length === 0) return match;

    let newCode = `  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all([
${fetchCalls.map(c => `          ${c},`).join('\n')}
        ]);
${setDataCalls.map(d => `        const data${d.index} = await responses[${d.index}].json();`).join('\n')}
${setDataCalls.map(d => `        ${d.varName}(data${d.index});`).join('\n')}
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);`;

    return newCode;
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

let fixedCount = 0;
for (const file of clientFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\nTotal files fixed: ${fixedCount}`);
