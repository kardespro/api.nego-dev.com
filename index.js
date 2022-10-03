const express = require('express');
const LoggerUtils = require("./src/middlewares/logger")
const TimeUtils = require("./src/middlewares/timestamp")
const cryptUtils = require("./src/middlewares/cryptdata")
const softwareerUtils = require("./src/providers/softwareer/index")
const axios = require("axios")
const db = require("quick.db")
const app = express();

//middlewares
app.use((req, res, next) => {
  let dv = TimeUtils._createTimeStamp()
  console.log('Time:', dv)
  console.log(`Coverted : ${TimeUtils._readTime(dv)}`)
   let d = LoggerUtils._createLogger({req:req,res:res})
  console.log(d)
  // Secure Area 
  let encdata = res.status + req.headers["x-forwarded-for"] + req.method
  cryptUtils._s(encdata)
  console.log(`User Information Encrypted `)
  next()
})





// Routers 


app.get('/', (req, res) => {
  res.status(401).json({timestamp: TimeUtils._createTimeStamp() , message: "Access Denied"})
});

// SSO OAUTHZ

app.get('/_oauth2/token', (req, res) => {
  let mk = makeToken(32)
  res.status(200).json({timestamp: TimeUtils._createTimeStamp() , message: mk})
});


app.get('/_oauth2/authorize', (req, res) => {
  let mk = makeToken(32)
  if(!req.query.orign) return res.status(401).json({message: "Orign Not Found"})
  let orignFetch = db.fetch(`origns.${req.query.orign}`)
  if(!orignFetch) return res.json({message: "Orign Not Found"})
  
   db.set(`user.${req.headers["x-forwarded-for"]}`, {orign: req.query.orign,token: mk })
  
  return res.redirect(`${orignFetch.callbackURL}?_nego=${mk}&ip=${req.headers["x-forwarded-for"]}`)
  
});





app.get('/_me/json', async(req, res) => {
 let q = req.query;

  
 if(!q) return  res.status(401).json({timestamp: TimeUtils._createTimeStamp() , message: "Access Denied"})
   res.setHeader('Content-Type', 'text/json'); 

  if(q.mode === "lanyard") {
   res.setHeader('Content-Type', 'text/json'); 
   let lanyardApiCall = await axios.get(`https://api.lanyard.rest/v1/users/682607343707488388`)
   return res.status(200).json(lanyardApiCall.data)
 }
 
  if(q.mode === "softwareer"){
    res.setHeader('Content-Type', 'text/json'); 
    if(!q.authenication) return res.json({ status: false , message: "SoftWareer Authenication Token Not Provided"})
    let softskill = await softwareerUtils.loadSkills(q.authenication)
    return res.status(200).json(softskill)
  }

  

  res.status(401).json({timestamp: TimeUtils._createTimeStamp() , message: "Access Denied"})
});

// Functions

function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.listen(3000, () => {
  console.log('server started');
 // console.log(db.fetch(`logged`))
});
