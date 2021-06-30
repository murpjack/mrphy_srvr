// require('dotenv').config();
const express = require('express');
const request = require('superagent');

const Future = require ('fluture');
const { fork, map } = Future;

const { CLIENT_ID, CLIENT_SECRET, SUCCESS_URI } = process.env;

const PORT = process.env.port || 4001;
const app = express();


app.use("/success*", function (req, _, next) {
  if(req.query.code) {
    // TODO: getToken to future
    // const tokenEndpoint = `https://api.coinbase.com/oauth/token`;
    const tokenEndpoint = 'https://jsonplaceholder.typicode.com/posts';

    Future.encaseP(() => request.get(tokenEndpoint)
      .set("Access-Control-Allow-Origin", "*")
      .set("CB-Version", "2019-12-12")
      .send({ 
        grant_type: "authorization_code", 
        code: req.query.code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: SUCCESS_URI 
      })
    )()
      .pipe(map(response => {
        // TODO: Refactor response shape        
        if (response.ok && response.body) {
          console.log(response.body)
          return response.body;
        }
      }))
      // TODO: Should send message OR error message
      .pipe(fork (console.error) (val => val))

  } else {
    // TODO: Send a message to say no token > 
    // ?? Destroy Refresh token from storage?
    // OR do nothing
  }

  next();
});

app.use(express.static(`${__dirname}/static`, {
  extensions: ["html"]
}));

app.listen(PORT, () => console.log("Server listening on port", PORT));