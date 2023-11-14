const express = require("express");
const router = express.Router(); /* EXPRESS ichidan router olib chiqilyapti */
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const brandController = require("./controllers/brandController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const followController = require("./controllers/followController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_member = require("./utils/upload-multer")("members");

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

// Order related routers
router.post(
  "/orders/create",
  memberController.retreiveAuthMember,
  orderController.createOrder
);
router.get(
  "/orders",
  memberController.retreiveAuthMember,
  orderController.getMyOrders
);
router.post(
  "/orders/edit",
  memberController.retreiveAuthMember,
  orderController.editChosenOrder
);

//Community related routers
router.post(
  "/community/image",
  uploader_community.single("community_image"),
  communityController.imageInsertion
);
router.post(
  "/community/create",
  memberController.retreiveAuthMember,
  communityController.createArticle
);
router.get(
  "/community/articles",
  memberController.retreiveAuthMember,
  communityController.getMemberArticles
);
router.get(
  "/community/target",
  memberController.retreiveAuthMember,
  communityController.getArticles
);
router.get(
  "/community/single-article/:art_id",
  memberController.retreiveAuthMember,
  communityController.getChosenArticle
);

// Following related routers
router.post(
  "/follow/subscribe",
  memberController.retreiveAuthMember,
  followController.subscribe
);
router.post(
  "/follow/unsubscribe",
  memberController.retreiveAuthMember,
  followController.unsubscribe
);
router.get("/follow/followings", followController.getMemberFollowings);
router.get(
  "/follow/followers",
  memberController.retreiveAuthMember,
  followController.getMemberFollowers
);

module.exports = router;
