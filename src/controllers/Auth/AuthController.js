const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const { sendVerificationEmail } = require("../../utils/mailer");
const { validateEmail, validateMobile } = require("../../utils/authHelpers");

const signupUser = async (req, res) => {
  const { email, userName, password, address, aadharCardNo, mobileNo } =
    req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const mobileExists = await User.findOne({ mobileNo });
    if (mobileExists) {
      return res
        .status(400)
        .json({ message: "Mobile number is already in use" });
    }

    const aadharExists = await User.findOne({ aadharCardNo });
    if (aadharExists) {
      return res
        .status(400)
        .json({ message: "Aadhar card number is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      address,
      aadharCardNo,
      mobileNo,
      userName,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        address: newUser.address,
        aadharCardNo: newUser.aadharCardNo,
        mobileNo: newUser.mobileNo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const signInUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  try {

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        message: "Please provide email or mobile number, and password.",
      });
    }

    let user;
    if (validateEmail(emailOrMobile)) {
      // If it's an email, search by email
      user = await User.findOne({ email: emailOrMobile });
    } else if (validateMobile(emailOrMobile)) {
      // If it's a mobile number, search by mobile number
      user = await User.findOne({ mobileNo: emailOrMobile });
    } else {
      return res.status(400).json({
        message: "Invalid input. Please provide a valid email or mobile number.",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials, please check your email or mobile number and password.",
      });
    }

    // Compare provided password with hashed password in the database
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password, please check your email or mobile number and password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send response with user details and JWT token
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      address: user.address,
      aadharCardNo: user.aadharCardNo,
      mobileNo: user.mobileNo,
      token,
    });
  } catch (error) {
    console.error("Error in signInUser:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

let verificationCodes = {};

// const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const verificationCode = crypto.randomBytes(3).toString("hex");
//     verificationCodes[email] = verificationCode;

//     await sendVerificationEmail(email, verificationCode);
//     res.status(200).json({ message: "Verification code sent to your email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (verificationCodes[email] !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword; // Password should be hashed in User model middleware
    await user.save();

    // Optionally remove the code from memory after use
    delete verificationCodes[email];

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signupUser,
  signInUser,
  // requestPasswordReset,
  resetPassword,
};
