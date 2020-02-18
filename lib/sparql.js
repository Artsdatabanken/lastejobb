const fs = require("fs");
const http = require("./http");
const xml2js = require("xml2js");
const io = require("./io");

// Bruk query-verktøy på https://query.wikidata.org/

const endpointUrl = "https://query.wikidata.org/sparql";

/**
 * Execute a SPARQL query and write result as JSON.
 */
async function query(sparqlQuery, destFile) {
  const fullUrl = endpointUrl + "?query=" + sparqlQuery;
  // APIet kan levere JSON, men feiler på større responser. Derfor midlertidig omvei.
  const downloadXml = false;
  if (downloadXml) {
    const tempXmlFilePath = destFile + ".xml";
    await http.downloadBinary(fullUrl, tempXmlFilePath);
    var xml = io.lesDataRå(tempXmlFilePath);
    xml2js.parseString(xml, function(err, result) {
      io.skrivDatafil(destFile, result);
    });
  } else {
    http.downloadJson(fullUrl, destFile);
  }
}

/**
 * Execute a SPARQL query stored in a file and write result as JSON.
 */
function queryFromFile(sparqlFilePath, destFile) {
  const queryText = fs.readFileSync(sparqlFilePath);
  return query(queryText, destFile);
}

module.exports = { query, queryFromFile };
