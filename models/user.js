const mongoose=require('mongoose')
const ttl=require('mongoose-ttl')
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
   // expireAt:{type:Date,default:new Date('Sep 12,2020 23:59:00')},
    full:String,
    short:String,
    email:String,
   
})
url.index({"expireAt": 1 },{ expireAfterSeconds: 0 });
//url.plugin(ttl, { ttl: 5000, reap: false });
const model=mongoose.model('users',val)
const shURL=mongoose.model('url',url)
module.exports={model,shURL}