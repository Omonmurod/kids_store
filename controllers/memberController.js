let memberController = module.exports; /* pastdagi methodlarni yuklash imkonini beradi */

memberController.signup = async (req, res) => {
  console.log("POST: cont/signup");
  res.send("You are in SignUp Page");
};

memberController.login = async (req, res) => {
  console.log("POST: cont/login");
  res.send("You are in LogIn Page");
};

memberController.logout = (req, res) => {
  console.log("GET: cont/logout");
  res.send("You are in LogOut Page");
};