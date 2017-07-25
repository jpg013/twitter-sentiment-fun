const json2csv = require('json2csv');

const makeCSV = (data=[], fields=[]) => {
  return json2csv({ data, fields });
}
  
module.exports = makeCSV;
