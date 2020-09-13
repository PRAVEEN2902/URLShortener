const router=require('express').Router()
const passport=require('passport')
const bcrypt=require('bcrypt')
const user=require('../models/user')
const ShortId=require('shortid')
router.get('/',checknotauthenticate,(req,res)=>{
    res.render('index',{msg:req.flash('err')})
})
router.get('/login',checknotauthenticate,(req,res)=>{
    res.render('login',{success:req.flash('success')})
})
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');  
  })
router.get('/home',check,(req,res)=>{
    user.shURL.find({email:req.user.email}).then(result=>{
      res.render('home',{detail:req.user.name,result})
    })
    
})
router.post('/shrink',checkauthenticate,(req,res)=>{
    new user.shURL({
      full:req.body.fullLink,
      short:ShortId.generate(),
      email:req.user.email
    }).save().then(result=>{
      console.log(result)
      res.redirect('/home')
    })
})
router.post('/submit',
passport.authenticate('local', { successRedirect: '/home',
                                 failureRedirect: '/login',
                                 failureFlash: true })
);
router.get('/sign',checknotauthenticate,(req,res)=>{
    res.render('signup',{messages:req.flash('info')});
  })
  router.post('/register',(req,res)=>{
    user.model.find({email:req.body.email}).then(output=>{
      console.log(output)
      if(output.length>0)
      {
        req.flash('info','User with email id exists');
        res.redirect('/signup')
      }
      else
      {
        bcrypt.hash(req.body.passwrd,10).then((hash)=>{
          new user.model({
            name:req.body.uname,
            email:req.body.email,
            password:hash,
            provider:'local'
          }).save().then(result=>{
            console.log(result);
            req.flash('success','Registered Successfully Login to Portal')
            res.redirect('/login')
          });
        })
       
      }
    })
    
  })
router.get('/google',passport.authenticate('google',{
    scope:['email','profile']
}));

router.get('/google/redirect',passport.authenticate('google',{ failureRedirect: '/login' }),(req,res)=>{
    res.redirect('/home');
})
router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));

router.get('/facebook/callback',passport.authenticate('facebook'),(req,res)=>{
  res.redirect('/home')
})

router.get('/shortener/:shorturl',(req,res)=>{
  user.shURL.findOne({short:'shortener/'+req.params.shorturl}).then(link=>{
    console.log(req.params.shorturl,link)
    if(link==null)
     res.sendStatus('404')

    else
      res.redirect(link.full)
  })
})
router.get('/404',(req,res)=>{
  res.render('404')
})
function check(req,res,next)
{
    if(req.isAuthenticated())
        next()
    else
        res.redirect('/login')    
}
  function checkauthenticate(req,res,next)
{
    if(req.isAuthenticated())
        next()
    else
    {
        req.flash('err','Login in to Shrink')
        res.redirect('/')    
    }
        
}
function checknotauthenticate(req,res,next)
{
  if(req.isAuthenticated())
  {
      res.redirect('/home')
  }
  else{
    next();
  }
}
module.exports=router