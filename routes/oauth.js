const purifier = require('root-require')('./lib/routePurifier');
const Future = require('fluture');
const { map, chain, encaseP } = Future;
const fetch = require('node-fetch');

module.exports = (credentials, database, successAddress) => (req, res) => {
  const code = req.query.code;
  const userId = req.ip;

  const url = 'https://api.coinbase.com/oauth/token';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'CB-Version': '2019-12-12',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      redirect_uri: credentials.successUri,
    }),
  };

  return Future.encaseP(fetch)(url, options)
    .pipe(
      chain(
        encaseP((response) => {
          res.header('Content-Type', 'application/json');
          res.send({ options, status: response.status });
          return response.text();
        })
      )
    )
    .pipe(
      map((data) => {
        database[userId] = {
          accessToken: data.access_token || '123',
          refresh_token: data.refresh_token || '456',
        };
        return data;
      })
    )
    .pipe(map((_) => purifier.respond.redirect({ path: successAddress })));
};
