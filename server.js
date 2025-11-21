/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const expressLayouts = require("express-ejs-layouts");
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const fs = require("fs");
const path = require("path");

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
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Start server and handle listen errors
 *************************/
const server = app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});

server.on("error", (err) => {
	if (err.code === "EADDRINUSE") {
		console.error(
			`Port ${port} is already in use. Close the process that is using the port or change PORT in your .env.`
		);
		process.exit(1);
	}
	console.error("Server error:", err);
});
