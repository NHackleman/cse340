// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Redirect /account to /account/login
router.get("/", (req, res) => {
	res.redirect("/account/login");
});

// Route to display login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to display registration view
router.get(
	"/register",
	utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
	"/register",
	regValidate.registationRules(),
	regValidate.checkRegData,
	utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
