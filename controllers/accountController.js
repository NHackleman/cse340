const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav();
	res.render("account/login", {
		title: "Login",
		nav,
		errors: null,
		email: null,
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
};

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
	let nav = await utilities.getNav();
	const {
		account_firstname,
		account_lastname,
		account_email,
		account_password,
	} = req.body;

	// Hash the password before storing (use async hash)
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(account_password, 10);
	} catch (error) {
		req.flash(
			"notice",
			"Sorry, there was an error processing the registration."
		);
		res.status(500).render("account/register", {
			title: "Registration",
			nav,
			errors: null,
			account_firstname,
			account_lastname,
			account_email,
		});
		return;
	}

	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword
	);

	if (regResult && regResult.rowCount > 0) {
		req.flash(
			"notice",
			`Congratulations, you're registered ${account_firstname}. Please log in.`
		);
		res.status(201).redirect("/account/login");
	} else {
		req.flash("notice", "Sorry, the registration failed.");
		res.status(501).render("account/register", {
			title: "Registration",
			nav,
			errors: null,
			account_firstname,
			account_lastname,
			account_email,
		});
	}
};

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body
  const accountData = await accountModel.getAccountByEmail(email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      email,
    })
    return
  }
  try {
    if (await bcrypt.compare(password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement }
