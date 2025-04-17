const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../node_modules/leaflet/dist/images');
const targetDir = path.join(__dirname, '../public/images');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy marker files
const markerFiles = ['marker-icon.png', 'marker-icon-2x.png', 'marker-shadow.png'];

markerFiles.forEach(file => {
  fs.copyFileSync(
    path.join(sourceDir, file),
    path.join(targetDir, file)
  );
  console.log(`Copied ${file} to public/images/`);
}); 