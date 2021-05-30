const express= require('express');
const router= express.Router();
router.use(express.static('./public'));
const passport=require('passport');
const authenticated= require('./users');



router.get('/google', passport.authenticate('google', {
    scope: ['openid','profile','email']
}));
// google auth  call back
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profil')
    }
)

/*/  
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
*/
module.exports = router;