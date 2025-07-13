const mongoose= require("mongoose");
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // optional but recommended
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


// const connectDB = mongoose.connect(
//     "mongodb+srv://bagriaabhinav:abhinavbagria@cluster0.dyszgns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// );

module.exports=connectDB;