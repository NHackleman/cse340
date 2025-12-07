const watchlistModel = require("../models/watchlist-model")
const utilities = require("../utilities/")

const watchlistCont = {}

/* ***************************
 *  Build Watchlist View
 * ************************** */
watchlistCont.buildWatchlist = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const watchlistItems = await watchlistModel.getWatchlistItems(account_id)
  let nav = await utilities.getNav()
  
  res.render("watchlist/index", {
    title: "My Wishlist",
    nav,
    watchlistItems,
    errors: null,
  })
}

/* ***************************
 *  Add to Watchlist
 * ************************** */
watchlistCont.addToWatchlist = async function (req, res, next) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  // Check if already exists
  const exists = await watchlistModel.checkExisting(inv_id, account_id)
  if (exists > 0) {
    req.flash("notice", "Vehicle is already in your wishlist.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const result = await watchlistModel.addWatchlistItem(inv_id, account_id)
  if (result) {
    req.flash("notice", "Vehicle added to your wishlist.")
    res.redirect("/watchlist")
  } else {
    req.flash("notice", "Failed to add vehicle to wishlist.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Remove from Watchlist
 * ************************** */
watchlistCont.removeFromWatchlist = async function (req, res, next) {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id
    
    const result = await watchlistModel.removeWatchlistItem(inv_id, account_id)
    if (result) {
      req.flash("notice", "Vehicle removed from your wishlist.")
    } else {
      req.flash("notice", "Failed to remove vehicle from wishlist.")
    }
    res.redirect("/watchlist")
  }

module.exports = watchlistCont
