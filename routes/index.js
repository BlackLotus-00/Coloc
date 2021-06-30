const express= require('express');
const router= express.Router();
router.use(express.static('./public'));
const path=require('path');
const Offreco = require('../models/offreco')
const Demande = require('../models/demande')
const Offre = require('../models/offre')
const Visite = require('../models/visite')
const checkAuthenticated= require('./users');
//const Message = require('./../models/message');
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
    const offres = await Offreco.find({"username.id" : req.user._id, activer: "Active"}).sort({createdAt: 'desc'})
    res.render('offresco/index', {offres: offres})
})

router.get('/mesdemandes', async (req,res)=>{
    const demandes = await Demande.find({"username.id" : req.user._id, activer: "Active"}).sort({createdAt: 'desc'})
    res.render('demandes/mesdemandes', {demandes: demandes})
})

router.get('/mesoffres', async (req,res)=>{
    const offres = await Offre.find({"username.id" : req.user._id, activer: "Active"}).sort({createdAt: 'desc'})
    res.render('offres/index', {offres: offres})
})

router.get('/offres-actives', async (req,res)=>{
    var active = req.query.type
    const offres = await Offre.find({"username.id" : req.user._id, activer: active}).sort({createdAt: 'desc'})
    if (active == "Désactivée"){
        res.render('offres/desactives', {offres: offres})
    }else{
    res.render('offres/index', {offres: offres})
    }
})

router.get('/offresco-actives', async (req,res)=>{
    var active = req.query.type
    const offres = await Offreco.find({"username.id" : req.user._id, activer: active}).sort({createdAt: 'desc'})
    if (active == "Désactivée"){
        res.render('offresco/desactives', {offres: offres})
    }else{
    res.render('offresco/index', {offres: offres})
    }
})

router.get('/demandes-actives', async (req,res)=>{
    var active = req.query.type
    const demandes = await Demande.find({"username.id" : req.user._id, activer: active}).sort({createdAt: 'desc'})
    if (active == "Désactivée"){
        res.render('demandes/desactives', {demandes: demandes})
    }else{
    res.render('demandes/mesdemandes', {demandes: demandes})
    }
})

router.get('/tous', async (req,res)=>{
    const offres = await Offreco.find({activer: "Active"}).sort({createdAt: 'desc'})
    //const messengers = await Message.find({"username.id" : req.user._id }).sort({createdAt: 'desc'})
    //console.log(messengers.message);
    //await Message.deleteMany({ name : "san"});
    res.render('offres/first', {offres: offres})
})

router.get('/tousofact', async (req,res)=>{
    var active = req.query.type
    const offres = await Offre.find({activer: active}).sort({createdAt: 'desc'})
    if (active == "Désactivée"){
        res.render('offres/first', {offres: offres})
    }else{
    res.render('offresco/first', {offres: offres})
    }
})

router.get('/visites', async (req,res)=>{
    const visites = await Visite.find({"username.id" : req.user._id}).sort({createdAt: 'desc'})
    //const user = await User.findById(req.user.id)
    res.render('visite', {visites: visites, user: req.user})
})

module.exports = router;