// Requiring module
const express = require('express');
const {engine} = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
 
// set up module
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(
  session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
 
app.use(passport.initialize());
app.use(passport.session());

function isLogged(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//set up local strategy
//signup
passport.use("local-signup", new LocalStrategy(
  {usernameField: "email"} , 
  async (email, password, done) => {
    try {
      let user = await knex("users")
      .where({email: email})
      .first();
      if (user){
        return done(null, false);
      }
      let hash = await bcrypt.hash(password, 10);
      let newUser = {
        email,
        password: hash,
    };
     let userID = await knex("users").insert(newUser)
    .returning("id");
      newUser.id = userID[0].id;
      return done(null, newUser);
    } catch (err){
     return done(err);
    }
  }
));

//login
passport.use("local-login", new LocalStrategy(
  {usernameField: "email"} , 
  async (email, password, done) => {
    try {
      let user = await knex("users").where({email: email}).first();
      if (!user){
        return done(null,false);
      }
      let result = bcrypt.compare(password, user.password);
      if (result){
        return done(null, user);
      } else {
        return done(null, false,{
          message: "incorrect password",
        });
      }
    } catch (err){
     return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser( async(id, done) => {
  let user = await knex("users").where({id: id}).first();
  if(!user){
    return done(null, false);
  }
  return done(null, user);
});

// Defining port number
const PORT = 5000;                 
 
// Function to serve all static files
// inside public directory.
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.get("/", (req, res) => {
  res.render("home");
});

//handle get requests
app.get("/signup",  (req, res) => {
    res.render("signup");
  });

  app.get("/login",  (req, res) => {
    res.render("login");
  });

  app.get("/secret", isLogged, (req, res) => {
    res.render("secret");
  });

  app.get("/logout",  (req, res, next) => {
    req.logout( function(err){
      if(err){
        return next(err);
      }
      res.redirect("/login");
    });
    
  });

  //handle post request
  app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
  }))

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }))
// Server setup
app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})


