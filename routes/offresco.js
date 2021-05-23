const express = require('express')
const Offre = require('./../models/offreco')
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
    res.render('offresco/new', { offre: new Offre() })
})

router.get('/:id', async (req, res)=>{
    const offre = await Offre.findById(req.params.id)
    if(offre == null) res.redirect('/profil')
    res.render('offresco/show', { offre: offre})
})

router.get('/edit/:id', async (req, res)=>{
    const offre = await Offre.findById(req.params.id)
    res.render('offresco/edit', {offre: offre })
})

router.post('/', upload.single('image'), async (req, res, next)=>{
    //console.log(req.file)
    offre = new Offre()
    
    offre.titre = req.body.titre
    offre.username = {
        id: req.user._id,
        name: req.user.name
    }
    offre.description = req.body.description
    offre.adresse = req.body.adresse
    offre.ville = req.body.ville
    offre.prix = req.body.prix
    offre.nbchambre = req.body.nbchambre
    if(req.file) {
        offre.image = req.file.filename
    }
    
    try {
        offre = await offre.save()
        res.redirect(`/offresco/${offre.id}`)
    }catch(e) {
        console.log(e)
        res.render('offresco/new', { offre: offre})
    }
})

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
            res.redirect(`/offresco/${data.id}`)
        }catch(e) {
            res.render('offresco/edit', { offre: data})
        }
    })
})


router.delete('/:id', async (req, res)=> {
    await Offre.findByIdAndDelete(req.params.id)
    res.redirect('/mesoffresco')
})

module.exports = router