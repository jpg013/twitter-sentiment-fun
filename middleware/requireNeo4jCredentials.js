const crypto = require('../common/crypto');

const requireNeo4jCredentials = (req, res, next) => {
  const { auth, connection } = req.body || req.params;
  
  if (!auth || !connection) {
    return res.status(400).send({error: 'Invalid neo4j credentials'});
  }
  
  const creds = (process.env.ENV_NAME === 'PRODUCTION') ?
    decryptCreds({connection, auth}) :
    makeDevCredentials();
  
  req.neo4jCredentials = creds;
  next();
}

const makeDevCredentials = () => {
  return {
    connection: process.env.DEVELOPMENT_NEO4J_CONNECTION,
    auth: process.env.DEVELOPMENT_NEO4J_AUTH
  }
}

const decryptCreds = (creds={}) => {
  return {
    connection: crypto.decrypt(creds.connection),
    auth: crypto.decrypt(creds.auth)
  }
}

module.exports = requireNeo4jCredentials;
