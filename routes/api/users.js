const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterinput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//middleware, tryt moving to server
const jsonParser = bodyParser.json();

//Load user model
const User = require("../../models/User");

// @route   GET /api/users/test
// @desc   Tests users route
// @access   Public
router.get("/test", (req, res) =>
  res.json({ message: "Users route is functional" })
);

// @route   POST /api/users/register
// @desc   Register user
// @access   Public
// user data will be passed in the body
router.post("/register", jsonParser, (req, res) => {
    //tests the form data to see if the data is valid
  const { errors, isValid } = validateRegisterinput(req.body);
  //check for validation errors
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //database search for email to make sure it is unique
  User.findOne({ email: req.body.email }).then(user => {
      //if a matching email hits a user return error
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
    } else {
        //if no matching email create a payload newUser, with the inputs
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
    //ascynchronously generate a salt
      bcrypt.genSalt(10, (err, salt) => {
          //async generates a hash for given string
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          //sets the password to the new hashed string
          newUser.password = hash;
          // save and return the updated user or throw any errors
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   post /api/users/login
// @desc   Login user / Return JWT Token
// @access   Public
router.post("/login", jsonParser, (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //get data from body
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
      //if no user return error
    if (!user) {
      errors.email = "User could not be found! Try a different email."
      return res.status(404).json(errors);
    }

    //check password using bcrpyt to compare given data to hash
    bcrypt.compare(password, user.password).then(isMatch => {
        //if a match is found return an authentication token as a string and success: true
      if (isMatch) {
        //user matched, so return the user id and name
        const payload = { id: user.id, name: user.name }; //create jwt payload
        //sign token in json web token string payload 
        //3600 expires the key after an hour so user needs to sign back in
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Password incorrect!"
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET  api/users/current
// @desc   Return current user
// @access   Private
router.get(
  "/current",
  //pass the token in the headers as autherization, if authorized the user will be returned
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
