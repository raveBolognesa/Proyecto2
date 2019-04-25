const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Coment = require("../models/coment");
const uploadCloud = require("../config/cloudinary.js");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn.js");
const isCreator = require("../middlewares/isCreator.js");
const isRafa = require("../middlewares/isRafa.js");
const Swag = require("swag");
var mongoose = require('mongoose')
const Product = require("../models/modelProducts");
require('dotenv').config();


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error"), user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {user: req.user});
});

router.post("/signup", uploadCloud.single("photo"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;
  const photo = req.body.photo;
  const rating = req.body.rating;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      phone,
      photo,
      rating,
      imgPath,
      imgName
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/auth/login");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

//Buscar productos de un usuario
// const Product = require("../models/modelProducts");
// router.get('/miperfil', ensureLoggedIn ,(req,res, next)=>{
//   user =req.user
//   id=req.params.id
//   Product.find({author: res.user.id})
//   res.render("auth/profile", {user: user, product:product})
// })

router.get("/miperfil", ensureLoggedIn, (req, res, next) => {
  usuario = req.user;
  Coment.find({})
    .then(allComments => {
      usuario.comments = allComments;

      Product
        .find({author: mongoose.Types.ObjectId(usuario.id)})
        .then(allMyProducts => {
          usuario.allMyProducts = allMyProducts
          
          res.render("auth/profile2", { user: usuario });
        })
    })
    .catch(err => {
      res.render("./error", err);
    });
});

router.get("/miperfil/:userid", ensureLoggedIn,  (req, res, next) => {
  User.findOne({ _id: req.params.userid }).then(usuario=>{

    Coment.find({creatorId: mongoose.Types.ObjectId(req.params.userid)})
      .then(allComments => {
        usuario.comments = allComments;
  
        Product
          .find({author: mongoose.Types.ObjectId(req.params.userid)})
          .then(allMyProducts => {
            usuario.allMyProducts = allMyProducts
            
            res.render("auth/profile", { user: usuario });
          })
      })
      .catch(err => {
        res.render("./error", err);
      });

  })
  // usuario = req.params.us;
});

router.get("/miperfil/:id/edit",  ensureLoggedIn, (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      res.render("auth/editProfile", { user: user });
    })
    .catch(err => {
      res.render("./error", err);
    });
});

// editado
router.post(
  "/miperfil/:id/edit",
  uploadCloud.single("photo"),
  (req, res, next) => {
    const { username, email, password, phone, photo, rating } = req.body;
    var usuario = req.user;
    console.log("mi test ", imgPath);
    if (req.file === undefined) {
      var imgPath = usuario.imgPath;
      var imgName = usuario.imgName;
    } else {
      var imgPath = req.file.url;
      var imgName = req.file.originalname;
    }

    User.findOneAndUpdate(
      { _id: req.params.id },
      { username, email, phone, imgPath, imgName }
    )
      .then(celebrity => {
        res.redirect("/auth/miperfil");
      })
      .catch(err => {
        res.render("./error", err);
      });
  }
);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

router.get(
  "/facebook",
  passport.authenticate(
    "facebook"
    // { scope: ['https://www.googleapis.com/auth/plus.login'] }
  )
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// OAuth callback url
router.get(
  "/slack/callback",
  passport.authenticate("slack", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// path to start the OAuth flow
router.get("/slack", passport.authenticate("slack"), (req, res, next) => {
  next();
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
