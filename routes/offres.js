const express = require('express')
const Offre = require('./../models/offre')
const multer = require('multer')
const router = express.Router()


const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/images');
    },

    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
})

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3,
    }
})


router.get('/new',(req,res)=>{
    res.render('offres/new', { offre: new Offre() })
})

router.get('/:slug', async (req, res)=>{
    const offre = await Offre.findOne({ slug: req.params.slug })
    if(offre == null) res.redirect('/profil')
    res.render('offres/show', { offre: offre})
})

router.get('/edit/:id', async (req, res)=>{
    const offre = await Offre.findById(req.params.id)
    res.render('offres/edit', {offre: offre })
})

router.post('/', upload.single('image'), async (req, res, next)=>{
    //console.log(req.file)
    req.offre = new Offre()
    next()
}, saveAndRedirect('new'))
/*
router.put('/:id', async (req, res, next)=>{
    req.offre = await Offre.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))
*/
router.put('/:id', upload.single('image'), (req, res, next)=> {
    if(req.file){
        var dataRecords={
            titre: req.body.titre,
            description: req.body.description,
            adresse: req.body.adresse,
            ville: req.body.ville,
            prix: req.body.prix,
            nbchambre: req.body.nbchambre,
            image: req.file.filename,
        }
    }else{
        var dataRecords={
            titre: req.body.titre,
            description: req.body.description,
            adresse: req.body.adresse,
            ville: req.body.ville,
            prix: req.body.prix,
            nbchambre: req.body.nbchambre,
        }
    }

    var update= Offre.findByIdAndUpdate(req.params.id, dataRecords)
    update.exec((err, data)=>{
        if(err) throw err;
        try {
            res.redirect(`/offres/${data.slug}`)
        }catch(e) {
            res.render('offres/edit', { offre: data})
        }
    })
})
function saveAndRedirect(path) {
    return async (req, res)=> {
        let offre = req.offre
        offre.titre = req.body.titre
        offre.description = req.body.description
        offre.adresse = req.body.adresse
        offre.ville = req.body.ville
        offre.nbchambre = req.body.nbchambre
        offre.prix = req.body.prix
        offre.image = req.file.filename
        try {
            offre = await offre.save()
            res.redirect(`/offres/${offre.slug}`)
        }catch(e) {
            console.log(e)
            res.render(`offres/${path}`, { offre: offre})
        }
    }
}

router.delete('/:id', async (req, res)=> {
    await Offre.findByIdAndDelete(req.params.id)
    res.redirect('/mesoffres')
})

module.exports = router