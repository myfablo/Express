const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const { getTimeInIST } = require("../helpers/other.helper.js");

const checkInSchema = new Schema(
  {
    riderId: {
      type: String,
      required: true,
    },
    checkIn: {
      checkInId: {
        type: String,
        // required :true
      },

      checkInTime: {
        type: String,
      },
      checkInImage: {
        type: String,
      },
      checkInKiloMeters: {
        type: Number,
      },
    },
    checkOut: {
      checkOutTime: {
        type: String,
      },
      checkOutImage: {
        type: String,
      },
      checkOutKilometers: {
        type: Number,
      },
    },
    distance: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Middleware to check if rider has already checked in on the current day
checkInSchema.pre("save", async function (next) {
  try {
    const time = getTimeInIST(); // Await the asynchronous operation
    const riderId = this.riderId;
    const startOfDay = time.startOf("day").toDate();
    const endOfDay = time.endOf("day").toDate();

    // Check if the rider has already checked in on the current day
    const existingCheckIn = await this.constructor.findOne({
      riderId,
      "checkIn.checkInTime": { $gte: startOfDay, $lt: endOfDay }, // Adjusted path to 'checkIn.checkInTime'
    });

    if (existingCheckIn) {
      const error = new Error("Rider has already checked in today.");
      return next(error);
    }

    next(); // Continue with the save operation if there's no existing check-in for the rider on the current day
  } catch (error) {
    console.log(error);
    next(error); // Pass any errors to the next middleware
  }
});

const checkInsModel = mongoose.model("checkins", checkInSchema); // Corrected model name
module.exports = { checkInsModel };
