const {
  badRequest,
  unknownError,
  alreadyExist,
} = require("./response.helper.js");
const moment = require("moment-timezone");
const { checkInsModel } = require("../models/checkIn.model.js");
const mongoose = require("mongoose");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js");

//request from controller to checkIn
const addCheckInRequest = async (
  riderId,
  checkInKiloMeters,
  inLocalFilePath
) => {
  try {
    // Take id and time from the separate created function
    const checkInId = await generateRandomBytes(8);
    const Time = getTimeInIST();
    // console.log(Time);
    // console.log(Time.split(",")[0]);
    // console.log(Time.split(",")[0]);
    let compareTime = Time.split(",")[0];
    console.log(compareTime);

    // Take image from the separate created function
    const checkInImage = await uploadImage(inLocalFilePath);

    // Construct data object for check-in
    const data = {
      riderId: riderId,
      checkIn: {
        checkInId: checkInId,
        checkInTime: Time,
        checkInImage: checkInImage.url,
        checkInKiloMeters: checkInKiloMeters,
      },
      distance: checkInKiloMeters, // Assuming you want to set distance to checkInKiloMeters
    };
    let checkInData;
    //checking if there is already a checkin by the same user
    const checkedInData = await checkInsModel.findOne({ riderId: riderId });
    if (
      checkedInData &&
      checkedInData.checkIn &&
      checkedInData.checkIn.checkInTime
    ) {
      let retrievedTime = checkedInData.checkIn.checkInTime;
      //  console.log(retrievedTime);
      let formattedTime = retrievedTime.split(",")[0];
      console.log(formattedTime);

      if (formattedTime === compareTime) {
        return {
          status: false,
          message: "Rider already checkedIn for today!",
          // data: error,
        };
      }
    }
    // Save the check-in data
    checkInData = await checkInsModel.create(data);

    console.log(checkInData);

    if (!checkInData) {
      return {
        status: false,
        message: "Failed to save the Check-In Data!!",
        //data: error,
      };
    }

    return {
      status: true,
      message: "Check-In Data Saved Successfully!!",
      data: checkInData,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, data: error };
  }
};

//request from controller to checkOut
const addCheckOutRequest = async (
  riderId,
  checkInOutId,
  checkOutKiloMeters,
  outLocalFilePath
) => {
  try {
    const checkingOutTime = getTimeInIST();
    //console.log(checkOutTime);
    const Time = checkingOutTime.split(",")[0];
    console.log(Time);

    const checkOutImage = await uploadImage(outLocalFilePath);
    // console.log(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath)

    //checking if the rider has already checkedOut or not
    const checkOutData = await checkInsModel.findOne({ riderId: riderId });
    if (
      checkOutData &&
      checkOutData.checkOut &&
      checkOutData.checkOut.checkOutTime
    ) {
      let retrievedTime = checkOutData.checkOut.checkOutTime;
      // console.log(retrievedTime);
      let retrievedTimeSplit = retrievedTime.split(",")[0];
      // console.log(retrievedTimeSplit);
      if (Time === retrievedTimeSplit) {
        return {
          status: false,
          message: "You have already checked out!!",
        };
      }
    }

    const data = await checkInsModel.findOne({
      "checkIn.checkInId": checkInOutId,
    });
    // const data = await checkInsModel.findById(checkInOutId);

    //const checkInData = data.checkIn || {};

    if (!data) {
      return {
        status: false,
        message: "No check-in data found for the provided checkInOutId",
      };
    }

    if (data.checkIn.checkInId.toString() !== checkInOutId) {
      return {
        status: false,
        message: "Invalid riderId or checkInOutId provided",
      };
    }

    if (data.checkIn.checkInKiloMeters > checkOutKiloMeters) {
      return {
        status: false,
        message:
          "Please enter checkOutKiloMeters greater than checkInKiloMeters!!",
      };
    }
    if (data.checkIn.checkInKiloMeters == checkOutKiloMeters) {
      return {
        status: false,
        message: "You have travelled for zero distance today!!",
      };
    }
    //console.log(checkInData.kiloMeters);
    const startDst = data.checkIn?.kiloMeters || 0;

    console.log(startDst);
    const endDst = checkOutKiloMeters;

    if (isNaN(data.checkIn.checkInKiloMeters) || isNaN(checkOutKiloMeters)) {
      return {
        status: false,
        message: "Invalid values for checkIn and checkOut Kilometers!",
      };
    }

    if (endDst < startDst) {
      return {
        status: false,
        message: "checkOutKiloMeters must be greater than checkInKiloMeters!",
        endDst,
      };
    } else if (endDst === startDst) {
      return {
        status: false,
        message: "You traveled Zero(0) kilometers today!",
      };
    }

    let distance = checkOutKiloMeters - data.checkIn.checkInKiloMeters;

    data.checkOut = {
      checkOutTime: checkingOutTime, //.format("MMMM Do YYYY, h:mm:ss a"),
      checkOutImage: checkOutImage.url,
      checkOutKilometers: checkOutKiloMeters,
    };
    data.distance = distance;

    await data.save();
    // console.log(data)
    return {
      status: true,
      message: "Check-Out Data Saved Successfully!!",
      data: data,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to get checkIn data by riderId
const getCheckInRequest = async (riderId) => {
  try {
    const Data = await checkInsModel.findOne({ riderId: riderId });

    if (!Data) {
      return {
        status: false,
        message: "Data Not Found of Given Rider!",
      };
    }

    let checkedInData = Data.checkIn;
    return {
      status: true,
      message: "Check-In Data Retrieved Successfully!!",
      data: checkedInData,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, data: error };
  }
};
//request from controller to update checkIn
const updateCheckInRequest = async (
  riderId,
  checkInKiloMeters,
  inLocalFilePath,
  checkInId
) => {
  try {
    const Time = getTimeInIST();
    const updationTime = Time.split(",")[0];

    const data = await checkInsModel.findOne({
      riderId: riderId,
      "checkIn.checkInId": checkInId,
    });

    console.log(data);

    if (!data) {
      return {
        status: false,
        message: "Check-In Data Not Found to Update it!",
      };
    }

    if (data.riderId !== riderId) {
      return {
        status: false,
        message: "You are not permitted to update the data!",
      };
    }

    const checkedInTime = data.checkIn.checkInTime.split(",")[0].toString();
    if (checkedInTime !== updationTime) {
      return {
        status: false,
        message: "You can only update the data of the same day!",
      };
    }

    if (inLocalFilePath !== data.checkIn.checkInImage) {
      const updatedCheckInImage = await uploadImage(inLocalFilePath);
      data.checkIn.checkInImage = updatedCheckInImage.url;
    } else {
      return {
        status: false,
        message:
          "Image is same as the existing image!, please provide a different image",
      };
    }

    if (checkInKiloMeters !== data.checkIn.checkInKiloMeters) {
      data.checkIn.checkInKiloMeters = checkInKiloMeters;
      data.distance = checkInKiloMeters;
    } else {
      return {
        status: false,
        message: "checkInKiloMeters is same as existing uploaded KiloMeters!",
      };
    }

    await data.save();
    return {
      status: true,
      message: "Data Updated Successfully!!",
      data: data,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to update checkOut
const updateCheckOutRequest = async (
  riderId,
  checkOutKiloMeters,
  outLocalFilePath,
  checkInId
) => {
  try {
    const Time = getTimeInIST();
    const updationTime = Time.split(",")[0];

    const data = await checkInsModel.findOne({
      riderId: riderId,
      "checkIn.checkInId": checkInId,
    });

    if (!data) {
      return {
        status: false,
        message: "Data Not Found to Update it!",
      };
    }

    if (data.riderId !== riderId) {
      return {
        status: false,
        message: "You are not permitted to update the data!",
      };
    }

    const checkedOutTime = data.checkOut.checkOutTime.split(",")[0].toString();
    if (checkedOutTime !== updationTime) {
      return {
        status: false,
        message: "You can only update the data of the same day!",
      };
    }

    if (outLocalFilePath !== data.checkOut.checkOutImage) {
      const updatedCheckOutImage = await uploadImage(outLocalFilePath);
      data.checkOut.checkOutImage = updatedCheckOutImage.url;
    } else {
      return {
        status: false,
        message:
          "Image is same as the existing image!, please provide a different image",
      };
    }

    //checkout kilometer must be greater than checkInKilometers
    if (checkOutKiloMeters < data.checkIn.checkInKiloMeters) {
      return {
        status: false,
        message:
          "check-out Kilometers must be greater than check-In KiloMeters!",
      };
    }
    if (checkOutKiloMeters === data.checkIn.checkInKiloMeters) {
      return {
        status: false,
        message: "You have travelled Zero KiloMeters today!",
      };
    }
    if (checkOutKiloMeters !== data.checkOut.checkOutKiloMeters) {
      data.checkOut.checkOutKiloMeters = checkOutKiloMeters;
      data.distance = checkOutKiloMeters - data.checkIn.checkInKiloMeters;
    } else {
      return {
        status: false,
        message: "checkOutKiloMeters is same as existing uploaded KiloMeters!",
      };
    }

    await data.save();
    return {
      status: true,
      message: "Data Updated Successfully!!",
      data: data,
    };
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to delete checkIn
const deleteCheckInRequest = async (riderId, checkInId) => {
  try {
    const data = await checkInsModel.findOne({
      riderId: riderId,
      "checkIn.checkInId": checkInId,
    });

    if (!data) {
      return {
        status: false,
        message: "Data Not Found for deleting!",
      };
    }
    if (data.checkIn && data.distance > 0) {
      data.checkIn = undefined; //set checkIn to undefined to remove it from document
      data.distance = 0;

      await data.save();

      return {
        status: true,
        message: "Check-In Data Deleted Successfully!",
      };
    } else {
      return {
        status: false,
        message: "Check-In Data Not Found in the document!",
      };
    }
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};

//request from controller to delete checkOut
const deleteCheckOutRequest = async (riderId, checkInId) => {
  try {
    const data = await checkInsModel.findOne({
      riderId: riderId,
      "checkIn.checkInId": checkInId,
    });

    if (!data) {
      return {
        status: false,
        message: "Data Not Found for deleting!",
      };
    }
    if (data.checkOut && data.distance >= 0) {
      data.checkOut = undefined; //set checkIn to undefined to remove it from document
      data.distance = data.checkIn.checkInKiloMeters;

      await data.save();

      return {
        status: true,
        message: "Check-Out Data Deleted Successfully!",
      };
    } else {
      return {
        status: false,
        message: "Check-Out Data Not Found in the document!",
      };
    }
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, error: error };
  }
};
module.exports = {
  getCheckInRequest,

  addCheckInRequest,
  addCheckOutRequest,
  updateCheckInRequest,
  updateCheckOutRequest,
  deleteCheckInRequest,
  deleteCheckOutRequest,
};
