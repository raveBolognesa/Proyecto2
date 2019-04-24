
const ensureLoggedIn = (req,res,next)=> {
  if (req.user) {

    console.log("Acceso permitido", req.user)
    next()
  } else {
  console.log("Acceso denegado", req.user)
  res.redirect('/auth/login');
    }

}

module.exports = ensureLoggedIn;