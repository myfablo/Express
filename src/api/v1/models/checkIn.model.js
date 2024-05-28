const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

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
      checkOutKiloMeters: {
        type: Number,
      },
    },
    distance: {
      type: Number,
    },
    totalTime: {
      type: String,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const checkInsModel = mongoose.model("checkins", checkInSchema); // Corrected model name
module.exports = { checkInsModel };
