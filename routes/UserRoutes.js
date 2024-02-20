const route = require("express").Router();
const UserController = require("../controllers/UserController.js");
route.post("/user/register", UserController.Register);
route.post("/user/login", UserController.Login);
route.post("/user/", UserController.Ind);
module.exports = route;
