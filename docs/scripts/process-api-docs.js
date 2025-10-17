/**
 * Script to process TypeDoc output and convert to VitePress format
 */

const fs = require('fs');
const path = require('path');

function processApiDocs() {
  const apiDir = path.join(__dirname, '../temp-api');
  const outputDir = path.join(__dirname, '../api');

  if (!fs.existsSync(apiDir)) {
    console.log('No API docs to process');
    return;
  }

  // Process TypeDoc markdown files
  const files = fs.readdirSync(apiDir);

  files.forEach((file) => {
    if (file.endsWith('.md')) {
      let content = fs.readFileSync(path.join(apiDir, file), 'utf-8');

      // Add VitePress frontmatter
      content = `---
title: ${file.replace('.md', '')}
---

${content}`;

      // Write to output directory
      fs.writeFileSync(path.join(outputDir, file), content);
    }
  });

  // Clean up temp directory
  fs.rmSync(apiDir, { recursive: true, force: true });

  console.log('✅ API documentation processed successfully');
}

processApiDocs();
