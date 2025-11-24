const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const accountCont = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountCont.buildLogin = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/login", {
		title: "Login",
		nav,
	});
};

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/register", {
		title: "Register",
		nav,
		errors: null,
	});
}

/* ****************************************
 *  Process Registration
 * *************************************** */
accountCont.registerAccount = async function (req, res, next) {
	let nav = await utilities.getNav();
	const { firstname, lastname, email, password } = req.body;

	const regResult = await accountModel.registerAccount(
		firstname,
		lastname,
		email,
		password
	);

	if (regResult) {
		req.flash(
			"notice",
			`Congratulations, you're registered ${firstname}. Please log in.`
		);
		res.status(201).render("account/login", {
			title: "Login",
			nav,
		});
	} else {
		req.flash("notice", "Sorry, the registration failed.");
		res.status(501).render("account/register", {
			title: "Registration",
			nav,
		});
	}
};

module.exports = accountCont;
