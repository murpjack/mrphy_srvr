const permissions = [
  'wallet:accounts:read',
  'wallet:accounts:update',
  'wallet:accounts:create',
  'wallet:accounts:delete',
  'wallet:addresses:read',
  'wallet:addresses:create',
  'wallet:buys:read',
  'wallet:buys:create',
  'wallet:deposits:read',
  'wallet:deposits:create',
  'wallet:notifications:read',
  'wallet:payment-methods:read',
  'wallet:payment-methods:delete',
  'wallet:payment-methods:limits',
  'wallet:sells:read',
  'wallet:sells:create',
  'wallet:transactions:read',
  'wallet:transactions:send',
  'wallet:transactions:request',
  'wallet:transactions:transfer',
  'wallet:user:read',
  'wallet:user:update',
  'wallet:user:email',
  'wallet:withdrawals:read',
  'wallet:withdrawals:create',
];

module.exports = (credentials) => (_, res) => {
  const url =
    `https://www.coinbase.com/oauth/authorize` +
    `?client_id=${credentials.clientId}` +
    `&redirect_uri=${encodeURIComponent(credentials.oauthUri)}` +
    '&response_type=code' +
    '&scope=' +
    permissions.join() +
    '&account=all';

  return res.redirect(url);
};
