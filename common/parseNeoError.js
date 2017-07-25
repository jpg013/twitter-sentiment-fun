function parseNeo4jError(err) {
  if (!err || !err.neo4j) {
    return;
  }
  switch(err.neo4j.code) {
    case 'Neo.ClientError.Statement.SyntaxError':
      return 'Invalid Neo4j cypher syntax';
    default:
      return 'There was an error querying Neo4j';
  }
}
  
module.exports = parseNeo4jError;
