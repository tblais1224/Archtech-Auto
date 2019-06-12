const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

//middleware
const router = express.Router();
const jsonParser = bodyParser.json();
mongoose.set("useFindAndModify", false);

//get validations
const validateProfileInput = require("../../validation/profile");

//get mongo schemas
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   Post /api/profile/
// @desc   create or edit user profile
// @access   Private
router.post(
  "/",
  jsonParser,
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    //deconstruct the object returned from validation check
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation, return any errors with a 400 status
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //create empty object to store data
    const profileFields = {};
    //get user id
    profileFields.user = req.user.id;
    //if handle or bio exists set it to profileFields
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.bio) profileFields.bio = req.body.bio;

    //search database for profile by user id
    Profile.findOne({ user: req.user.id }).then(profile => {
        //if a profile is found for the user update its data
      if (profile) {
          //mongoose call to update existing data
        Profile.findOneAndUpdate(
          {
              //finds profile by user
            user: req.user.id
          },
          {
              //sets the new data store in profilefields to db
            $set: profileFields
          },
          {
              //if true return new updated profile
            new: true
          }
        ).then(profile => res.json(profile));
      } else {
        // if no use id matches, create new profile
        //check if handle exists
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
            //if a profile exists with the handle return an error
          if (profile) {
            errors.handle = "That handle already exists.";
            res.status(400).json(errors);
          }
          //save a new Profile and return it after saved
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   GET /api/profile/
// @desc   get current users profile if logged in
// @access   Private
router.get(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({
      user: req.user.id
    })
    //add the user data to profile data when getting it
      .populate("user", ["name", "email"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc   get all profiles
// @access   public
router.get("/all", (req, res) => {
  //intitialize erros object
  const errors = {};
  //finds all profile in db and returns array
  Profile.find()
    .populate("user", ["name"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profiles could be found!";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: "No profiles exist." }));
});

// @route   GET api/profile/handle/testhandle123
// @desc   get profile by handle
// @access   public
router.get("/handle/:handle", (req, res) => {
  //intitialize erros object
  const errors = {};
  //matches to handle in database and returns the profile and user name
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/5dtest123test635484d317c
// @desc   get profile by user_id
// @access   public
router.get("/user/:user_id", (req, res) => {
  //intitialize erros object
  const errors = {};
  //matches to handle in database
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "No profile exists for this user." })
    );
});

// @route   delete /api/profile
// @desc   delete user and profile
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //this finds user profile by current user id and deletes from db
    Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      //this finds the user and deletes it in db
      User.findOneAndRemove({ _id: req.user.id })
      .then(() => {
        res.json({ success: true });
      });
    });
  }
);

// @route   GET /api/profile/test
// @desc   Tests profile route
// @access   Public
router.get("/test", (req, res) =>
  res.json({
    message: "Profile route is functional"
  })
);

module.exports = router;
