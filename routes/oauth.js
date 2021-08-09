
const purifier = require("root-require")("./lib/routePurifier");
const axios = require( "axios" );
const Future = require("fluture");
const { map } = Future;

// Request that returns a Future
const postF = Future.encaseP(axios.post);



module.exports = (credentials, database, successAddress) => req => {
    const code = req.query.code;
    const userId = req.ip;
    // const userId = req.get("X-USER-ID");
    // console.log("userId ", userId)
    const url =
    `https://api.coinbase.com/oauth/token` +
    `?grant_type=authorization_code` +
    `&code=${code}` +
    `&client_id=${credentials.clientId}` +
    `&client_secret=${credentials.clientSecret}` +
    `&redirect_uri=${credentials.successUri}`;
     
    const options = {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "CB-Version": "2019-12-12"
    }
    };
    
    return postF(url, options)
    // .pipe(map(r => {console.log(r); return r;}))    
    .pipe(map(res => {
            console.log(1, url, 2, options); 
            database[userId] = {
                accessToken: res.body.access_token,
                refresh_token: res.body.refresh_token
            };
            console.log("body: ", res.body);
            console.log("DB: ", database);
            return res;
        }))
        .pipe(map(_ => purifier.respond.redirect({ path: successAddress })));
    // res.redirect(successAddress)
};