function getAppCookies(req){

    let stringCookie;
    if (typeof req.headers.cookie == "undefined"){
        stringCookie=";"
    }
    else stringCookie=req.headers.cookie;
    const rawCookies = stringCookie.split('; ');
    //console.log(req.headers.cookie);
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
    const parsedCookies = {};
    rawCookies.forEach(rawCookie=>{
    const parsedCookie = rawCookie.split('=');
    // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
     parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    
    return parsedCookies;

}
  
module.exports = {
    getAppCookies
}