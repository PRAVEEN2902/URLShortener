const mongoose=require('mongoose')

const Schema=mongoose.Schema
const Schema1=mongoose.Schema
const val=new Schema({
    name:String,
    email:String,
    socialId:String,
    provider:String,
    password:String,
    
})
const url=new Schema1({
     expireAt:{type:Date,default:()=>{
         const current=new Date()
         return current.setDate(current.getDate()+2)
     }},
   
    full:String,
    short:String,
    email:String,
   
})
url.index({"expireAt": 1 },{ expireAfterSeconds: 0 });
const model=mongoose.model('users',val)
const shURL=mongoose.model('url',url)
module.exports={model,shURL}
