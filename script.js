const express=require('express')
const app=express()
const port=process.env.PORT || 3000;
const router=require('./routes/route');
const mongoose=require('mongoose')
const flash = require('express-flash');
const passportsetup=require('./config/passport')
const passport = require('passport');
const cookieSession=require('cookie-session');
mongoose.connect('mongodb+srv://Praveen:Srit@123@test.ldcov.mongodb.net/URLSHortener?retryWrites=true&w=majority',{
    useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true
},()=>{
    console.log('Connected')
})


app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:['prettysimpleLogin']
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(router)
app.listen(port)
