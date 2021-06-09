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

router.get('/:id', async (req, res)=>{
    const offre = await Offre.findById(req.params.id)
    if(offre == null) res.redirect('/profil')
    res.render('offres/show', { offre: offre})
})

router.get('/edit/:id', async (req, res)=>{
    const offre = await Offre.findById(req.params.id)
    res.render('offres/edit', {offre: offre })
})

router.post('/', upload.array('image',3), async (req, res, next)=>{
    //console.log(req.file)
    offre = new Offre()
    let imagesArray= []
    offre.titre = req.body.titre
    offre.username = {
        id: req.user._id,
        name: req.user.name
    }
    offre.description = req.body.description
    offre.adresse = req.body.adresse
    offre.ville = req.body.ville
    offre.nbchambre = req.body.nbchambre
    offre.prix = req.body.prix
    if(req.files){
        req.files.forEach(element => {
            const img = element.filename
            imagesArray.push(img)
        });
        offre.image = imagesArray
    }
    
    try {
        offre = await offre.save()
        res.redirect(`/offres/${offre.id}`)
    }catch(e) {
        console.log(e)
        res.render('offres/new', { offre: offre})
    }
})

router.put('/:id', upload.array('image',3), (req, res, next)=> {
    let imagesArray= []
    req.files.forEach(element => {
        const img = element.filename
        imagesArray.push(img)
    })
    if(imagesArray.length>0){
        var dataRecords={
            titre: req.body.titre,
            description: req.body.description,
            adresse: req.body.adresse,
            ville: req.body.ville,
            prix: req.body.prix,
            nbchambre: req.body.nbchambre,
            image : imagesArray,
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
            res.redirect(`/offres/${data.id}`)
        }catch(e) {
            res.render('offres/edit', { offre: data})
        }
    })
})


router.delete('/:id', async (req, res)=> {
    await Offre.findByIdAndDelete(req.params.id)
    res.redirect('/mesoffres')
})
/*
router.put('/activate/:id', async (req, res)=> {
    var data = {
        activer:"Active"
    }
    await Offre.findByIdAndUpdate(req.params.id, data)
    res.redirect('/mesoffres')
})
router.put('/deactivate/:id', async (req, res)=> {
    var data = {
        activer:"Désactivée"
    }
    await Offre.findByIdAndUpdate(req.params.id, data)
    res.redirect('/mesoffres')
    update.exec is not a function
})
*/
router.put('/activate/:id', async (req, res)=> {
    offre = await Offre.findById(req.params.id)
    if(offre.activer == "Désactivée") {
        var data1={
            activer : "Active"
        }
        await Offre.findByIdAndUpdate(req.params.id, data1)
    }else{
        var data2={
            activer : "Désactivée"
        }
        await Offre.findByIdAndUpdate(req.params.id, data2)
    }
    res.redirect('/mesoffres')
})



module.exports = router
