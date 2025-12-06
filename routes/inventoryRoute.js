// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification
router.post(
  "/add-classification",
  utilities.checkAccountType,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post(
  "/add-inventory",
  utilities.checkAccountType,
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
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", utilities.checkAccountType, validate.inventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView))
router.post("/delete/", utilities.checkAccountType, utilities.handleErrors(invController.deleteItem))
module.exports = router;
