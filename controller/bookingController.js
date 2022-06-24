let SK =
  "sk_test_51LCjBrSCVRNNvQT1GiuEJqJqeTCfZZypVBv27EVgBV3xNfINU9aTf1VyazGIFgTPB18rhdNtmFbNuYghMLYpgMZt0042Lzcjkf";
const stripe = require("stripe")(SK);
const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession = async function createSession(req, res) {
  try {
    let userId = req.id;
    let planId = req.params.id;

    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);

    const session = await stripe.checkout.session.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      client_reference_id: plan.id,
      line_items: [
        {
          name: plan.name,
          description: plan.description,
          amount: plan.price * 100,
          currency: "inr",
          quanity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get("host")}/profile`,
      cancel_url: `${req.protocol}://${req.get("host")}/profile`,
    });
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    res.status(200).json({
      err: err.message,
    });
  }
};
