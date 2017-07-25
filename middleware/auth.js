const crypto = require('../common/crypto');

const getRequestBearerToken = headers => {
  return headers['authorization'];
}

function auth(req, res, next) {
  const token = getRequestBearerToken(req.headers);
  if (!token) {
    return res.status(401);
  }
  if (crypto.decrypt(token) !== process.env.IDRA_SECRET) {
    return res.status(401);
  }
  return next();
}

module.exports = auth;
