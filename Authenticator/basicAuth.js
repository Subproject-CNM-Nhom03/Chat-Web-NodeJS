const { getAppCookies } = require('./cookie')
const fetch = require("cross-fetch");

function authUser(req, res, next) {
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
      return res.redirect('/login');

    }
    else {
      next()
    }
  })
  .catch(err => console.log(err));

}
  
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401)
        return res.send('Not allowed')
   }
    next()
  }
}
  
module.exports = {
  authUser,
  authRole
}