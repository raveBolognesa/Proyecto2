const User = require("../models/User");


const isRafa = (req,res,next)=> {
  const elPerfil=req.params.userid
  User.findById(elPerfil)
  .then(esElPerfil => {
    if (esElPerfil.id === req.user.id) {
      next()
    }
    else{
      res.redirect('/auth/miperfil')
    }
  })
  .catch(err => {
    res.redirect('/auth/miperfil')
  })

}

module.exports = isRafa;