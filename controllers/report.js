const express                 = require('express');
const neo4j                   = require('neo4j');
const requireNeo4jCredentials = require('../middleware/requireNeo4jCredentials');
const makeCSV                 = require('../common/makeCSV');

// ======================================================
// Controller
// ======================================================
const reportController = express.Router();

// ======================================================
// Error Response Handler
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
  const { error, results } = req;
  if (error) {
    return errorResponseHandler(error, res);
  }
  return res.status(200).send({results});
}

function getReport(req, res, next) {
  const { query } = req.params;
  const {connection, auth } = req.neo4jCredentials;
    
  const db = new neo4j.GraphDatabase({
    url: connection,
    auth: auth,
    headers: {},    // optional defaults, e.g. User-Agent
    proxy: null,    // optional URL
    agent: null,    // optional http.Agent instance, for custom socket pooling
  });
  
  db.cypher({query}, function(err, results=[]) {
    if (err) {
      req.error = parseNeo4jError(err);
    }
    if (results && results.length) {
      const fields = Object.keys(results[0]);
      const data = results.slice(1);
      req.results = makeCSV(data, fields);
    }
    next();
  });
}


// ======================================================
// Wire up controller methods
// ======================================================
reportController.get('/', requireNeo4jCredentials, getReport, responseHandler);

module.exports = reportController;
