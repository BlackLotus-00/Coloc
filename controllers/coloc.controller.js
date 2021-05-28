const { request } = require('express');
const express = require('express');
var router= express.Router();
const mongoose = require('mongoose');
const Offre_demande = mongoose.model('Offre_demande');
//const Commentaire = mongoose.model('Commentaire');
const multer = require('multer');
const nodemailer = require("nodemailer");

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

router.post('/', upload.array('image',12),(req,res)=>{
    insertRecord(req,res)
}); 

//insertion des données
function insertRecord(req,res){
    var offre_demande = new Offre_demande();
    req.files.forEach(element => {
        const img = element.filename
        offre_demande.img.push(img)
    });
    offre_demande.Nom = req.body.Nom;
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
//function insertRecordComment(req,res){
//    var commentair = new Commentaire();
//    commentair.annonce_id=req.body.ObjectID;
//    commentair.comment=req.body.comment;
//    commentair.owner=req.body.owner;
//    commentair.save((err, doc) => {
//        if(!err)
//            //res.send('comment saved');
//            res.render('coloc/Annonce');
//        else{
//                console.log(err);
//        }
//    });
//};

//router.post('/comment', (req,res)=>{
//    //insertRecordComment(req,res);
//    let OID = req.body.ObjectID;
//    let dataText = req.body.comment;
//    let dataOwner = req.body.owner;
//    let data = [{Text:dataText,owner:dataOwner}]
//    Offre_demande.findOne({_id:OID},(err,foundObject)=>{
//        if(!err){
//            if(!foundObject) {
//                res.status(404).send();
//
//            }else{
//                data.forEach(function(value)
//                    {foundObject.comment.push(value)});
//                //foundObject.comment.Text = dataText;
//                //foundObject.comment.owner = dataOwner;
//                foundObject.save((err,updatedObject)=>{
//                    if(err){
//                        console.log(err);
//                        res.status(500).send();
//                    }
//                    else{
//                        res.send('votre commentaire a ete ajouter')
//                    }
//                });
//            }
//        }else{
//            console.log(err);
//            res.status(500).send();
//        }
//    })
//    
//    
//    
//    
//
//});


router.get('/list',upload.single('image'),(req,res)=>{
    //get type
    //if type && type!==all
    //  filter
    let category = req.query.Category;
    if (category && category !== 'All'){
        Offre_demande.find({Type: category},(err, docs)=>{
            if (!err){
                res.render("coloc/list",{
                    list: docs
                });
            }
            else{
                console.log(err);
            }
        }).lean();
    }
    else {
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
    }
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

router.get('/contact', function(req, res){
    //res.json({message:"Email function not implemented "})
    res.render("coloc/contact")
})
router.post('/ajax/email', function(req,res){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user:"coloc2021.9@gmail.com",
            pass: "20202021ENIM"
        }
    });
    var textBody = `From: ${req.query.Nom} Email:${req.query.Email} MESSAGE: ${req.query.message}`;
    //var textBody = ('From: '+req.body.Nom + 'Email:'  + req.body.email+'; MESSAGE:', + req.body.message);
    var htmlBody = `<h2>Mail Form Contact Form<h2/><p>from: ${req.body.Nom}<a href='mailto:${req.body.Email}'</p><p>${req.body.message}</p>></a>`;
    var mail = {
        from: "coloc2021.9@gmail.com",
        to: `mezgour.yassine@gmail.com`,
        subject: "Mail Form Contact Form",
        text: textBody,
        html: htmlBody
    };
    transporter.sendMail(mail, function(err, info){
        if(err){
            console.log(err);
            res.json({message: " an error occured;" + err});
        }
        else{
            res.json({message: `message sent with ID: ${info.messageId}`});

        }
    });

});

router.post('/Annonce', upload.single('image') ,async(req,res)=>{
    let OID = req.body.ObjectID;
    let offre = req.body.btn_annonce;
    //afficher l'annonce
    var result = [];
    var comments_a = [];
    Offre_demande.findById(OID,(err, data)=>{
        if (!err){
            result.img = data.img;
            result.Nom  =data.Nom  
            result.Adresse  =data.Adresse  
            result.Ville  =data.Ville  
            result.Prix  =data.Prix  
            result.Type  =data.Type  
            result.Description =data.Description 
            result._id = data._id
            data.comment.forEach(function(value){comments_a.push(value)})
        }
        else{
            console.log(err);
        }
    }).exec();
    var result_2 = [];

    await Offre_demande.find({Ville:offre,_id:{$ne:OID}},(err, data)=>{
        if (!err){
            data.forEach(function(value)
            {result_2.push(value)});
            
        }
        else{
            console.log(err);
        }
    }).limit(6).lean();
    if (result_2.length < 6 ){
        var test = result_2.length;
        await Offre_demande.find({Ville:{$ne:offre},_id:{$ne:OID}},(err, data)=>{
            if (!err){
                data.forEach(function(value)
                {result_2.push(value)});
                
            }
            else{
                console.log(err);
            }
        }).limit(6-test).lean();
    }
    res.render("coloc/Annonce",{result,result_2,comments_a})
    

});
router.get('/se_connecter/', (req,res)=>{
        res.render("coloc/se_connecter")
});

module.exports = router;