const Member = require("../models/Member");
const Product = require("../models/Product");

let brandController =
  module.exports; /*pastdagi methodlarni yuklash imkonini beradi*/

brandController.getMyBrandProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyBrandProducts");
    const product = new Product();
    const data = await product.getAllProductsDataBrand(res.locals.member);
    res.render("brand-menu", { brand_data: data });

  } catch (err) {
    console.log(`ERROR, cont/getMyBrandProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.getSignupMyBrand = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyBrand");
    res.render("signup"); /* Signup EJS ga boradi */
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyBrand, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body,
      member = new Member() /* 1-member object, 2-service model */,
      new_member = await member.signupData(
        data
      ); /*ichiga req body yuborilyapti*/

    req.session.member = new_member;
    res.redirect("/brand/products/menu");
  } catch (err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.getLoginMyBrand = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyBrand");
    res.render("login-page"); /* Login EJS ga boradi */
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyBrand, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data); /*ichiga req body yuborilyapti*/

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/brand/products/menu");
    });
  } catch (err) {
    console.log(`ERROR, cont/login, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "failed", message: "You are not authenticated" });
  }
};

brandController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("You are Logged out");
};

brandController.validateAuthBrand = (req, res, next) => {
  if (req.session?.member?.mb_type === "BRAND") {
    /* Kelayotgan req ichida mb va mb type =BRAND bo'lsa*/
    req.member = req.session.member;
    /* Req member qismiga req sess mb yuklanadi */
    next();
  } else
    res.json({
      state: "fail",
      message: "Only authenticated members with brand type",
    });
};
