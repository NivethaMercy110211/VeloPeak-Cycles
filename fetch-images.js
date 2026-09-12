const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  'assets/images/hero/hero-home-1.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-home-2.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-bikes.jpg': 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-accessories.jpg': 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-services.jpg': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-brands.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-about.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1600&auto=format&fit=crop&q=80',
  'assets/images/hero/hero-contact.jpg': 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1600&auto=format&fit=crop&q=80',
  
  'assets/images/bikes/cat-road.jpg': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/cat-mountain.jpg': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/cat-hybrid.jpg': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/cat-electric.jpg': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/cat-kids.jpg': 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
  
  'assets/images/bikes/road-apex-r1.jpg': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/mtb-summit-x7.jpg': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/hybrid-metroflow.jpg': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/ebike-voltride.jpg': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/kids-trail-24.jpg': 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/road-aero-pro.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/mtb-enduro-9.jpg': 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&auto=format&fit=crop&q=80',
  'assets/images/bikes/gravel-ridge-gx.jpg': 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&auto=format&fit=crop&q=80',
  
  'assets/images/bikes/bike-detail-1.jpg': 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&auto=format&fit=crop&q=80',
  'assets/images/bikes/bike-detail-2.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&auto=format&fit=crop&q=80',
  'assets/images/bikes/bike-detail-3.jpg': 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1200&auto=format&fit=crop&q=80',
  'assets/images/bikes/bike-detail-4.jpg': 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=1200&auto=format&fit=crop&q=80',

  'assets/images/accessories/helmet-aero.jpg': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/helmet-mtb.jpg': 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/light-lumen-1200.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/lock-secure-u.jpg': 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/apparel-jersey.jpg': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/gloves-pro.jpg': 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/bag-saddle.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/pump-floor.jpg': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/repair-tool-kit.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
  'assets/images/accessories/bike-computer.jpg': 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&auto=format&fit=crop&q=80',

  'assets/images/services/workshop-stand.jpg': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=1000&auto=format&fit=crop&q=80',
  'assets/images/services/mechanic-wheel.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
  'assets/images/services/chain-clean.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',

  'assets/images/cta/cta-home-1.jpg': 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-home-2.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-bikes.jpg': 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-accessories.jpg': 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-services.jpg': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-brands.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-about.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1600&auto=format&fit=crop&q=80',
  'assets/images/cta/cta-contact.jpg': 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1600&auto=format&fit=crop&q=80',

  'assets/images/auth/auth-login.jpg': 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1200&auto=format&fit=crop&q=80',
  'assets/images/auth/auth-register.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop&q=80',
  'assets/images/auth/auth-forgot.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&auto=format&fit=crop&q=80',
  
  'assets/images/common/store-front.jpg': 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1000&auto=format&fit=crop&q=80',
  'assets/images/common/workshop-team.jpg': 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1000&auto=format&fit=crop&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading curated bike images...');
  for (const [filepath, url] of Object.entries(images)) {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      await download(url, filepath);
      console.log(`Saved: ${filepath}`);
    } catch (e) {
      console.error(`Failed ${filepath}:`, e.message);
    }
  }
  console.log('All images downloaded successfully.');
}

run();
