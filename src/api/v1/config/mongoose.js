const mongoose = require("mongoose");

const db = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://qpadmin:SquadOfM1R5@10.2.0.50:7140/fabloExpress?authSource=admin"
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
