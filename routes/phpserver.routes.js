const { Router } = require('express')
//const auth = require('../middleware/auth.middleware')
const router = Router()

//temporary backend url
const phpBaseUrl = 'https://php-server-notes.herokuapp.com/'

router.post('/', /*auth,*/ async (req, res) => {
  try {
    //console.log("backend redirect", req.url)
    res.redirect(307, phpBaseUrl)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
