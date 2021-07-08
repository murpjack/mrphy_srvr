
const purifier = require("root-require")("./server/lib/routePurifier");
const request = require("request");
const Future = require("fluture");

// Request that returns a Future
const postRequest = (url, options) =>
    Future((reject, resolve) => {
        request.post(
            url,
            options,
            (err, res) => (err ? reject(err) : resolve(res))
        );
    });

module.exports = (credentials, database, successAddress) => req => {
    const code = req.query.code;
    const userID = req.ip;

    return postRequest("https://api.coinbase.com/oauth/token", {
        json: {
            grant_type: "authorization_code",
            code,
            client_id: credentials.clientID,
            client_secret: credentials.clientSecret,
            redirect_uri: "http://murphyme.co.uk/success.html"
        }
    })
        .map(res => {
            database[userID] = {
                accessToken: res.body.access_token,
                refresh_token: res.body.refresh_token
            };
            return res;
        })
        .map(_ => purifier.respond.redirect({ path: successAddress }));
};