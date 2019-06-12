const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();

//post validation
const validateSellingInput = require("../../validation/selling");
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
    .catch(err => res.status(404).json({ error: "No one seems to be selling at this time." }));
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

// @route   POST /api/selling/like/:id
// @desc   like a post by id
// @access   private
router.post(
  "/like/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //this checks to see if users id is in like array already
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this post!" });
          }
          // add a user id to the likes array
          post.likes.unshift({ user: req.user.id });
          //save post and return new updated post with added like
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ error: "No post found!" }));
    });
  }
);

// @route   POST /api/selling/unlike/:id
// @desc   unlike a post by id
// @access   private
router.post(
  "/unlike/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //this checks to see if users id is not in like array
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "User has not yet liked this post!" });
          }
          // map through like array, get index by id
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //remove from like array by index
          post.likes.splice(removeIndex, 1);
          //save post, then return it
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ error: "No post found!" }));
    });
  }
);

// @route   POST /api/selling/comment/:id
// @desc   comment on a post by id
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
    Post.findById(req.params.id)
      .then(post => {
        //sets comment from post data in body, and id from user id
        const newComment = {
          text: req.body.text,
          name: req.user.name,
          user: req.user.id
        };
        // add to comments array on post
        post.comments.unshift(newComment);
        //save post with added comment the return post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ error: "No post found!" }));
  }
);

// @route  delete /api/selling/comment/:id/:commentid
// @desc   delete a comment from a post by id
// @access   private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check if comment does not exist in post.comments array
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentdoesntexist: "No comment found!" });
        }
        //get the index of the comment to remove by params comment_id
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        // remove comment from comments array then save and return updated post
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ error: "No post found!" }));
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
      Post.findById(req.params.id)
        .then(post => {
          //check if comment does not exist in post.comments array
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentdoesntexist: "No comment found!" });
          }

          //get the index of the comment to like by params comment_id
          const likeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          //this checks to see if users id is in like array already
          if (
            post.comments[likeIndex].likes.filter(
              like => like.user.toString() === req.user.id
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User has already liked this comment!" });
          }
          // add a user id to the likes array
          post.comments[likeIndex].likes.unshift({ user: req.user.id });
          //save post and return new updated post with added like
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ error: "No post found!" }));
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
      Post.findById(req.params.id)
        .then(post => {
          //check if comment does not exist in post.comments array
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentdoesntexist: "No comment found!" });
          }

          //get the index of the comment to unlike by params comment_id
          const unlikeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          //this checks to see if users id is not in like array
          if (
            post.comments[unlikeIndex].likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "User has not yet liked this post!" });
          }
          // map through like array, get index by id
          const removeIndex = post.comments[unlikeIndex].likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //remove from like array by index
          post.comments[unlikeIndex].likes.splice(removeIndex, 1);
          //save post, then return it
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ error: "No post found!" }));
    });
  }
);

module.exports = router;
