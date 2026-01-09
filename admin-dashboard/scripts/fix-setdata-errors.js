const fs = require('fs');
const path = require('path');

// Mapping of file paths to their correct fetch URL
const fileFixes = {
  'app/medication/history/page.tsx': {
    url: '/api/data/medication-plan',
    stateVar: 'setMedicationPlan'
  },
  'app/medication/plan/page.tsx': {
    url: '/api/data/medication-plan',
    stateVar: 'setMedicationPlan'
  },
  'app/preventive-care/radiation/page.tsx': {
    url: '/api/data/radiation',
    stateVar: 'setRadiationData'
  },
  'app/preventive-care/screening/page.tsx': {
    url: '/api/data/screening',
    stateVar: 'setScreeningData'
  },
  'app/preventive-care/vaccines/page.tsx': {
    url: '/api/data/vaccines',
    stateVar: 'setVaccinationData'
  },
  'app/womens-health/calendar/page.tsx': {
    url: '/api/data/cycle',
    stateVar: 'setCycleData'
  },
  'app/womens-health/cycle/page.tsx': {
    url: '/api/data/cycle',
    stateVar: 'setCycleData'
  },
  'app/womens-health/menopause/page.tsx': {
    url: '/api/data/menopause',
    stateVar: 'setMenopauseData'
  },
  'app/womens-health/pregnancy/page.tsx': {
    url: '/api/data/pregnancy',
    stateVar: 'setPregnancyData'
  },
  'app/settings/reminders/page.tsx': {
    url: '/api/data/reminders',
    stateVar: 'setReminders'
  }
};

const basePath = 'D:\\my-his\\admin-dashboard';

Object.entries(fileFixes).forEach(([filePath, fix]) => {
  const fullPath = path.join(basePath, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Pattern to match the bad useEffect code
  const badPattern = /useEffect\(\(\) => \{\s*const loadData = async \(\) => \{\s*try \{\s*const responses = await Promise\.all\(\[\s*fetch\('\/api\/data\/-[^']+'\),\s*fetch\('\/api\/data\/-data'\),\s*\]\);\s*const data0 = await responses\[0\]\.json\(\);\s*const data1 = await responses\[1\]\.json\(\);\s*setMedicationPlan\(data0\);\s*setData\(data1\);\s*setLoading\(false\);/;

  const goodCode = `useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('${fix.url}');
        const data = await response.json();
        ${fix.stateVar}(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);`;

  // More specific pattern matching for each file
  const lines = content.split('\n');
  let inUseEffect = false;
  let useEffectStart = -1;
  let useEffectEnd = -1;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/useEffect\(\(\) => \{/.test(line)) {
      inUseEffect = true;
      useEffectStart = i;
      braceCount = 1;
      continue;
    }

    if (inUseEffect) {
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;

      if (braceCount === 0) {
        useEffectEnd = i;
        break;
      }
    }
  }

  if (useEffectStart !== -1 && useEffectEnd !== -1) {
    const before = lines.slice(0, useEffectStart).join('\n');
    const after = lines.slice(useEffectEnd + 1).join('\n');

    content = before + '\n' + goodCode + '\n' + after;

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`Could not find useEffect pattern in ${filePath}`);
  }
});

console.log('Done!');
