const purifier = require("root-require")("./server/lib/routePurifier");
const Future = require("fluture");
const { traverse } = require("ramda");

const currencies = ["BTC", "BCH", "LTC", "ETH"];

const getRate = (coinbaseClient, baseCurrency, rateCurrency) =>
    Future((reject, resolve) => {
        coinbaseClient.getBuyPrice(
            { currencyPair: `${rateCurrency}-${baseCurrency}` },
            (err, obj) => (err ? reject(err) : resolve(obj))
        );
    });

module.exports = req =>
    traverse(
        Future.of,
        c => getRate(req.coinbaseClient, "GBP", c),
        currencies
    ).map(purifier.respond.json);
