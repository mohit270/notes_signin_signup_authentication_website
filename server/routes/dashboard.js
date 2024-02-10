const express = require("express");
const route = express.Router();
const dashboardController = require("../controllers/dashboardController");
const {isLoggedIn} = require('../middleware/checkAuth');


// "dashboard routes"
route.get('/dashboard',isLoggedIn,dashboardController.dashboard);
route.get('/dashboard/add/:id',isLoggedIn,dashboardController.dashboardViewNote);
route.put('/dashboard/add/:id',isLoggedIn,dashboardController.dashboardUpdateNote);
route.delete('/dashboard/add-delete/:id',isLoggedIn,dashboardController.dashboardDeleteNote);
route.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
route.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);

module.exports = route;