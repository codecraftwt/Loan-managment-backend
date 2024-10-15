const express = require("express");
const {
  signupUser,
  signInUser,
  requestPasswordReset,
} = require("../../controllers/Auth/AuthController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signInUser);
router.post("/request-password-reset", requestPasswordReset);

module.exports = router;
