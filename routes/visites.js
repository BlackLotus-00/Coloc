const express = require('express')
const Visite = require('./../models/visite')
const User = require('../models/users')
const Offre = require('../models/offreco')
const router = express.Router()

var aname;
var idd;
var title;
var clients = [];

router.get('/:id', async(req, res)=>{
    
    
    const offre = await Offre.findById(req.params.id)
    const userr = await User.findById(offre.username.id)
    console.log(userr.name)
    if(userr == null) res.redirect('/tous')
    aname = userr.name
    idd = userr.id
    title = offre.titre
    
    
    //const vistess = await Visite.find({destinataire : req.user._id, name :{$ne: req.user.name} }).distinct("username.id")
    const visites = await Visite.find({ "username.id" : req.user._id })
    

    res.render('visite', { user: req.user, visites: visites})
  })

router.post('/', async (req, res, next)=>{
    visite = new Visite()
    visite.titre = title
    visite.username = {
        id: req.user._id,
        name: req.user.name
    }
    visite.destinataire = idd
    visite.destname = aname
    visite.lieu = req.body.lieu
    visite.date = req.body.date
    
    try {
        visite = await visite.save()
        res.redirect('/visites')
    }catch(e) {
        res.render('visite', { visite: visite})
        console.log(e)
    }
})

router.put('/:id', async (req, res, next)=>{
    visite = await Visite.findById(req.params.id)
    var data={
        approuver : "oui"
    }
    await Visite.findByIdAndUpdate(req.params.id, data)
    res.redirect('/profil')
})



router.delete('/:id', async (req, res)=> {
    await Visite.findByIdAndDelete(req.params.id)
    res.redirect('/visites')
})

module.exports = router