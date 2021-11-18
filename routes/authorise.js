module.exports = (credentials) => (_, res) => {
  const url =
    `https://www.coinbase.com/oauth/authorize` +
    `?client_id=${credentials.clientId}` +
    `&redirect_uri=${encodeURIComponent(credentials.oauthUri)}` +
    '&response_type=code' +
    '&scope=wallet:accounts:read' +
    '&account=all';

  return res.redirect(url);
};
