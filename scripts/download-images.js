const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash image IDs for our products
const images = {
  categories: {
    'apparel-hero': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&h=600&fit=crop&q=85', // Clothing rack
    'bags-hero': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1600&h=600&fit=crop&q=85', // Collection of bags
    'tech-hero': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=600&fit=crop&q=85', // Tech devices
    'drinkware-hero': 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=1600&h=600&fit=crop&q=85', // Water bottles
  },
  products: {
    'tshirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=85', // White t-shirt
    'polo': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=600&fit=crop&q=85', // Polo shirt
    'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&q=85', // Hoodie
    'jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop&q=85', // Jacket
  }
};

// Ensure directories exist
const dirs = [
  './public/images',
  './public/images/categories',
  './public/images/products'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Download images
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filename);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filename, () => reject(err));
      });
    }).on('error', reject);
  });
};

// Download all images
async function downloadAllImages() {
  const downloads = [];

  // Download category images
  for (const [name, url] of Object.entries(images.categories)) {
    const filename = path.join('./public/images/categories', `${name}.jpg`);
    downloads.push(downloadImage(url, filename));
  }

  // Download product images
  for (const [name, url] of Object.entries(images.products)) {
    const filename = path.join('./public/images/products', `${name}.jpg`);
    downloads.push(downloadImage(url, filename));
  }

  try {
    await Promise.all(downloads);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages(); 