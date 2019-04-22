const express = require("express");
const passport = require('passport');
const router = express.Router();
const Product = require("../models/modelProducts");
const uploadCloud = require('../config/cloudinary.js');


router.get('/', (req, res, next) => {
  Product.find({})
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
  
  
  router.get('/new', (req, res, next) => {
    res.render('Products/crearProduct');
  })


  
  // creamos
  router.post('/new', uploadCloud.single('photo'), (req, res, next) => {


  const { name, description,lat , lng } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const main = new Product({name, description, imgPath, imgName,lat , lng})
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
  
  router.get('/:id/edit', (req, res, next) => { 
    Product.findOne({_id: req.params.id})
      .then(celebrity => {
        
        res.render('Products/editProduct', celebrity);
      })
      .catch(err => {
        res.render('./error', err)
      })
  });
  
  // editado
  router.post('/:id/edit', (req, res, next) => { 
    Product.updateOne({_id: req.params.id}, req.body)
      .then(celebrity => {
        res.redirect('/products');
      })
      .catch(err => {
        res.render('./error', err)
      })
  })
  
  
  router.post('/:id/delete', (req, res, next) => {
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