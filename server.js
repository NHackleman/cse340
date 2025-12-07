/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const watchlistRoute = require("./routes/watchlistRoute");
const expressLayouts = require("express-ejs-layouts");
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(
	session({
		store: new (require("connect-pg-simple")(session))({
			createTableIfMissing: true,
			pool,
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		name: "sessionId",
	})
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not required if using layouts/layout.ejs

/* ***********************
 * Routes
 *************************/
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", inventoryRoute);
// Account routes
app.use("/account", accountRoute);
// Watchlist routes
app.use("/watchlist", watchlistRoute);

// Handle browser requests for favicon.ico to avoid 404s in logs
app.get("/favicon.ico", (req, res) => {
	const favPath = path.join(__dirname, "public", "favicon.ico");
	if (fs.existsSync(favPath)) {
		return res.sendFile(favPath);
	}
	// try site images folder as a fallback
	const altFav = path.join(
		__dirname,
		"public",
		"images",
		"site",
		"favicon.png"
	);
	if (fs.existsSync(altFav)) {
		return res.sendFile(altFav);
	}
	// No favicon available - return No Content to avoid 404 handling noise
	return res.sendStatus(204);
});
// Static routes (come after dynamic routes)
app.use(static);
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
	next({ status: 404, message: "Sorry, we appear to have lost that page." });
});



/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
	let nav = await utilities.getNav();
	console.error(`Error at: "${req.originalUrl}": ${err.message}`);
	if (err.status == 404) {
		message = err.message;
	} else {
		message = "Oh no! There was a crash. Maybe try a different route?";
	}
	res.render("errors/error", {
		title: err.status || "Server Error",
		message,
		nav,
	});
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 * *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 * ************************/
console.log(`app listening on ${host}:${port}`);

/* ***********************
 * Start server and handle listen errors
 * *************************/
const server = app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});
