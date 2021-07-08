const Client = require("coinbase").Client;
const credentials = require("root-require")("./credentials.json");
const purifier = require("root-require")("./server/lib/routePurifier");
const express = require("express");
const routes = require("require-dir-all")("./routes", {
  recursive: true
});


// const { CLIENT_ID, CLIENT_SECRET, SUCCESS_URI } = process.env;

const PORT = process.env.port || 4001;
const app = express();

// For now we are using an in-memory database to simplify things
const database = {};

// Make sure user is logged before calling a route
const isLoggedIn = (req, res, next) => {
  const userID = req.ip;
  // const userID = req.get("X-USER-ID");
  const userInfo = database[userID];

  if (!userInfo) {
    return res.status(401).send("Unauthorised: User not logged in");
  }

  const { accessToken, refreshToken } = userInfo;
  req.coinbaseClient = new Client({ accessToken, refreshToken });
  return next();
};

app.use(express.static(`${__dirname}/static`, {
    extensions: ["html"]
  }));

// OAuth route
app.get(
  "/oauth",
  purifier.route(routes.oauth(credentials, database, "/success.html"))
);

// Coinbase requests
app.get("/accounts", isLoggedIn, purifier.route(routes.accounts));
app.get("/rates", isLoggedIn, purifier.route(routes.rates));


// app.use("/success*", function (req, _, next) {
//   if(req.query.code) {

//   } else {
//     // TODO: Send a message to say no token > 
//     // ?? Destroy Refresh token from storage?
//     // OR do nothing
//   }

//   next();
// });

app.listen(PORT, () => console.log("Server listening on port", PORT));