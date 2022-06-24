const express = require("express");
const planRouter = express.Router();
const { protectRoute, isAuthorised } = require("../controller/authController");
const {
  getAllPlans,
  getPlan,
  updatePlan,
  deletePlan,
  createPlan,
  top3Plans,
} = require("../controller/planController");

// gets all plans
planRouter.route("/allPlans").get(getAllPlans);

// own plan --> logged in necessary
planRouter.use(protectRoute);
planRouter.route("/plan/:id").get(getPlan);

// admin and restaurant-owner can only create, update or delete plans
planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter.route("/crudPlan").post(createPlan);

// admin and restaurant-owner can only create, update or delete plans
planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

planRouter.route("/top3").get(top3Plans);

module.exports = planRouter;
