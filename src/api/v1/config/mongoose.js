const mongoose = require("mongoose");

const db = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://qpadmin:sejwYz-1gabxy-pohgar@marketplace-01.ixpmpxa.mongodb.net/fabloExpress?authSource=admin"
    );
    console.log(
      "MongoDB connected successfully on:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = db;
