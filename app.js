console.log("Starting Web Server");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1: Entering codes
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: true,
}));
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

const server = http.createServer(app);

/** SOCKET.IO BACKEND SERVER */
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on('connection', function(socket){
  online_users++;
  console.log("New user, total:", online_users);
  // socket.emit = for new commer
  socket.emit('greetMsg', {text: 'Welcome'});
  // io.emit = for all user
  io.emit("infoMsg", {total: online_users});

  socket.on("disconnect", function () {
    online_users--;
    // socket.broadcast.emit = to all users, except the left user
    socket.broadcast.emit("infoMsg", {total: online_users});
    console.log("Client dsconnected, total:", online_users);
  }); 

  socket.on('createMsg', function(data){
    console.log("createMsg:", data);
    io.emit('newMsg', data);
  });
});

module.exports = server;