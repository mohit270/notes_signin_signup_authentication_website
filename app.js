require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require("method-override");
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
// const User = require('../models/User');

const app = express();
const PORT = 5500 || process.env.PORT;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  // cookie: { maxAge: new Date ( Date.now() + (604800000) ) } 
  // Date.now() - 30 * 24 * 60 * 60 * 1000
}));


app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

// connect to database
connectDB();

//static file
app.use(express.static("public"));

// templeting engine
app.use(expressLayouts);
app.set("layout","./layouts/main");
app.set("view engine" , "ejs"); 

// routes
app.use('/',require("./server/routes/auth"));
app.use('/',require("./server/routes/index"));
app.use('/',require("./server/routes/dashboard"));

// handle 404 
app.get('*',(req,res)=>{
    const locals = {
        message:"Page Not Found...",
    }
    res.status(404).render("404" , locals);
})


app.listen(PORT,()=>{
    console.log(`App listeing on port : ${PORT}`);
})