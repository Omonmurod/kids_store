const Definer = require("../lib/mistake");
const Member = require("../models/Member");
const Product = require("../models/Product");
const assert = require("assert");
const Brand = require("../models/Brand");

let brandController =
  module.exports; /*pastdagi methodlarni yuklash imkonini beradi*/

  brandController.getBrands = async (req, res) => {
    try {
      console.log("GET: cont/getBrands");
      const data = req.query,
        brand = new Brand(),
        result = await brand.getBrandsData(req.member, data);
  
      res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, cont/getBrands, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  };
  
  /*************************************
   *       BSSSR RELATED METHODS       *
   ************************************/
  
  brandController.home = (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.getMyBrandProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyBrandProducts");
    const product = new Product();
    const data = await product.getAllProductsDataBrand(res.locals.member);
    res.render("brand-menu", { brand_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyBrandProducts, ${err.message}`);
    //res.json({ state: "fail", message: err.message });
    res.redirect("/brand");
  }
};

brandController.getSignupMyBrand = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyBrand");
    res.render("sign-up"); /* Signup EJS ga boradi */
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyBrand, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");
    assert(req.file, Definer.general_err3);
    let new_member = req.body;
    new_member.mb_type = "BRAND";
    new_member.mb_image = req.file.path;

    const member = new Member(); /* 1-member object, 2-service model */
    const result = await member.signupData(new_member);
    assert(result, Definer.general_err1);
    /*ichiga req body yuborilyapti*/

    req.session.member = result;
    /* req ichiga session ichiga member yaratib uni yangi signedup memberga tenglanyapti */
    // SESSION protsessi quriladi    /* yuqoridagi degani user qayta zapros qilganda browser taniydi */
    res.redirect("/brand/products/menu");
  } catch (err) {
    console.log(`ERROR, cont/signupProcess, ${err.message}`);
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
    console.log("POST: cont/loginProcess");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data); /*ichiga req body yuborilyapti*/

    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/brand/all-brands")
        : res.redirect("/brand/products/menu");
    });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess, ${err.message}`);
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
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/brand");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.validateAuthBrand = (req, res, next) => {
  if (req.session?.member?.mb_type === "BRAND") {
    /* Kelayotgan req ichida mb va mb type =BRAND bo'lsa*/
    req.member = req.session.member;
    /* Req member qismiga req sess mb yuklanadi */
    next();
  } else {
    res.json({
      state: "fail",
      message: "only BRAND type can accsess",
    });
  }
};

brandController.validateAuthAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    /* Kelayotgan req ichida mb va mb type =BRAND bo'lsa*/
    req.member = req.session.member;
    /* Req member qismiga req sess mb yuklanadi */
    next();
  } else {
    const html = `<script>
                    alert("Admin page: Permission denied!");
                    window.location.replace('/resto');
                 </script>`;
    res.end(html);
  }
};

brandController.getAllBrands = async (req, res) => {
  try {
    console.log("GET cont/getAllBrands");
    // Hamma restaurantlarni db dan chaqiramiz
    const brand = new Brand();
    // Barcha restaurantlar resaurant objecti methodi orqali chaqiirib olinyapti
    const brands_data = await brand.getAllBrandsData();
    // Qabul qilib olingan data shu urlga restaurants_data nomi bn yuborilyapti
    res.render("all-brands", { brands_data: brands_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllBrands, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

brandController.updateBrandByAdmin = async (req, res) => {
  try {
    console.log("POST cont/updateBrandByAdmin");
    const brand = new Brand();
    const result = await brand.updateBrandByAdminData(req.body);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateBrandByAdmin, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
