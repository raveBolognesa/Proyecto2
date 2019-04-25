const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/modelProducts");
const uploadCloud = require('../config/cloudinary.js');
const ensureLoggedIn = require("../middlewares/ensureLoggedIn.js");
const isCreator = require("../middlewares/isCreator.js");

const Swag = require('swag');

Swag.registerHelpers(Handlebars);
// dsaa
// document.getElementById("localizacion").value
router.get('/', (req, res, next) => {
  Product.find( {}).sort({ lat: 1 })
    .then(Product => {
      res.render('Products/seeProduct', {Product: Product});
    })
    .catch(err => {
      res.render('error', err)
    })
});

router.get('/search/:param', (req, res, next) => {
  let lat = req.params.param
  Product.find( {}).sort({lng:lat})
    .then(Product => {
      res.render('Products/seeProduct', {Product: Product});
    })
    .catch(err => {
      res.render('error', err)
    })
});

router.get('/mapa', (req, res, next) => {
  Product.find({})
    .then(Product => {
      res.json({Product: Product});
    })
    .catch(err => {
      res.render('error', err)
    })
});
  
  
  router.get('/new', ensureLoggedIn, (req, res, next) => {
    console.log(req.user)
    res.render('Products/crearProduct');
  })


  
  // creamos
  router.post('/new', uploadCloud.single('photo'), (req, res, next) => {
  
  var { name, description, typeFood, vegan, veget, lat , lng, Pos } = req.body;
  var ingredients = req.body.listIngredientes.split(",")
  var kcal = 3
  console.log(ingredients)
  console.log(kcal)
  const imgPath = req.file.url;
  if(vegan === undefined){ vegan = false}else{vegan=true}
  if(veget === undefined){ veget = false}else{veget=true}
  typeFood = typeFood[1]
  console.log(vegan,veget, typeFood)
  const imgName = req.file.originalname;
  const author = req.user.id;
  const main = new Product({name, author,kcal, ingredients,vegan,veget, typeFood, description, imgPath, imgName,lat , lng, Pos})
  main.save()
  .then(
    res.redirect('/products')
  )
  .catch(error => {
    res.render('./error', error)
  })

    // Product.create(req.body)
    // .then(result => {
      
    //   res.redirect('/products')
    // })
    // .catch(err => {
    //   res.render('./error', err)
    // })
  })

  // Editamos
  
  router.get('/:id/edit', [ensureLoggedIn, isCreator],(req, res, next) => { 
    Product.findOne({_id: req.params.id})
      .then(celebrity => {
        
        res.render('Products/editProduct', celebrity);
      })
      .catch(err => {
        res.render('./error', err)
      })
  });
  
  // editado
  router.post('/:id/edit', [ensureLoggedIn, isCreator], uploadCloud.single('photo'), (req, res, next) => { 
    const { name, description,lat , lng } = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
   
        Product.findOneAndUpdate({_id: req.params.id}, {name, description, imgPath, imgName,lat , lng})
          .then(celebrity => {
            res.redirect('/products');
          })
          .catch(err => {
            res.render('./error', err)
          })
  })
  
  
  router.post('/:id/delete', [ensureLoggedIn, isCreator],(req, res, next) => {
    Product.findByIdAndDelete({_id: req.params.id})
      .then(record => {
        res.redirect('/Products');
      })
      .catch(err => {
        res.render('./error', err)
      })
  })
  
  
  router.get('/:id', (req, res, next) => {
    Product.findOne({_id : req.params.id})
      .then(celebrity => {
        User.findOne({_id : celebrity.author}).then(respuesta=>{
          celebrity.author= respuesta
          res.render('Products/show', celebrity)
        })

        // res.render('Products/show', celebrity)
      })
      .catch(err => {
        res.render('./error', err)
      })
  });

  // json para el mapa
  
  // router.get('/mapa', (req, res, next) => {
  //   Product.find({})
  //   .then(Product => {
  //     res.json({Product: Product});
  //   })
  //   .catch(err => {
  //     res.render('error', err)
  //   })
  // })

  

 


module.exports = router;