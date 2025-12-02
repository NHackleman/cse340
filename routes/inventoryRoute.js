// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/", invController.buildManagement);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

// Route to process add classification
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory);

// Route to process add inventory
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInventoryId);
// Route to intentionally throw a server error for testing
router.get("/error", invController.throwError);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Route to modify inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update/", validate.inventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
module.exports = router;
