const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up Job Listing Application...\n');

// Create .env.local file if it doesn't exist
const envContent = `MONGODB_URI=mongodb://localhost:27017/job-listing-app
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret`;

if (!fs.existsSync('.env.local')) {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the .env.local file with your actual credentials');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');
console.log('5. Setup admin user: curl -X POST http://localhost:3000/api/setup-admin');
console.log('\n🔑 Default Admin Credentials:');
console.log('Username: admin');
console.log('Password: admin123');
console.log('\n✨ Setup complete! Happy coding!');
