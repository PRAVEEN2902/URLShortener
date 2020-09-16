const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20')
const user=require('../models/user')
const LocalStrategy=require('passport-local').Strategy
const FacebookStrategy=require('passport-facebook')
const bcrypt=require('bcrypt')
const keys=require('../keys')
passport.serializeUser((user,done)=>
{
    done(null,user.id);
})
passport.deserializeUser((id,done)=>
{
    user.model.findById(id).then((user)=>{
        done(null,user);
    })
})
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwrd'
},
function(username, password, done) {
    user.model.find({email:username}).then(record=>{
        if(record.length==0)
        {
            done(null,false,{message:'Invalid Email.If you are a new user kindly Register'});
        }
        else
        {
            bcrypt.compare(password,record[0].password).then(result=>{
                if(result==true)
                    done(null,record[0])
                else
                    done(null,false,{message:'Password Incorrect'});
            })
           
            
        }
    })
  }
))

passport.use(new GoogleStrategy({
    callbackURL:"http://awfly.herokuapp.com/google/redirect",
    clientID:keys.google.clientId,
    clientSecret:keys.google.clientSecret
},(accessToken,refreshToken,profile,done)=>{
    user.model.findOne({socialId:profile.id}).then((current)=>{
        if(current)
        {
            done(null,current);
        }
        else{
            new user.model({
                name:profile.displayName,
                socialId:profile.id,
                email:profile.emails[0].value,
                provider:profile.provider
            }).save().then((result)=>{
                
                done(null,result);
            })
        
        }
    })
   
}))

passport.use(new FacebookStrategy({
    clientID:  keys.facebook.FACEBOOK_APP_ID,
    clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
    callbackURL: "https://awfly.herokuapp.com/facebook/callback",
    profileFields:['email','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    user.model.findOne({socialId:profile.id}).then((current)=>{
        if(current)
        {
            done(null,current);
        }
        else{
            new user.model({
                name:profile.displayName,
                socialId:profile.id,
                email:profile.emails[0].value,
                provider:profile.provider
            }).save().then((result)=>{
                done(null,result);
            })
        
        }
    })
  }
));
