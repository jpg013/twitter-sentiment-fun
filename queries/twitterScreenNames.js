module.exports = `MATCH (n:Alumni) WHERE n.screen_name IS NOT NULL RETURN n.name as name, n.id as id, n.screen_name as twitterID`;
