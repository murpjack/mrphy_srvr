
const purifier = require("root-require")("./lib/routePurifier");
const axios = require( "axios" );
const Future = require("fluture");
const { map } = Future;

// Request that returns a Future
const requestF = Future.encaseP(axios);

module.exports = (credentials, database, successAddress) => req => {
    const code = req.query.code;
    const userId = req.ip;
    // const userId = req.get("X-USER-ID");
    // console.log("userId ", userId)
    
    return requestF({
            method: "POST",
            url: "https://api.coinbase.com/oauth/token",
            grant_type: "authorization_code",
            code,
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            redirect_uri: credentials.successUri    
        })
        // .pipe(map(r => {console.log(r); return r;}))    
        .pipe(map(res => {
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