const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const db_link =
  "mongodb+srv://admin:TSy3D1FT0edSzvGd@cluster0.atkqfa3.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    // console.log(db);
    console.log("User db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 8,
    validate: function () {
      return this.confirmPassword == this.password;
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpeg",
  },
  resetToken: String,
});

userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

// userSchema.pre("save", async function () {
//   console.log("before saving in db");
//   let salt = await bcrypt.genSalt();
//   let hashedString = await bcrypt.hash(this.password, salt);
//   console.log(hashedString);
//   this.password = hashedString;
// });

userSchema.methods.createResetToken = () => {
  // creating unique token using crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPasswordHandler = (password, confirmPassword) => {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
};

// userSchema.post("save", function () {
//   console.log("after saving in db");
// });

// Models

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
