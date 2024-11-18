
const User = require('../../models/User');

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

module.exports = {
    updateProfile,
};
