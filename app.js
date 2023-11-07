console.log("Starting Web Server");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");
const cookieParser = require("cookie-parser");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1: Entering codes
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2: Codes based on SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(function(req, res, next) {
  res.locals.member = req.session.member;  
  /* Har bir kelayotgan req browser ichiga yuborilyapti. 
  local ichidagi member objectda har bir authenticate bo'lgan user infosi bor */
  next();
});

// 3: Views code (BSSR backend side server rendering backendda viewni yasab olyapmiz)
app.set("views", "views");
app.set("view engine", "ejs");

// 4: Rooting codes
app.use("/", router);
app.use("/brand", router_bssr);

module.exports = app;
