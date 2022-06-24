const planModel = require("../models/planModel");

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    let plans = await planModel.find();
    if (plans) {
      res.json({
        message: "All plans retrieved",
        data: plans,
      });
    } else {
      res.json({
        message: "Plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      res.json({
        message: "Plan retrieved",
        data: plan,
      });
    } else {
      res.json({
        message: "Plan not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createdPlan = await planModel.create(planData);
    return res.json({
      message: "Plan created successfully",
      data: createdPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    return res.json({
      message: "Plan deleted successfully",
      data: deletedPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    let id = req.params.id;
    let dataTobeUpdated = req.body;
    // console.log(dataTobeUpdated);
    let keys = [];
    for (let key in dataTobeUpdated) {
      keys.push(key);
    }
    let plan = await planModel.findById(id);
    // console.log(plan);
    for (let i = 0; i < keys.length; i++) {
      plan[keys[i]] = dataTobeUpdated[keys[i]];
    }
    await plan.save();
    return res.json({
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get top-3 plans

module.exports.top3Plans = async function top3Plans(req, res) {
  try {
    const plans = await planModel
      .find()
      .sort({
        ratingsAverage: -1,
      })
      .limit(3);
    res.json({
      message: "top3 plans",
      data: plans,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
