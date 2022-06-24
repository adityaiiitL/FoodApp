const express = require("express");
const userRouter = express.Router();

const {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const {
  signup,
  login,
  isAuthorised,
  protectRoute,
  logout,
  forgetPassword,
  resetPassword,
} = require("../controller/authController");

// User options

userRouter.route("/:id").patch(updateUser).delete(deleteUser);

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

// Profile Page
userRouter.use(protectRoute); // middleware to check user has loggined or not
userRouter.route("/userProfile").get(getUser);

// forget password
userRouter.route("./forgetPassword").post(forgetPassword);

// reset password
userRouter.route("./resetPassword/:token").post(resetPassword);

userRouter.route("/logout").get(logout);

// Admin specific function
userRouter.use(isAuthorised(["admin"])); // middleware to check admin rights
userRouter.route("").get(getAllUser);

module.exports = userRouter;