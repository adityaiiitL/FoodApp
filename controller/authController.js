const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../secrets.js");

// Sign-up user
module.exports.signup = async function signup(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    if (user) {
      res.json({
        message: "User signed up !!",
        data: user,
      });
    } else {
      res.json({
        message: "error while signing up",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

// Login user
module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.password == data.password) {
          let uid = user["_id"]; // unique id
          let token = jwt.sign({ payload: uid }, JWT_KEY);

          res.cookie("login", token, { httpOnly: true });

          return res.json({
            message: "User has logged in !!",
            userDetails: data,
          });
        } else {
          return res.json({
            message: "Wrong Credentials",
          });
        }
      } else {
        return res.json({
          message: "User not found",
        });
      }
    } else {
      return res.json({
        message: "Empty field found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

// isAuthorised function --> to check user's role

module.exports.isAuthorised = function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "Operation not allowed",
      });
    }
  };
};

// Protect Route

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      // console.log(req.cookies);
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
      if (payload) {
        // console.log("payload token", payload);
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        // console.log(req.role, req.id);
        next();
      } else {
        return res.json({
          message: "Please login again !!",
        });
      }
    } else {
      res.json({
        message: "please login",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

// forget password

module.exports.forgetPassword = async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    let user = await userModel.findOne({ email: email });
    if (user) {
      // createResetToken() --> creates new token
      const resetToken = user.createResetToken();

      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetPassword/${resetToken}`;
      // send email to the user
      // nodemailer
    } else {
      return res.json({
        message: "Please signup",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// reset password

module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    let { password, confirmPassword } = req.body;
    const user = await userModel.findOne({ resetToken: token });

    if (user) {
      // resetPasswordHandler() --> Updates user's password in db
      user.resetPasswordHandler(password, confirmPassword);

      await user.save();
      res.json({
        message: "Users password changed successfully, login again :)",
      });
    } else {
      res.json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.logout = function logout(req, res) {
  res.cookie("login", "", { maxAge: 1 });
  res.json({
    message: "User logged out successfully !",
  });
}
