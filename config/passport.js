const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20')
const user=require('../models/user')
const LocalStrategy=require('passport-local').Strategy
const FacebookStrategy=require('passport-facebook')
const bcrypt=require('bcrypt')
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
    //console.log(username);
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
    callbackURL:"http://localhost:3000/google/redirect",
    clientID:"883772647053-3srokuq6jubt8sfiqogu17bv2tvdplhb.apps.googleusercontent.com",
    clientSecret:"yVPjf_BTs8Oa7jUM1FnfN05L"
},(accessToken,refreshToken,profile,done)=>{
   // console.log(profile)
    user.model.findOne({socialId:profile.id}).then((current)=>{
        if(current)
        {
            console.log('User exists');
            done(null,current);
        }
        else{
            new user.model({
                name:profile.displayName,
                socialId:profile.id,
                email:profile.emails[0].value,
                provider:profile.provider
            }).save().then((result)=>{
                console.log('Saved Sucessfully'+result);
                done(null,result);
            })
        
        }
    })
   
}))

passport.use(new FacebookStrategy({
    clientID: "898717763986513",
    clientSecret: "6b795b97f49c9619468ce3355341e2d5",
    callbackURL: "http://localhost:3000/facebook/callback",
    profileFields:['email','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
   // console.log(profile)
    user.model.findOne({socialId:profile.id}).then((current)=>{
        if(current)
        {
            console.log('User exists');
            done(null,current);
        }
        else{
            new user.model({
                name:profile.displayName,
                socialId:profile.id,
                email:profile.emails[0].value,
                provider:profile.provider
            }).save().then((result)=>{
                console.log('Saved Sucessfully'+result);
                done(null,result);
            })
        
        }
    })
  }
));
