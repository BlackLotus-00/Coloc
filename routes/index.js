const express= require('express');
const router= express.Router();
router.use(express.static('./public'));
const path=require('path');
const checkAuthenticated= require('./users');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');




//welcome page
router.get('/',forwardAuthenticated, (req,res) => {
    res.sendFile(path.resolve('./public/welcome.html'))
})

router.get('/google', checkAuthenticated, (req,res)=> {
    res.render('google', {
        user: req.user
    
  });
});
// profile
router.get('/profil', ensureAuthenticated, (req, res) =>
  res.render('profil2', {
    user: req.user
  })
);
router.get('/hello', checkAuthenticated,(req,res)=> {
    res.render('hello', {
        user: req.user
  });
})
router.get('/hi', checkAuthenticated,(req,res)=> {
    res.render('hi', {
        user: req.user
  });
})

module.exports = router;