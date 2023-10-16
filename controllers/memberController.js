const Member = require("../models/Member");
let memberController = module.exports; /*pastdagi methodlarni yuklash imkonini beradi*/

memberController.signup = async (req, res) => {
  try {
    console.log('POST: cont/signup');
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data); /*ichiga req body yuborilyapti*/
      res.json({state: 'succeed', data: new_member});
  } catch(err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

memberController.login = async (req, res) => {
  try {
    console.log('POST: cont/login');
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data); /*ichiga req body yuborilyapti*/

    res.json({state: 'succeed', data: result});
  } catch(err) {
    console.log(`ERROR, cont/login, ${err.message}`);
    res.json({state: 'fail', message: err.message});
  }
};

memberController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("You are Logged out");
};
