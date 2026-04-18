require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Charity = require('./models/Charity.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: 'GolfHeroes Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
      subscription: { status: 'active', plan: 'yearly' },
    });
    console.log('✅ Admin created:', process.env.ADMIN_EMAIL);
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Seed charities
  const charities = [
    { name: 'Green Fairways Foundation', description: 'Supporting junior golfers from underprivileged backgrounds to access the sport they love.', category: 'Sports', isFeatured: true },
    { name: 'Caddy Cares', description: 'Providing mental health support and financial assistance to golf caddies in need.', category: 'Welfare' },
    { name: 'Golf for Good', description: 'Running golf events to raise funds for local community projects and food banks.', category: 'Community' },
    { name: 'Birdie for Blindness', description: 'Each birdie played contributes to eye care research and treatment for those who cannot afford it.', category: 'Healthcare' },
  ];

  for (const c of charities) {
    const exists = await Charity.findOne({ name: c.name });
    if (!exists) { await Charity.create(c); console.log('✅ Charity:', c.name); }
  }

  console.log('\n🌱 Seed complete!');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });