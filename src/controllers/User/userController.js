const User = require("../../models/User");
const cloudinary = require("../../config/cloudinaryConfig");

// Update Profile API
const updateProfile = async (req, res) => {
  const { userName, email, mobileNo, address } = req.body.userData;
  const userId = req.user.id; // Get user ID from the decoded token

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (mobileNo) user.mobileNo = mobileNo;
    if (address) user.address = address;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        mobileNo: user.mobileNo,
        address: user.address,
        aadharCardNo: user.aadharCardNo,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


const uploadProfileImage = async (req, res) => {
  const userId = req.user.id; // Get user ID from the decoded token  
  
  if (!req.file) {  
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {      
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Loan_user_profiles",
        public_id: `${userId}_profile_image`, 
        resource_type: "image", 
      },
      async (error, result) => {
        if (error) {
          console.log('Error uploading to Cloudinary:', error);
          return res.status(500).json({
            message: "Server error while uploading to Cloudinary",
            error: error.message,
          });
        }
        // Log Cloudinary result
        console.log('Cloudinary upload result:', result);
        const imageUrl = result.secure_url; 
        console.log('Image URL:', imageUrl); 

        // Find the user and update the profile image URL
        const user = await User.findById(userId);
        if (!user) {
          console.log('User not found'); 
          return res.status(404).json({ message: "User not found." });
        }

        user.profileImage = imageUrl; 

        await user.save();
        console.log('User profile image updated successfully'); 

        return res.status(200).json({
          message: "Profile image updated successfully.",
          user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            mobileNo: user.mobileNo,
            address: user.address,
            aadharCardNo: user.aadharCardNo,
            profileImage: user.profileImage, 
          },
        });
      }
    );

    // Pipe the file buffer from multer to Cloudinary upload stream
    stream.end(req.file.buffer);

  } catch (error) {
    console.error("Error uploading profile image:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message, 
    });
  }
};


module.exports = {
  updateProfile,
  uploadProfileImage, // Export the new upload function
};
