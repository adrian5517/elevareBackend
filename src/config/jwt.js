module.exports = {
  secret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  expire: process.env.JWT_EXPIRE || '30d',
  cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 30
};
