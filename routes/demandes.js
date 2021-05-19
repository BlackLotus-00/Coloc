const express = require('express')
const Demande = require('./../models/demande')
const router = express.Router()

router.get('/new',(req,res)=>{
    res.render('demandes/new', { demande: new Demande() })
})

router.get('/:slug', async (req, res)=>{
    const demande = await Demande.findOne({ slug: req.params.slug })
    if(demande == null) res.redirect('/')
    res.render('demandes/show', { demande: demande})
})

router.get('/edit/:id', async (req, res)=>{
    const demande = await Demande.findById(req.params.id)
    res.render('demandes/edit', {demande: demande })
})

router.post('/', async (req, res, next)=>{
    req.demande = new Demande()
    next()
}, saveAndRedirect('new'))

router.put('/:id', async (req, res, next)=>{
    req.demande = await Demande.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

function saveAndRedirect(path) {
    return async (req, res)=> {
        let demande = req.demande
        demande.titre = req.body.titre
        demande.username = req.body.username
        demande.description = req.body.description
        demande.ville = req.body.ville
        demande.type = req.body.type
        try {
            demande = await demande.save()
            res.redirect(`/demandes/${demande.slug}`)
        }catch(e) {
            res.render(`demandes/${path}`, { demande: demande})
        }
    }
}

router.delete('/:id', async (req, res)=> {
    await Demande.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports = router

