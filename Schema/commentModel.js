const mongoose=require('mongoose')
const users=require('./userModel')
const Commentschema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:
    {
       type:mongoose.Schema.Types.ObjectId,
       ref:users,
       required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Comment',Commentschema)