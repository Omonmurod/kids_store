console.log("Web Serverni boshlash");
const express = require("express");
const app = express();

// MongoDB connect
const db = require("./server").db();
const mongodb = require("mongodb");

// 1: Entering codes
app.use(express.static("public")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: Codes based on SESSION

// 3: Views code (BSSR backend side server rendering backendda viewni yasab olyapmiz)
app.set("views", "views");
app.set("view engine", "ejs"); 

// 4: Rooting codes
module.exports = app;