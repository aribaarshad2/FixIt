const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');
const noShowRoutes = require('./routes/noshow');
const favoriteRoutes = require('./routes/favorites');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'FixIt API is running' }));

// Temporary seed endpoint - remove after seeding
app.get('/api/seed-temp', async (req, res) => {
  try {
    const User = require('./models/User');
    const ServiceProvider = require('./models/ServiceProvider');
    const Category = require('./models/Category');
    const bcrypt = require('bcryptjs');

    await User.deleteMany({});
    await ServiceProvider.deleteMany({});
    await Category.deleteMany({});

    const categories = await Category.create([
      { name: 'Electrician', description: 'Electrical repairs, installation, wiring' },
      { name: 'Plumber', description: 'Pipe repair, drainage, water heater' },
      { name: 'Painter', description: 'Interior & exterior painting' },
      { name: 'AC Technician', description: 'AC repair, installation, servicing' },
      { name: 'Carpenter', description: 'Furniture, cabinets, woodwork' },
      { name: 'Cleaner', description: 'Home & office cleaning services' },
    ]);

    const hashedPassword = await bcrypt.hash('prov123', 10);
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedUser = await bcrypt.hash('user123', 10);

    await User.create({ name: 'Admin', email: 'admin@fixit.com', password: hashedAdmin, role: 'admin', phone: '1234567890' });
    await User.create({ name: 'Try User', email: 'try@gmail.com', password: hashedUser, role: 'user', phone: '+234668801', address: '25 street main' });

    const professions = ['Electrician', 'Plumber', 'Painter', 'AC Technician', 'Carpenter', 'Cleaner'];
    const names = ['Ahmed Ali', 'Sara Khan', 'Omar Hassan', 'Fatima Noor', 'Usman Sheikh', 'Ayesha Malik', 'Hassan Raza', 'Zainab Bibi', 'Bilal Ahmed', 'Mehreen Shah', 'Tariq Mehmood', 'Nadia Parveen', 'Imran Siddiqui', 'Sanaullah Khan', 'Rashid Mahmood', 'Kainat Javed', 'Farhan Malik', 'Hira Naveed', 'Asad Rehman', 'Bushra Kausar', 'Danish Raza', 'Esha Qureshi', 'Faisal Naveed', 'Gulzar Khan', 'Humaira Saleem', 'Irfan Ali', 'Javeria Siddiqui', 'Kamran Tariq', 'Laraib Fatima', 'Mansoor Ahmed'];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

    const providers = [];
    for (let i = 0; i < 30; i++) {
      const prof = professions[i % professions.length];
      const user = await User.create({ name: names[i], email: `${names[i].toLowerCase().replace(/ /g, '.')}@fixit.com`, password: hashedPassword, role: 'provider', phone: `03${Math.floor(100000000 + Math.random() * 900000000)}` });
      providers.push(await ServiceProvider.create({ user: user._id, profession: prof, experience: Math.floor(2 + Math.random() * 13), pricePerHour: Math.floor(20 + Math.random() * 60), description: `Professional ${prof.toLowerCase()} with ${2 + i} years experience`, rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, totalReviews: Math.floor(Math.random() * 50), city: cities[i % cities.length], verified: true }));
    }

    res.json({ message: 'Seeded!', categories: categories.length, providers: providers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/noshow', noShowRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);

// Serve built frontend in production
const path = require('path');
const fs = require('fs');
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
const frontendIndex = path.join(frontendBuild, 'index.html');
if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(frontendIndex);
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

connectDB().then((connected) => {
  app.listen(PORT, () => {
    console.log(`FixIt server running on port ${PORT}`);
    if (!connected) {
      console.log('NOTE: MongoDB not connected. API endpoints requiring DB will fail.');
      console.log('Install MongoDB locally or update MONGO_URI in .env');
    }
  });
}).catch((err) => {
  console.error('Failed to start server:', err.message);
  app.listen(PORT, () => console.log(`FixIt server running on port ${PORT} (no DB)`));
});
