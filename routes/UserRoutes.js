const route = require("express").Router();
const UserController = require("../controller/UserController");
route.post("/user/register", UserController.Register);
route.post("/user/login", UserController.Login);
route.get("/user", UserController.Ind);
module.exports = route;
