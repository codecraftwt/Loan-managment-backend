const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const { sendVerificationEmail } = require("../../utils/mailer");

const signupUser = async (req, res) => {
  const { email, userName, password, address, aadharCardNo } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ massage: "User allReady exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      address,
      aadharCardNo,
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
      },
    });
  } catch (error) {
    return res.status(500).json({
      massage: "Server Error",
      massage: `error: ${error}`,
    });
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      address: user.address,
      aadharCardNo: user.aadharCardNo,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
