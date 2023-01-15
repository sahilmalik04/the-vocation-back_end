const express = require("express");
const userRoutes = express();

const bodyParser = require("body-parser");

userRoutes.use(bodyParser.json());
userRoutes.use(bodyParser.urlencoded({extended: true}));


// register user route
const userController = require('../controllers/userController');
userRoutes.post('/userRegister', userController.registerUser);

// login user route
userRoutes.post('/userLogin', userController.loginUser);

// reset password user route
userRoutes.post('/user_resetPassword', userController.resetPasswordUser);
userRoutes.patch('/user_setNewPassword', userController.setNewPasswordUser);

module.exports = userRoutes;