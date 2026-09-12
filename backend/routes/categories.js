const express = require('express');
const router = express.Router();
const {
  getCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/seed-temp', async (req, res) => {
  try {
    const User = require('../models/User');
    const ServiceProvider = require('../models/ServiceProvider');
    const Category = require('../models/Category');
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
    const hp = await bcrypt.hash('prov123', 10);
    const ha = await bcrypt.hash('admin123', 10);
    const hu = await bcrypt.hash('user123', 10);
    await User.create({ name: 'Admin', email: 'admin@fixit.com', password: ha, role: 'admin', phone: '1234567890' });
    await User.create({ name: 'Try User', email: 'try@gmail.com', password: hu, role: 'user', phone: '+234668801', address: '25 street main' });
    const professions = ['Electrician', 'Plumber', 'Painter', 'AC Technician', 'Carpenter', 'Cleaner'];
    const names = ['Ahmed Ali', 'Sara Khan', 'Omar Hassan', 'Fatima Noor', 'Usman Sheikh', 'Ayesha Malik', 'Hassan Raza', 'Zainab Bibi', 'Bilal Ahmed', 'Mehreen Shah', 'Tariq Mehmood', 'Nadia Parveen', 'Imran Siddiqui', 'Sanaullah Khan', 'Rashid Mahmood', 'Kainat Javed', 'Farhan Malik', 'Hira Naveed', 'Asad Rehman', 'Bushra Kausar', 'Danish Raza', 'Esha Qureshi', 'Faisal Naveed', 'Gulzar Khan', 'Humaira Saleem', 'Irfan Ali', 'Javeria Siddiqui', 'Kamran Tariq', 'Laraib Fatima', 'Mansoor Ahmed'];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
    const providers = [];
    for (let i = 0; i < 30; i++) {
      const prof = professions[i % professions.length];
      providers.push(await ServiceProvider.create({ name: names[i], email: names[i].toLowerCase().replace(/ /g, '.') + '@fixit.com', password: hp, phone: '03' + Math.floor(100000000 + Math.random() * 900000000), profession: prof, experience: Math.floor(2 + Math.random() * 13), pricePerHour: Math.floor(20 + Math.random() * 60), description: 'Professional ' + prof.toLowerCase() + ' with ' + (2 + i) + ' years experience', rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, totalReviews: Math.floor(Math.random() * 50), isApproved: true }));
    }
    res.json({ message: 'Seeded!', categories: categories.length, providers: providers.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/:id', getCategoryById);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
