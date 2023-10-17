const Member = require("../models/Member");

let brandController = module.exports; /*pastdagi methodlarni yuklash imkonini beradi*/


brandController.getMyBrandData = async (req, res) => {
  try {
    console.log('GET: cont/getMyBrandData');
    //TO DO: Get my brand products
    
    res.render('brand-menu');
  } catch(err) {
    console.log(`ERROR, cont/getMyBrandData, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

brandController.getSignupMyBrand = async (req, res) => {
  try {
    console.log('GET: cont/getSignupMyBrand');
    res.render('signup'); /* Signup EJS ga boradi */
  } catch(err) {
    console.log(`ERROR, cont/getSignupMyBrand, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

brandController.signupProcess = async (req, res) => {
  try {
    console.log('POST: cont/signup');
    const data = req.body,
      member = new Member(),  /* 1-member object, 2-service model */
      new_member = await member.signupData(data); /*ichiga req body yuborilyapti*/

      req.session.member = new_member;
      res.redirect('/brand/products/menu');
    
  } catch(err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

brandController.getLoginMyBrand = async (req, res) => {
  try {
    console.log('GET: cont/getLoginMyBrand');
    res.render('login-page'); /* Login EJS ga boradi */
  } catch(err) {
    console.log(`ERROR, cont/getLoginMyBrand, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

brandController.loginProcess = async (req, res) => {
  try {
    console.log('POST: cont/login');
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data); /*ichiga req body yuborilyapti*/

      req.session.member = result;
      req.session.save(function() {
        res.redirect('/brand/products/menu');
      });

  } catch(err) {
    console.log(`ERROR, cont/login, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

brandController.checkSessions = (req, res) => {
  if(req.session?.member) {
    res.json({ state: "succeed", data: req.session.member});
  } else {
    res.json({ state: "failed", message: "You are not authenticated"});
  }
};

brandController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("You are Logged out");
};