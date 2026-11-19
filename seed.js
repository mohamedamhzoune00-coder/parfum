const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const seedDB = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ متصل بـ MongoDB');

    // مسح البيانات القديمة
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ البيانات القديمة تمسحت');

    // ===== 1. إنشاء الأدمن الافتراضي =====
    const admin = await User.create({
      name: 'Zaki Admin',
      email: 'admin@parfumzaki.ma',
      password: 'admin123456',
      role: 'admin',
    });
    console.log(`👤 أدمن تزاد: ${admin.email} (كلمة السر: admin123456)`);

    // ===== 2. إنشاء الفئات =====
    const categories = await Category.insertMany([
      { name: 'Homme', slug: 'homme' },
      { name: 'Femme', slug: 'femme' },
      { name: 'Unisexe', slug: 'unisexe' },
      { name: 'Collection Privée', slug: 'collection-privee' },
    ]);
    console.log(`📂 ${categories.length} فئات تزادو`);

    const catHomme = categories.find((c) => c.name === 'Homme');
    const catFemme = categories.find((c) => c.name === 'Femme');
    const catUnisexe = categories.find((c) => c.name === 'Unisexe');
    const catPrivee = categories.find((c) => c.name === 'Collection Privée');

    // ===== 3. إنشاء 5 منتجات عطور تجريبية =====
    const products = await Product.insertMany([
      {
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        category: catHomme._id,
        description:
          'عطر رجالي فاخر من شانيل، مزيج ديال النعناع والجريب فروت مع خشب الأرز. ريحة أنيقة وعصرية كتناسب كل الأوقات.',
        images: ['https://placehold.co/600x600/1a1a2e/ffffff?text=Bleu+de+Chanel'],
        variants: [
          { ml: 50, price: 850, stock: 15 },
          { ml: 100, price: 1200, stock: 10 },
          { ml: 150, price: 1500, stock: 5 },
        ],
        isActive: true,
        isBestSeller: true,
      },
      {
        name: 'Miss Dior Blooming Bouquet',
        brand: 'Dior',
        category: catFemme._id,
        description:
          'عطر نسائي رومانسي من ديور، فيه نوتات ديال الورد والفاوانيا مع المسك الأبيض. مثالي للاستعمال اليومي.',
        images: ['https://placehold.co/600x600/e8d5b7/333333?text=Miss+Dior'],
        variants: [
          { ml: 30, price: 650, stock: 20 },
          { ml: 50, price: 950, stock: 12 },
          { ml: 100, price: 1350, stock: 8 },
        ],
        isActive: true,
        isBestSeller: true,
      },
      {
        name: 'Oud Wood',
        brand: 'Tom Ford',
        category: catUnisexe._id,
        description:
          'عطر يونيسكس فاخر من توم فورد، مبني على خشب العود مع الفانيليا والعنبر. ريحة دافئة وفخمة.',
        images: ['https://placehold.co/600x600/2d2d2d/gold?text=Oud+Wood'],
        variants: [
          { ml: 50, price: 2200, stock: 7 },
          { ml: 100, price: 3200, stock: 4 },
        ],
        isActive: true,
        isBestSeller: false,
      },
      {
        name: 'Sauvage Elixir',
        brand: 'Dior',
        category: catHomme._id,
        description:
          'النسخة الأقوى من سوفاج ديور. تركيز عالي، فيه اللافندر والقرفة مع خشب الصندل. كيدوم طول النهار.',
        images: ['https://placehold.co/600x600/0d1b2a/ffffff?text=Sauvage+Elixir'],
        variants: [
          { ml: 60, price: 1800, stock: 10 },
          { ml: 100, price: 2400, stock: 6 },
        ],
        isActive: true,
        isBestSeller: true,
      },
      {
        name: 'Baccarat Rouge 540',
        brand: 'Maison Francis Kurkdjian',
        category: catPrivee._id,
        description:
          'عطر استثنائي، من أشهر العطور فالعالم. مزيج ديال الزعفران والعنبر مع خشب الأرز. ريحة فريدة ومميزة.',
        images: ['https://placehold.co/600x600/8b0000/gold?text=Baccarat+Rouge'],
        variants: [
          { ml: 35, price: 2800, stock: 5 },
          { ml: 70, price: 4500, stock: 3 },
          { ml: 200, price: 8500, stock: 2 },
        ],
        isActive: true,
        isBestSeller: true,
      },
    ]);
    console.log(`🧴 ${products.length} منتجات تجريبية تزادو`);

    // ===== ملخص =====
    console.log('\n========================================');
    console.log('✅ Seed تم بنجاح!');
    console.log('========================================');
    console.log(`👤 Admin: admin@parfumzaki.ma / admin123456`);
    console.log(`📂 Categories: ${categories.length}`);
    console.log(`🧴 Products: ${products.length}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ فالـ Seed:', error.message);
    process.exit(1);
  }
};

seedDB();
