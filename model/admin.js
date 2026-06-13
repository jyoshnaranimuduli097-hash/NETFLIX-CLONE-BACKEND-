const mongoose = require('mongoose')


let UserSchema = mongoose.Schema({
    email:{
        type:String,    
    },
    password:{
        type:String,
    }

})

module.exports=mongoose.model('admin',UserSchema)