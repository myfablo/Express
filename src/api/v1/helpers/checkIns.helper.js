const { badRequest, unknownError } = require("./response.helper.js");
const {checkInsModel} = require("../models/checkIn.model.js");
const mongoose = require("mongoose");
const {
  generateRandomBytes,
  getTimeInIST,
  uploadImage,
} = require("./other.helper.js"
)

 

//request from controller to checkIN
const getCheckInRequest = async (riderId, checkInKiloMeters, inLocalFilePath) => {
  try {
    //take id and time from the separate created function!!
    const checkInId = await generateRandomBytes(8);
    const checkInTime = getTimeInIST();

    //now take image from the separate created function!!
    const checkInImage = await uploadImage(inLocalFilePath);


// Assuming riderId, checkInId, checkInTime, checkInImage, and checkInkiloMeters are defined elsewhere
const data = {
  riderId: riderId,
  checkIn: {
    checkInId: checkInId,
    checkInTime: checkInTime,
    checkInImage: checkInImage.url,
    checkInKiloMeters: checkInKiloMeters,
  },
  distance: checkInKiloMeters, // Assuming you want to set distance to checkInKiloMeters
};

const checkInData = await checkInsModel(data);


checkInData.save()
console.log(checkInData)

if(!checkInData){
  return { status: false, message: "Failed to save the CheckIn Data!!",data:error }
}
  
return {
      status: true,
      message: "Check-In Data Saved Successfully!!",
      data :checkInData,
    };

  
  } catch (error) {
    console.log(error);
    return { status: false, message: error.message, data:error };
  }
};

//fxn to help the checkout controller
const getCheckOutRequest = async (riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath) => {
  try {
    const checkOutTime = getTimeInIST();
    const checkOutImage = await uploadImage(outLocalFilePath);
   // console.log(riderId, checkInOutId, checkOutKiloMeters, outLocalFilePath)

   const data = await checkInsModel.findById({ 'checkIn.checkInId': checkInOutId });
   // const data = await checkInsModel.findById(checkInOutId);

    //const checkInData = data.checkIn || {};

    if (!data) {
      return { status: false, message: "No check-in data found for the provided checkInOutId" };
    }

    if (data.checkIn.checkInId.toString() !== checkInOutId) {
      return { status: false, message: "Invalid riderId or checkInOutId provided" };
    }
     console.log(checkInData.kiloMeters);
     const startDst = data.checkIn?.kiloMeters || 0;
     
    console.log(startDst)
    const endDst = checkOutKiloMeters;

    if (isNaN(startDst) || isNaN(endDst)) {
      return { status: false, message: "Invalid values for startDst or endDst" };
    }

    if (endDst < startDst) {
      return { status: false, message: "checkOutKiloMeters must be greater than checkInKiloMeters!", endDst };
    } else if (endDst === startDst) {
      return { status: false, message: "You traveled Zero(0) kilometers today!" };
    }

    let distance = endDst - startDst;

    data.checkOut = {
      checkOutTime: checkOutTime,
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
    return { status: false, message: error.message, error:error };
  }
};
module.exports = { getCheckInRequest, getCheckOutRequest };
