var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

const fetch = require("cross-fetch");

let eror={
  masage:""
};


/* GET login html. */
router.get('/', function(req, res,) {
  res.render('signin',{eror:eror.masage});
  eror.masage="";
});


// Post Login
router.post("/",upload.fields([]),(request,response)=>{

  let user={
    phoneNumber:"",
    password:""
  };  
  user.phoneNumber=request.body.phoneNumber;
  user.password=request.body.password;

  
  fetch('http://localhost:8080/api/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
    contentType: "application/json; charset=utf-8"
    //headers: { 'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzMxNzAyMzIsInVzZXJuYW1lIjoic2VuYSJ9.VLh3mw0k7nHWx8zJ-8-xSKr_MT1H7A1a9ettgjfp-FU' }
  }).then(res => res.json())
  .then(json =>{
    if(json.error){
       eror.masage=json.message;
      response.redirect('/login');

    }
    else {
      response.cookie("access_token",json.access_token);
      response.redirect('/');
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;
