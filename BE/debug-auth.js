require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check what users exist
    const users = await User.find({}).select('+password');
    console.log('Users in database:', users.length);

    users.forEach(user => {
      console.log(`- ${user.username}: ${user.role}, password hash exists: ${!!user.password}`);
    });

    // Test password comparison manually
    if (users.length > 0) {
      const admin = users.find(u => u.username === 'admin');
      if (admin) {
        console.log('\nTesting admin password...');
        const isValid = await bcrypt.compare('admin123', admin.password);
        console.log('Password valid:', isValid);

        // Test User.findOne
        const foundUser = await User.findOne({ username: 'admin' }).select('+password');
        if (foundUser) {
          console.log('User found by findOne:', foundUser.username);
          const compareResult = await foundUser.comparePassword('admin123');
          console.log('comparePassword result:', compareResult);
        }
      }
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}




