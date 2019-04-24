const express = require("express");
const passport = require('passport');
const router = express.Router();
const Product = require("../models/modelProducts");
const uploadCloud = require('../config/cloudinary.js');
const ensureLoggedIn = require("../middlewares/ensureLoggedIn.js");
const isCreator = require("../middlewares/isCreator.js");

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
    res.render('Products/crearProduct');
  })


  
  // creamos
  router.post('/new', uploadCloud.single('photo'), (req, res, next) => {


  const { name, description,lat , lng, Pos } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const author = req.user.id;
  const main = new Product({name, author, description, imgPath, imgName,lat , lng, Pos})
  main.save()
  .then(Product => {
    res.redirect('/products');
  })
  .catch(error => {
    res.render('./error', err)
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
        res.render('Products/show', celebrity)
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