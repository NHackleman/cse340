// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInventoryId);
// Route to intentionally throw a server error for testing
router.get("/error", invController.throwError);

module.exports = router;
