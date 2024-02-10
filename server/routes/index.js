const express = require("express");
const route = express.Router();
const mainController = require("../controllers/mainController");


"App routes"
route.get('/',mainController.homePage);
route.get('/about',mainController.about);



module.exports = route;