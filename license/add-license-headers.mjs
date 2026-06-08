import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LICENSE_HEADER = `/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

`;

let addedCount = 0;
let skippedCount = 0;
let errorCount = 0;

function hasLicenseHeader(content) {
  return content.includes('Allcognix AI Technologies');
}

function addHeaderToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasLicenseHeader(content)) {
      console.log(`⏭️  ${filePath}`);
      skippedCount++;
      return;
    }
    
    const newContent = LICENSE_HEADER + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${filePath}`);
    addedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      addHeaderToFile(fullPath);
    }
  }
}

// Main execution
console.log('🚀 Adding copyright headers to source files...\n');

// Go up one level from license/ folder to find src/
const projectRoot = path.join(__dirname, '..');
const srcPath = path.join(projectRoot, 'src');

if (!fs.existsSync(srcPath)) {
  console.error('❌ Error: src/ directory not found');
  console.error(`   Looking in: ${srcPath}`);
  process.exit(1);
}

processDirectory(srcPath);

console.log('\n📊 Summary:');
console.log(`✅ Added:   ${addedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`❌ Errors:  ${errorCount} files`);
console.log('\n✅ Done!');
