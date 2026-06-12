const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    }

})

module.exports=mongoose.model('user',UserSchema)