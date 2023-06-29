
const mongoose = require("mongoose")

const msgSchema = mongoose.Schema({
         name:{type:String,require:true},
         message:{type:String,require:true}
},{
    versionKey:false
})

const msgmodel = mongoose.model("msg",msgSchema)

module.exports={msgmodel}