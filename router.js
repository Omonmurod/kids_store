const express = require("express");
const router = express.Router(); /* EXPRESS ichidan router olib chiqilyapti */
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const brandController = require("./controllers/brandController");

/******************************
 *          REST API          *
******************************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuten);
router.get(
  "/member/:id",
  memberController.retreiveAuthMember,
  memberController.getChosenMember
);


// Products related routers
router.post(
  "/products",
  memberController.retreiveAuthMember,
  productController.getAllProducts
);
router.get(
  "/products/:id",
  memberController.retreiveAuthMember,
  productController.getChosenProduct
);

// // Brand related routers
router.get(
  "/brands",
  memberController.retreiveAuthMember,
  brandController.getBrands
);
router.get(
  "/brands/:id",
  memberController.retreiveAuthMember,
  brandController.getChosenBrand
);


module.exports = router;