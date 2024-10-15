const express = require("express");
const {
  signupUser,
  signInUser,
} = require("../../controllers/Auth/AuthController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signInUser);

module.exports = router;
