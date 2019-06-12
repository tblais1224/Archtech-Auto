const express = require("express");
const mongoose = require("mongoose");
const mongoURI = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

//api routes
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");
const sellings = require("./routes/api/sellings");

//initiate express
const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
//(try getting body parser json to work in server instead of routes)
// app.use(bodyParser.json)

//connect to mongo atlas database
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB has connected"))
  .catch(err => console.log(err));

//passport middleware for userauth
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);

//api routes
app.use("/api/users", users);
// app.use("/api/profiles", profiles);
// app.use("/api/posts", posts);
// app.use("/api/sellings", sellings);

//the below code is needed to run in production with react build / heroku
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//set port and start server
//  http://localhost:5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port: " + PORT));
