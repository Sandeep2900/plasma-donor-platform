const express = require('express');
const { registerController, loginController, currentUserController } = require('../controller/authController');  // Import register controller
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Register route using the controller
//Register post
router.post('/register', registerController);
//Login controller post
router.post('/login',loginController);
//Get current user
router.get('/current-user',authMiddleware,currentUserController);

module.exports = router;
