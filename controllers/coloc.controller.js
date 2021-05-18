const express = require('express');
var router= express.Router();
const mongoose = require('mongoose');
const Offre_demande = mongoose.model('Offre_demande');
const multer = require('multer');

const storage = multer.diskStorage(
    {
    destination:function(req,file,callback){
        callback(null, './public/uploads/images');
    },

    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
    }
);
const upload = multer({
    storage: storage,
    limits:{
        fieldSize:1024*1024*3,
    }
});

router.get('/', (req,res)=>{
    res.render('coloc/addOrEdit',{
        viewTitle : "DEPOSER VOTRE ANNONCE"
    });
});

router.post('/', upload.single('image'),(req,res)=>{
    insertRecord(req,res)
}); 


function insertRecord(req,res){
    var offre_demande = new Offre_demande();
    offre_demande.img = req.file.filename;
    offre_demande.Nom = req.body.nom;
    offre_demande.Adresse = req.body.adresse;
    offre_demande.Ville = req.body.ville;
    offre_demande.Prix = req.body.prix;
    offre_demande.Type = req.body.type;
    offre_demande.Description = req.body.description;
    offre_demande.save((err, doc) => {
        if(!err)
            res.redirect('coloc/list');
        else{
            if (err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render('coloc/addOrEdit',{
                    viewTitle : "DEPOSER VOTRE ANNONCE",
                    coloc:req.body,

                });
            }
            else
                console.log(err);
        }

    });
}


router.get('/list',upload.single('image'),(req,res)=>{
    //get type
    //if type && type!==all
    //  filter
    //let category = req.body.category;
    //if (category && category !== 'All'){
    //    Offre_demande.find({Type: 'category'},(err, docs)=>{
    //        if (!err){
    //            res.render("coloc/list",{
    //                list: docs
    //            });
    //        }
    //        else{
    //            console.log(err);
    //        }
    //    }).lean();
    //}
    //else {
        Offre_demande.find((err, docs)=>{
            if (!err){
                res.render("coloc/list",{
                    list: docs
                });
            }
            else{
                console.log(err);
            }
        }).lean();
    //}
}); 



function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch (err.errors[field].path){
            case'Prix':
                body['prixError']=err.errors[field].message;
                break;
            case 'Ville':
                body['villeError']=err.errors[field].message;
                break;
            case 'Adresse':
                body['adresseError']=err.errors[field].message;
                break;
            case 'Type':
                body['typeError']=err.errors[field].message;
                break;
            default:
                break;
            
        }
    }
}
module.exports = router;