const mongoose = require(`mongoose`)


mongoose.connect(`mongodb://localhost:27017/Coloc`, {userNewUrlParser: true},(err)=>{
    if (!err){console.log('MongoDB est bien connecté')}
    else{console.log(`Erreur de connection ${err}`)}
});

require(`./coloc.model`)