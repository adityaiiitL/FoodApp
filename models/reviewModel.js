const mongoose = require("mongoose");

const db_link =
  "mongodb+srv://admin:TSy3D1FT0edSzvGd@cluster0.atkqfa3.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("Review db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review is required !!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Rating is required !!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: [true, "Review must belong to a user !!"],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "planModel",
    required: [true, "Review must belong to a plan !!"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage",
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;
