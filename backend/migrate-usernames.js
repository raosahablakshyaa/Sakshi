require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function migrateUsernames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find all users without username
    const usersWithoutUsername = await User.find({ username: { $exists: false } });
    console.log(`Found ${usersWithoutUsername.length} users without username`);

    let updated = 0;
    for (const user of usersWithoutUsername) {
      // Generate username from email
      let username = user.email.split('@')[0].toLowerCase();
      let counter = 1;
      
      // Check if username already exists
      while (await User.findOne({ username: username })) {
        username = `${user.email.split('@')[0].toLowerCase()}${counter}`;
        counter++;
      }
      
      user.username = username;
      await user.save();
      updated++;
      console.log(`✅ Updated ${user.email} → username: ${username}`);
    }

    console.log(`\n✅ Migration complete! Updated ${updated} users`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

migrateUsernames();
