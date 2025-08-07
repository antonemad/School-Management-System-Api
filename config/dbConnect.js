const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(`Connection failed : ${err.message}`);
    process.exit(1);
  }
};

dbConnect();
