const express = require('express');
const { updateProfile } = require('../controllers/User/userController');
const authenticateUser = require('../middlewares/authenticateUser');

const router = express.Router();

// Route to update profile (protected route)
router.patch('/update-profile', authenticateUser, updateProfile);

module.exports = router;
