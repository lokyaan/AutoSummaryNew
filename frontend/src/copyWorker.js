const fs = require('fs');
const path = require('path');

const possiblePaths = [
  path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.js'),
  path.join(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.js')
];

const destination = path.join(__dirname, 'public/pdf.worker.js');

let workerPath = '';

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    workerPath = p;
    break;
  }
}

if (workerPath) {
  fs.copyFileSync(workerPath, destination);
  console.log('pdf.worker.js copied to public directory');
} else {
  console.error('pdf.worker.js not found');
}
