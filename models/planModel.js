const mongoose = require("mongoose");

const db_link =
  "mongodb+srv://admin:TSy3D1FT0edSzvGd@cluster0.atkqfa3.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    // console.log(db);
    console.log("Plan db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "Plan name should not exceed more than 20 chars"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Price not entered !!"],
  },
  ratingsAverage: {
    type: Number,
  },
  discount: {
    type: Number,
    validate: [
      function () {
        return this.discount < 100;
      },
      "Discount should not exceed price",
    ],
  },
});

const planModel = mongoose.model("planModel", planSchema);

// (async function createPlan() {
//   let planObj = {
//     name: "SuperFood10",
//     duration: 30,
//     price: 1000,
//     ratingsAverage: 5,
//     discount: 20,
//   };
//   let data = await planModel.create(planObj);
//   console.log(data);
//   const doc = new planModel(planObj);
//   doc.save();
// })();

module.exports = planModel;
