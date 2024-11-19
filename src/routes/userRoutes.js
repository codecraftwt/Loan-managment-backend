const express = require("express");
const {
  updateProfile,
  uploadProfileImage,
} = require("../controllers/User/userController");
const authenticateUser = require("../middlewares/authenticateUser");
const upload = require("../config/multerConfig");

const router = express.Router();

// Route to update profile (protected route)
router.patch("/update-profile", authenticateUser, updateProfile);

// Route for uploading profile image
router.post(
  "/uploadProfileImage",
  authenticateUser,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
