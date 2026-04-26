require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function setupAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin' });
    if (adminExists) {
      console.log('⚠️ Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin',
      password: 'Raosahab_lakshya@2506',
      role: 'admin',
      currentClass: 12
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin');
    console.log('🔐 Password: Raosahab_lakshya@2506');
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupAdmin();
