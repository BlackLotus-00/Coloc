const express = require('express')
const mongoose = require('mongoose')
const Offreco = require('./models/offreco')
const offreCoRouter = require('./routes/offresco')
const Demande = require('./models/demande')
const demandeRouter = require('./routes/demandes')
const Offre = require('./models/offre')
const offreRouter = require('./routes/offres')
const methodOverride = require('method-override')
var bodyParser = require('body-parser')
const app = express()

mongoose.connect('mongodb://localhost/offre', {
     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    })

app.set('view engine', 'ejs')
mongoose.set('useFindAndModify', false);
app.use( express.static( "public" ) )
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/mesoffresco', async (req,res)=>{
    const offres = await Offreco.find().sort({createdAt: 'desc'})
    res.render('offresco/index', {offres: offres})
})

app.get('/mesdemandes', async (req,res)=>{
    const demandes = await Demande.find().sort({createdAt: 'desc'})
    res.render('demandes/mesdemandes', {demandes: demandes})
})

app.get('/mesoffres', async (req,res)=>{
    const offres = await Offre.find().sort({createdAt: 'desc'})
    res.render('offres/index', {offres: offres})
})

app.get('/profil-locateur', (req, res)=>{
    const user = [{
        username: 'fifi',
        name: 'dodo',
        lastname: 'lolo',
        email: 'fifi@dodo',
        datenaissance: 21,
        telnum: '0652321475'
    }]
    res.render('offres/profil', { user : user})
})
app.get('/profil-etudiant', (req, res)=>{
    const user = [{
        username: 'fifi',
        name: 'dodo',
        lastname: 'lolo',
        email: 'fifi@dodo',
        datenaissance: 21,
        telnum: '0652321475'
    }]
    res.render('offresco/profil', { user : user})
})
app.use('/offresco', offreCoRouter)
app.use('/demandes', demandeRouter)
app.use('/offres', offreRouter)
app.listen(1600)
