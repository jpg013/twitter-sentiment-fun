const express                 = require('express');
const twitterScreenNameQuery  = require("../queries/twitterScreenNames");
const neo4j                   = require('neo4j');
const requireNeo4jCredentials = require('../common/makeCSV');

// ======================================================
// Controller
// ======================================================
const alumniController = express.Router();

// ======================================================
// Response Handler
// ======================================================
function errorResponseHandler(error, res) {
  if (!res) return;
  switch(error) {
    case 'missing required data':
      return res.status(400).send({error});
    case 'Invalid Neo4j cypher syntax':
    case 'Invalid report data':
    case 'There was an error saving the report':
      return res.status(200).send({error});
    default:
      return res.status(500).send({error});
  }
}

function responseHandler(req, res) {
  const { error, results} = req;
  if (error) {
    return errorResponseHandler(error, res);
  }
  return res.status(200).send({results});
}

const getScreenNamesForAlumni = (req, res, next) => {
  const creds = req.neo4jCredentials;
  const db = new neo4j.GraphDatabase({
    url: creds.connection,
    auth: creds.auth,
    headers: {},    // optional defaults, e.g. User-Agent
    proxy: null,    // optional URL
    agent: null,    // optional http.Agent instance, for custom socket pooling
  });

  db.cypher({query: twitterScreenNameQuery}, cb);
}

// ======================================================
// Wire up controller methods
// ======================================================
alumniController.get('/twitter/screennames', requireNeo4jCredentials, getScreenNamesForAlumni, responseHandler);

module.exports = alumniController;
