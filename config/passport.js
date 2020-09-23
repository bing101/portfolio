const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Load user model
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
      },
      async (username, password, done) => {
        // Match username
        console.log("authenticating");
        let user = await User.findOne({ username: username });
        console.log("Found username ? ", username);
        console.log(user);
        if (user == null)
          return done(null, false, { message: "Username not found" });
        console.log("user found");
        try {
          if (!(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: "Password mismatch" }); // Pass incorrct
          } else {
            console.log("everything seems fine here");
            console.log("match");
            return done(null, user);
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
