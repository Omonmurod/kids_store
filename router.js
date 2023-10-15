const express = require("express");
const router = express.Router(); /* EXPRESS ichidan router olib chiqilyapti */
const memberController = require("./controllers/memberController");


/*****************************
 *          REST API          *
 *****************************/

// Member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);


//Other
router.get("/menu", (req, res) => {
  res.send("You are in MenuPage");
});

module.exports = router;