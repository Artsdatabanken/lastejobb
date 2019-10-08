const fs = require("fs");
const http = require("./http");

// Bruk query-verktøy på https://query.wikidata.org/

const endpointUrl = "https://query.wikidata.org/sparql";

async function query(sparqlQuery, destFile) {
  const fullUrl = endpointUrl + "?query=" + sparqlQuery;
  return await http.downloadJson(fullUrl, destFile);
}

function queryFromFile(sparqlFilePath, destFile) {
  const queryText = fs.readFileSync(sparqlFilePath);
  return query(queryText, destFile);
}

module.exports = { query, queryFromFile };
