const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = "<ul>";
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += "<li>";
		list +=
			'<a href="/inv/type/' +
			row.classification_id +
			'" title="See our inventory of ' +
			row.classification_name +
			' vehicles">' +
			row.classification_name +
			"</a>";
		list += "</li>";
	});
	list += "</ul>";
	return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
	let grid = "";
	if (data.length > 0) {
		grid = '<ul id="inv-display">';
		data.forEach((vehicle) => {
			grid += "<li>";
			// Normalize thumbnail path and provide fallback
			let thumb = vehicle.inv_thumbnail || vehicle.thumbnail || "";
			let thumbSrc = "";
			if (!thumb) {
				thumbSrc = "/images/vehicles/no-image-tn.png";
			} else if (thumb.startsWith("http") || thumb.startsWith("/")) {
				// If the DB value starts with '/images/' but doesn't include '/images/vehicles/',
				// normalize it to point to the vehicles folder where thumbnails live.
				if (
					thumb.startsWith("/images/") &&
					!thumb.includes("/images/vehicles/")
				) {
					// replace first occurrence of '/images/' with '/images/vehicles/'
					thumbSrc = thumb.replace("/images/", "/images/vehicles/");
				} else {
					thumbSrc = thumb;
				}
			} else if (thumb.includes("vehicles/")) {
				// ensure it starts with /images/
				thumbSrc = "/" + thumb.replace(/^\/+/, "");
				if (!thumbSrc.startsWith("/images/"))
					thumbSrc = "/images/" + thumbSrc.replace(/^\/+/, "");
			} else {
				thumbSrc = "/images/vehicles/" + thumb.replace(/^\/+/, "");
			}

			const detailHref = "/inv/detail/" + vehicle.inv_id;
			const altText =
				"Image of " +
				(vehicle.inv_make || "") +
				" " +
				(vehicle.inv_model || "") +
				" on CSE Motors";
			grid += `<a href="${detailHref}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src="${thumbSrc}" alt="${altText}"/></a>`;
			grid += '<div class="namePrice">';
			grid += "<hr />";
			grid += "<h2>";
			grid += `<a href="${detailHref}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>`;
			grid += "</h2>";
			const priceVal = vehicle.inv_price || vehicle.price || 0;
			const priceStr = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(priceVal);
			grid += `<span>${priceStr}</span>`;
			grid += "</div>";
			grid += "</li>";
		});
		grid += "</ul>";
	} else {
		grid +=
			'<p class="notice">Sorry, no matching vehicles could be found.</p>';
	}
	return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Constructs the classification select list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}



/* **************************************
 * Build a detailed vehicle view HTML
 * Accepts a single vehicle object and returns an HTML string
 * ************************************ */
Util.buildVehicleDetail = async function (vehicle) {
	if (!vehicle) {
		return '<p class="notice">Sorry, no vehicle information available.</p>';
	}

	// Handle different possible DB column names with fallbacks
	const priceValue =
		vehicle.inv_price || vehicle.price || vehicle.list_price || 0;
	const price = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(priceValue);
	const milesValue =
		vehicle.inv_miles ||
		vehicle.inv_mileage ||
		vehicle.miles ||
		vehicle.mileage ||
		null;
	const mileage = milesValue
		? new Intl.NumberFormat("en-US").format(milesValue)
		: "N/A";
	// Prefer full size image if available, otherwise fallback to thumbnail or generic image
	const imageSrcRaw =
		vehicle.inv_image || vehicle.image || vehicle.inv_thumbnail || "";
	// normalize image path similar to thumbnails
	let imageSrc = "";
	if (!imageSrcRaw) {
		imageSrc = "/images/vehicles/no-image.png";
	} else if (imageSrcRaw.startsWith("http") || imageSrcRaw.startsWith("/")) {
		if (
			imageSrcRaw.startsWith("/images/") &&
			!imageSrcRaw.includes("/images/vehicles/")
		) {
			imageSrc = imageSrcRaw.replace("/images/", "/images/vehicles/");
		} else {
			imageSrc = imageSrcRaw;
		}
	} else if (imageSrcRaw.includes("vehicles/")) {
		imageSrc = "/" + imageSrcRaw.replace(/^\/+/, "");
		if (!imageSrc.startsWith("/images/"))
			imageSrc = "/images/" + imageSrc.replace(/^\/+/, "");
	} else {
		imageSrc = "/images/vehicles/" + imageSrcRaw.replace(/^\/+/, "");
	}

	let html = "";
	html += '<div class="vehicle-detail">';
	html += '<div class="vehicle-image">';
	html += `<img src="${imageSrc}" alt="Image of ${
		vehicle.inv_make || vehicle.make || ""
	} ${vehicle.inv_model || vehicle.model || ""}"/>`;
	html += "</div>";
	html += '<div class="vehicle-info">';
	html += `<h1>${vehicle.inv_make || vehicle.make || ""} ${
		vehicle.inv_model || vehicle.model || ""
	}</h1>`;
	html += `<p class="lead">${
		vehicle.inv_description || vehicle.description || ""
	}</p>`;
	html += '<dl class="specs">';
	html += `<dt>Year:</dt><dd>${
		vehicle.inv_year || vehicle.year || "N/A"
	}</dd>`;
	html += `<dt>Price:</dt><dd>${price}</dd>`;
	html += `<dt>Mileage:</dt><dd>${mileage}</dd>`;
	html += `<dt>Color:</dt><dd>${
		vehicle.inv_color || vehicle.color || "N/A"
	}</dd>`;
	html += "</dl>";
	html += `<p class="desc">${
		vehicle.inv_description || vehicle.description || ""
	}</p>`;
	html += "</div>"; // vehicle-info
	html += "</div>"; // vehicle-detail

	return html;
};

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util;
