const purifier = require("root-require")("./lib/routePurifier");
const Future = require("fluture");
const { map } = Future;

module.exports = req =>
    Future((reject, resolve) => {
        req.coinbaseClient.getAccounts(
            {},
            (err, accounts) => (err ? reject(err) : resolve(accounts))
        );
    }).pipe(map(purifier.respond.json));