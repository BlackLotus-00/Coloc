const express = require('express')
const Demande = require('./../models/demande')
const router = express.Router()

router.get('/new',(req,res)=>{
    res.render('demandes/new', { demande: new Demande() })
})

router.get('/:id', async (req, res)=>{
    const demande = await Demande.findById(req.params.id)
    if(demande == null) res.redirect('/')
    res.render('demandes/show', { demande: demande})
})

router.get('/edit/:id', async (req, res)=>{
    const demande = await Demande.findById(req.params.id)
    res.render('demandes/edit', {demande: demande })
})

router.post('/', async (req, res, next)=>{
    demande = new Demande()
    
    demande.titre = req.body.titre
    demande.username = {
        id: req.user._id,
        name: req.user.name
    }
    demande.description = req.body.description
    demande.ville = req.body.ville
    demande.type = req.body.type
    
    try {
        demande = await demande.save()
        res.redirect(`/demandes/${demande.id}`)
    }catch(e) {
        res.render('demandes/new', { demande: demande})
        console.log(e)
    }
})

router.put('/:id', async (req, res, next)=>{
    req.demande = await Demande.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

function saveAndRedirect(path) {
    return async (req, res)=> {
        let demande = req.demande
        demande.titre = req.body.titre
        demande.description = req.body.description
        demande.ville = req.body.ville
        demande.type = req.body.type
        try {
            demande = await demande.save()
            res.redirect(`/demandes/${demande.id}`)
        }catch(e) {
            res.render(`demandes/${path}`, { demande: demande})
        }
    }
}

router.delete('/:id', async (req, res)=> {
    await Demande.findByIdAndDelete(req.params.id)
    res.redirect('/mesdemandes')
})

router.put('/activate/:id', async (req, res)=> {
    demande = await Demande.findById(req.params.id)
    if(demande.activer == "Désactivée") {
        var data1={
            activer : "Active"
        }
        await Demande.findByIdAndUpdate(req.params.id, data1)
    }else{
        var data2={
            activer : "Désactivée"
        }
        await Demande.findByIdAndUpdate(req.params.id, data2)
    }
    res.redirect('/mesdemandes')
})

module.exports = router


