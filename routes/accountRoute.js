// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Default route to management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

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

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;
