const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // التحقق من وجود MONGO_URI
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI مامحددش فـ ملف .env!');
      console.error('💡 حط الرابط ديال MongoDB Atlas فـ ملف .env');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطأ فالاتصال بـ MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
