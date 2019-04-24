const Product = require("../models/modelProducts");


const isCreator = (req,res,next)=> {
  const id=req.params.id
  Product.findById(id)
  .then(product => {
    if (product.author.toString() === req.user.id) {
      next()
    }
    else{
      res.redirect('/Products')
    }
  })
  .catch(err => {
    res.render('./error', err)
  })

}

module.exports = isCreator;