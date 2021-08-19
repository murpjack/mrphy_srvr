require("dotenv").config({ path: "./.env" });

const Client = require("coinbase").Client;
const credentials = require("root-require")("./credentials");
const purifier = require("root-require")("./lib/routePurifier");
const express = require("express");
const routes = require("require-dir-all")("./routes", {
  recursive: true,
});

const PORT = process.env.port || 4001;
const app = express();

/** Express server/web best practices. */
const helmet = require("helmet");
app.use(helmet());

// For now we are using an in-memory database to simplify things
const database = {};

// Make sure user is logged before calling a route
const isLoggedIn = (req, res, next) => {
  const userId = req.ip;
  // const userId = req.get("X-USER-ID");
  const userInfo = database[userId];

  if (!userInfo) {
    return res.status(401).send("Unauthorised: User not logged in");
  }

  const { accessToken, refreshToken } = userInfo;
  req.coinbaseClient = new Client({ accessToken, refreshToken });
  return next();
};

app.use(
  express.static(`${__dirname}/static`, {
    extensions: ["html"],
  })
);

// OAuth route
app.get(
  "/oauth",
  // purifier.route(routes.oauth(credentials, database, "/success"))
);

// Coinbase requests
app.get("/accounts", isLoggedIn, purifier.route(routes.accounts));
app.get("/rates", isLoggedIn, purifier.route(routes.rates));

app.listen(PORT, () => console.log("Server listening on port", PORT));
