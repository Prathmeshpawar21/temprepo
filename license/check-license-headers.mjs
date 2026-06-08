import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let validCount = 0;
let missingCount = 0;
const missingFiles = [];

function hasLicenseHeader(content) {
  return content.includes('Allcognix AI Technologies');
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasLicenseHeader(content)) {
      validCount++;
      console.log(`✅ ${filePath}`);
    } else {
      missingCount++;
      missingFiles.push(filePath);
      console.log(`❌ ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      checkFile(fullPath);
    }
  }
}

// Main execution
console.log('🔍 Checking copyright headers...\n');

// Go up one level from license/ folder to find src/
const projectRoot = path.join(__dirname, '..');
const srcPath = path.join(projectRoot, 'src');

if (!fs.existsSync(srcPath)) {
  console.error('❌ Error: src/ directory not found');
  console.error(`   Looking in: ${srcPath}`);
  process.exit(1);
}

processDirectory(srcPath);

console.log('\n�� Summary:');
console.log(`✅ Valid:   ${validCount} files`);
console.log(`❌ Missing: ${missingCount} files`);

if (missingCount > 0) {
  console.log('\n❌ Files missing headers:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nRun "npm run license:add" to add missing headers');
  process.exit(1);
}

console.log('\n✅ All files have proper copyright headers!');
process.exit(0);
