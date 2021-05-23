const express= require('express');
const router= express.Router();
router.use(express.static('./public'));
const path=require('path');
const Offreco = require('../models/offreco')
const Demande = require('../models/demande')
const Offre = require('../models/offre')
const checkAuthenticated= require('./users');
//welcome page
router.get('/', (req,res) => {
    res.sendFile(path.resolve('./public/welcome.html'))
})

router.get('/google', checkAuthenticated, (req,res)=> {
    res.render('google', {
        user: req.user
    
  });
});
// profile
router.get('/profil', checkAuthenticated,(req,res)=> {
    if(req.user.status == "status2"){
        res.render('pro1', {
            user: req.user
      });
    }else{
        res.render('pro2', {
            user: req.user
      });
    }
})
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

router.get('/mesoffresco', async (req,res)=>{
    const offres = await Offreco.find({"username.id" : req.user._id}).sort({createdAt: 'desc'})
    res.render('offresco/index', {offres: offres})
})

router.get('/mesdemandes', async (req,res)=>{
    const demandes = await Demande.find({"username.id" : req.user._id}).sort({createdAt: 'desc'})
    res.render('demandes/mesdemandes', {demandes: demandes})
})

router.get('/mesoffres', async (req,res)=>{
    const offres = await Offre.find({"username.id" : req.user._id}).sort({createdAt: 'desc'})
    res.render('offres/index', {offres: offres})
})

module.exports = router;