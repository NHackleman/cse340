const express = require("express")
const router = new express.Router() 
const watchlistController = require("../controllers/watchlistController") 
const utilities = require("../utilities/")

const validate = require("../utilities/watchlist-validation")

// Route to build the wishlist view
router.get("/", utilities.checkLogin, utilities.handleErrors(watchlistController.buildWatchlist))

// Route to add a vehicle to the wishlist
router.post("/add", utilities.checkLogin, validate.addWatchlistRules(), validate.checkWatchlistData, utilities.handleErrors(watchlistController.addToWatchlist))

// Route to remove a vehicle from the wishlist
router.post("/remove", utilities.checkLogin, validate.addWatchlistRules(), validate.checkWatchlistData, utilities.handleErrors(watchlistController.removeFromWatchlist))

module.exports = router
