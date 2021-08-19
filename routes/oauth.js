const purifier = require("root-require")("./lib/routePurifier");
const Future = require("fluture");
const { map, chain, encaseP } = Future;
const fetch = require("node-fetch");

module.exports = (credentials, database, successAddress) => (req, res) => {
  const code = req.query.code;
  const userId = req.ip;

  const url =
    "https://api.coinbase.com/oauth/token" +
    `?grant_type=authorization_code` +
    `&code=${code}` +
    `&client_id=${credentials.clientId}` +
    `&client_secret=${credentials.clientSecret}` +
    `&redirect_uri=${credentials.successUri}`;

  //   const body = {
  //     grant_type: `authorization_code`,
  //     code: code,
  //     client_id: credentials.clientId,
  //     client_secret: credentials.clientSecret,
  //     redirect_uri: credentials.successUri,
  //   };

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "CB-Version": "2019-12-12",
    },
    // body: JSON.stringify(body),
  };

  //   return Future.encaseP(fetch)("https://api.github.com", {})
  return Future.encaseP(fetch)(url, options)
    .pipe(chain(encaseP((res) => res.json())))
    .pipe(
      map((body) => {
        database[userId] = {
          accessToken: body.access_token || "123",
          refresh_token: body.refresh_token || "456",
        };
        return body;
      })
    )
    .pipe(map((_) => purifier.respond.redirect({ path: successAddress })));
};
