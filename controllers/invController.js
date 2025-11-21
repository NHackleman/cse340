const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId;
	const data = await invModel.getInventoryByClassificationId(
		classification_id
	);
	const grid = await utilities.buildClassificationGrid(data);
	let nav = await utilities.getNav();
	const className = data[0].classification_name;
	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	});
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
	try {
		const inv_id = req.params.invId;
		const data = await invModel.getInventoryById(inv_id);
		if (!data) {
			return next({ status: 404, message: "Vehicle not found" });
		}
		const vehicleHTML = await utilities.buildVehicleDetail(data);
		const nav = await utilities.getNav();
		res.render("./inventory/detail", {
			title: `${data.inv_make} ${data.inv_model}`,
			nav,
			vehicle: vehicleHTML,
		});
	} catch (error) {
		return next(error);
	}
};

/* ***************************
 *  Intentional error for testing (500)
 * ************************** */
invCont.throwError = function (req, res, next) {
	try {
		// Intentionally throw an error to test middleware
		throw new Error("Intentional 500 error for testing");
	} catch (err) {
		next(err);
	}
};

module.exports = invCont;
