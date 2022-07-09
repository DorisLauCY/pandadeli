// const https = require("https");
// const fs = require("fs");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { engine } = require("express-handlebars");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

//Set up module
const app = express();
app.use(express.urlencoded({ extended: false }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// const options = {
//   cert: fs.readFileSync("./localhost.crt"),
//   key: fs.readFileSync("./localhost.key"),
// };

//Middleware to check if the user is authenticated
function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Set up Local Strategy
//Signup
passport.use(
  "local-signup",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        let user = await knex("users").where({ email: email }).first();
        if (user) {
          return done(null, false);
        }
        let hash = await bcrypt.hash(password, 10);
        let newUser = {
          email,
          password: hash,
        };
        let userID = await knex("users").insert(newUser).returning("id"); //[{id:1}]

        newUser.id = userID[0].id;
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Login
passport.use(
  "local-login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        let user = await knex("users").where({ email: email }).first();
        if (!user) {
          return done(null, false);
        }
        let result = bcrypt.compare(password, user.password);
        if (result) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await knex("users").where({ id: id }).first();
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
});

//Handle get request
// app.get("/", isLogged, (req, res) => {
//   res.render("secret");
// });

app.get("/", (req, res) => {
    res.render("index");
  });

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("index");
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
//Handle post request
app.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
  })
);

app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.listen(3000, () => console.log("Listening to port 3000"));
// https
//   .createServer(options, app)
//   .listen(3000, () => console.log("Listening to port 3000"));
