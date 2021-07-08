const purifier = require("root-require")("./server/lib/routePurifier");
const Future = require("fluture");

module.exports = req =>
    Future((reject, resolve) => {
        req.coinbaseClient.getAccounts(
            {},
            (err, accounts) => (err ? reject(err) : resolve(accounts))
        );
    }).map(purifier.respond.json);