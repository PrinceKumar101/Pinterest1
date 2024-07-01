var express = require("express");
var router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const users = require("./users");
const posts = require("./posts");
passport.use(new localStrategy(users.authenticate()));
const upload = require("./multer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const found_user = await users.findOne({
    username: req.session.passport.user,
  })
  .populate("posts");
  res.render("profile", { found_user });
});

router.post("/upl-profile" ,isLoggedIn, upload.single("upl-img"),
  async function (req, res, next) {
    const found_user = await users.findOne({
      username: req.session.passport.user,
    });
    found_user.profilePicture = req.file.filename;
    await found_user.save();
    res.redirect("/profile");
  }
);

router.get("/new-post", isLoggedIn, async function (req, res, next) {
  const found_user = await users.findOne({
    username: req.session.passport.user,
  });
  res.render("new-post", { found_user });
});

router.post("/add-new-post", isLoggedIn, upload.single("post-image"),
 
  async function (req, res, next) {
    const found_user = await users.findOne({
      username: req.session.passport.user,
    });
    const post = await posts.create({
      user: found_user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    });
    found_user.posts.push(post._id);
    await found_user.save();
    res.redirect("/profile");
  }
);

router.get("/show/posts", isLoggedIn, async function (req, res, next) {
  const found_user = await users.findOne({
    username: req.session.passport.user,
  })
  .populate("posts");
  res.render("show", {found_user});
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/feed",  isLoggedIn, async function (req, res, next) {
  const found_user = await users.findOne({
    username: req.session.passport.user,
  })
  const found_post = await posts.find()
  .populate("user");
  res.render("feed",{found_user, found_post});
});

router.post("/register", function (req, res, next) {
  const { username, email } = req.body;
  const userdata = new users({ username, email });
  users.register(userdata, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to the next middleware or route handler
  }
  res.redirect("/login"); // Not authenticated, redirect to main page
}

module.exports = router;
