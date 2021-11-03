module.exports = (credentials) => (_, res) => {
  const url =
    `https://www.coinbase.com/oauth/authorize` +
    `?client_id=${credentials.clientId}` +
    `&redirect_uri=${encodeURIComponent(credentials.oauthUri)}` +
    '&response_type=code' +
    '&scope=wallet%3Aaccounts%3Aread' +
    '&account=all';

  return res.redirect(url);
};
