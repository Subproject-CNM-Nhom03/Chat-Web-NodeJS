var express = require('express');
var router = express.Router();
const { authUser, authRole } = require('../Authenticator/basicAuth')
const { getAppCookies } = require('../Authenticator/cookie')

const fetch = require("cross-fetch");



/* GET users listing. */
router.get('/',authUser,function(req, res) {
  const user={
    "userID":"",
    "userName":"",
    "avatarURL":""
  }
  const token={
    "access_token":getAppCookies(req).access_token
  }
  fetch('http://localhost:8080/api/userfromtoken', {
    method: 'POST',
    body: JSON.stringify(token),
    headers: { 'Content-Type': 'application/json' },
    contentType: "application/json; charset=utf-8"
  }).then(res => res.json())
  .then(json =>{
    if(json.error){
      console.log(json.error);
      res.redirect('/login');

    }
    else {
      user.userID=json.userId;
      user.userName=json.userName;
      user.avatarURL=json.avatar;
      res.render('home',{user:user,roomID:"xx"});
    }
  })
  .catch(err => console.log(err));
});


module.exports = router;
