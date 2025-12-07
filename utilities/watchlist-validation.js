const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Watchlist Validation Rules
 * ********************************* */
validate.addWatchlistRules = () => {
  return [
    // valid integer is required
    body("inv_id")
      .trim()
      .isInt()
      .withMessage("A valid vehicle is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkWatchlistData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    // If we have errors, we probably shouldn't redirect blindly, but for a hidden field failure
    // it likely means manipulation or bug. Redirecting to home or detail with error is safe.
    req.flash("notice", "Invalid vehicle selected.")
    return res.redirect("back") 
  }
  next()
}

module.exports = validate
