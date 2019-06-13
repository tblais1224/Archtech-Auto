const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();

//post validation
const validateSellingInput = require("../../validation/selling");
const validatePostInput = require("../../validation/post");
//bring in selling model
const Selling = require("../../models/Selling");
//bring in profile model
const Profile = require("../../models/Profile");

// @route   POST /api/selling
// @desc   Create a post
// @access   private
router.post(
  "/",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSellingInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newSelling = new Selling({
      type: req.body.type,
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      price: req.body.price,
      mileage: req.body.mileage,
      hours: req.body.hours,
      condition: req.body.contiditon,
      chargeTime: req.body.chargeTime,
      range: req.body.range,
      drive: req.body.drive,
      acceleration: req.body.acceleration,
      topSpeed: req.body.topSpeed,
      description: req.body.description,
      location: req.body.location,
      color: req.body.color,
      topSpeed: req.body.topSpeed,
      name: req.user.name,
      user: req.user.id
    });
    //save the selling then return the selling
    newSelling.save().then(selling => res.json(selling));
  }
);

// @route   GET /api/selling
// @desc   get all posts
// @access   Public
router.get("/", (req, res) => {
  //this finds posts and sorts them by the most recent date
  Selling.find()
    .sort({ date: -1 })
    .then(sellings => res.json(sellings))
    .catch(err =>
      res
        .status(404)
        .json({ error: "No one seems to be selling at this time." })
    );
});

// @route   GET /api/selling/:id
// @desc   get post by id
// @access   Public
router.get("/:id", (req, res) => {
  //this finds sellings and sorts them by the most recent date
  Selling.findById(req.params.id)
    .then(selling => res.json(selling))
    .catch(err =>
      res.status(404).json({ error: "No item found with that id!" })
    );
});

// @route   DELETE /api/selling/:id
// @desc   delete a post by id
// @access   private
router.delete(
  "/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Selling.findById(req.params.id).then(selling => {
        //check user ids to make sure backend server is secure
        if (selling.user.toString() !== req.user.id) {
          //if user ids do not match return 401 which means not authorized
          return res
            .status(401)
            .json({ notauthorized: "User not authorized!" });
        }
        // delete post
        selling
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err => res.status(404).json({ error: "No item found!" }));
      });
    });
  }
);

// @route   POST /api/selling/watching/:id
// @desc   watch a item by id
// @access   private
router.post(
  "/watching/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Selling.findById(req.params.id)
        .then(selling => {
          //this checks to see if users id is in like array already
          if (
            selling.watchers.filter(
              watch => watch.user.toString() === req.user.id
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyWatching: "User is already watching this item." });
          }
          // add a user id to the likes array
          selling.watchers.unshift({ user: req.user.id });
          //save selling and return new updated selling with added like
          selling.save().then(selling => res.json(selling));
          // profile.watching.unshift({sellingId: selling._id})`
          // profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json({ error: "No item found!" }));
    });
  }
);

// @route   POST /api/selling/unwatching/:id
// @desc   unlike a post by id
// @access   private
router.post(
  "/unwatching/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Selling.findById(req.params.id)
        .then(selling => {
          //this checks to see if users id is not in like array
          if (
            selling.watchers.filter(watch => watch.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notWatched: "User has not yet watched this item!" });
          }
          const removeIndex = selling.watchers
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          selling.watchers.splice(removeIndex, 1);
          selling.save().then(selling => res.json(selling));
        })
        .catch(err => res.status(404).json({ error: "No item found!" }));
    });
  }
);

// @route   POST /api/selling/comment/:id
// @desc   comment on a item by id
// @access   private
router.post(
  "/comment/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //can use the same validations as post for comments (check char limits)
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Selling.findById(req.params.id)
      .then(sell => {
        const newComment = {
          text: req.body.text,
          name: req.user.name,
          user: req.user.id
        };
        sell.comments.unshift(newComment);
        sell.save().then(sell => res.json(sell));
      })
      .catch(err => res.status(404).json({ error: "No item found!" }));
  }
);

// @route  delete /api/selling/comment/:id/:commentid
// @desc   delete a comment from a post by id
// @access   private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Selling.findById(req.params.id)
      .then(sell => {
        //check if comment does not exist in post.comments array
        if (
          sell.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentdoesntexist: "No comment found!" });
        }
        const removeIndex = sell.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        sell.comments.splice(removeIndex, 1);
        sell.save().then(sell => res.json(sell));
      })
      .catch(err => res.status(404).json({ error: "No item found!" }));
  }
);

// @route   POST /api/selling/comment/:id/like/:commentid
// @desc   like a comment by id
// @access   private
router.post(
  "/comment/:id/like/:comment_id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Selling.findById(req.params.id)
        .then(sell => {
          if (
            sell.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentdoesntexist: "No comment found!" });
          }
          //get the index of the comment to like by params comment_id
          const likeIndex = sell.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);
          //this checks to see if users id is in like array already
          if (
            sell.comments[likeIndex].likes.filter(
              like => like.user.toString() === req.user.id
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this comment!" });
          }
          // add a user id to the likes array
          sell.comments[likeIndex].likes.unshift({ user: req.user.id });
          sell.save().then(sell => res.json(sell));
        })
        .catch(err => res.status(404).json({ error: "No item found!" }));
    });
  }
);

// @route   POST /api/selling/comment/:id/unlike/:commentid
// @desc   unlike a comment by id
// @access   private
router.post(
  "/comment/:id/unlike/:comment_id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Selling.findById(req.params.id)
        .then(sell => {
          if (
            sell.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentdoesntexist: "No comment found!" });
          }

          //get the index of the comment to unlike by params comment_id
          const unlikeIndex = sell.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          //this checks to see if users id is not in like array
          if (
            sell.comments[unlikeIndex].likes.filter(
              like => like.user.toString() === req.user.id
            ).length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "User has not yet liked this post!" });
          }
          // map through like array, get index by id
          const removeIndex = sell.comments[unlikeIndex].likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          sell.comments[unlikeIndex].likes.splice(removeIndex, 1);
          sell.save().then(sell => res.json(sell));
        })
        .catch(err => res.status(404).json({ error: "No item found!" }));
    });
  }
);

module.exports = router;
