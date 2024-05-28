const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dpox4drsw",
  api_key: "654613913124377",
  api_secret: "1OAEFB8DF2dWrHRxItcSBsiOnbk",
});

// Utility function to handle file deletion
const deleteLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete local file:', err);
        return;
      }
      console.log('File deleted successfully');
    });
  } catch (error) {
    console.error("Failed to delete local file", error);
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new Error("Provide local file path");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (!response) {
      throw new Error("There is a problem while uploading the file!");
    }

    console.log(`File has been uploaded successfully to: ${response.url}`);

    await deleteLocalFile(localFilePath);
    return response;
  } catch (error) {
    await deleteLocalFile(localFilePath);
    throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
  }
};

module.exports = uploadOnCloudinary;
