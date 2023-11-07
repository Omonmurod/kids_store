const express = require("express");
const router = express.Router(); /* EXPRESS ichidan router olib chiqilyapti */
const memberController = require("./controllers/memberController");


/******************************
 *          REST API          *
******************************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuten);


//Other
router.get("/community", (req, res) => {
  res.send("This is a Community Page");
});

module.exports = router;