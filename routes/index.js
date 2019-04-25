const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Coment = require("../models/coment");
const uploadCloud = require("../config/cloudinary.js");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const isCreator = require("../middlewares/isCreator.js");

const Swag = require("swag");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});

////
router.post(
  "/coment/:id",
  ensureLoggedIn("/login"),
  uploadCloud.single("photo"),
  (req, res) => {
    let id = req.body.id;

    const pic = new Coment({
      name: req.body.name,
      path: req.file.url,
      originalName: req.file.originalname,
      referenceId: req.params.id,
      creatorId: req.user._id,
      postId: id
    });
    pic.save(err => {
      res.redirect("/");
    });
  }
);

router.post(
  "/coment",
  ensureLoggedIn("/login"),
  uploadCloud.single("photo"),
  (req, res) => {
    let id = req.body.id;

    const pic = new Coment({
      name: req.body.name,
      path: req.file.url,
      originalName: req.file.originalname,
      referenceId: String,
      creatorId: req.user._id,
      postId: id
    });
    // console.log(Picture.findById(req.body.id))
    // console.log(pic)
    // Picture.updateOne({_id: id}, {comments:["hola","adios"]})

    // Picture.findOneAndUpdate({_id: id}, {comments:["hola","adios"]})

    // Picture.findById(id).then(picture=>{ picture.comments.push(pic);

    // console.log(pic)
    // console.log(picture)
    // picture.save() });
    // Picture.findByIdAndUpdate({_id: req.body.id}, {photo: [pic]})

    // res.render('index')
    pic.save(err => {
      res.redirect("/");
    });
  }
);

router.post("/coment/:id/edit", ensureLoggedIn("/login"), (req, res, next) => {
  Coment.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(result => {
      console.log("peliacu actualizada:", result);
      res.redirect("/");
    })
    .catch(err => {
      res.render("./error", err);
    });
});

router.post("/photo/:id/edit", ensureLoggedIn("/login"), (req, res, next) => {
  Picture.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(result => {
      console.log("peliacu actualizada:", result);
      res.redirect("/");
    })
    .catch(err => {
      res.render("./error", err);
    });
});

router.post(
  "/coment/:id/delete",
  ensureLoggedIn("/login"),
  (req, res, next) => {
    Coment.deleteOne({ _id: req.params.id })
      .then(result => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("./error", err);
      });
  }
);

////

module.exports = router;
