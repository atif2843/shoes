const fs = require('fs');
const path = require('path');

// Create the public/images directory if it doesn't exist
const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy marker icons from leaflet dist to public/images
const leafletPath = path.join(process.cwd(), 'node_modules', 'leaflet', 'dist', 'images');
const files = ['marker-icon.png', 'marker-icon-2x.png', 'marker-shadow.png'];

files.forEach(file => {
  const src = path.join(leafletPath, file);
  const dest = path.join(publicImagesDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to public/images/`);
  } else {
    console.warn(`Warning: ${file} not found in leaflet dist folder`);
  }
}); 