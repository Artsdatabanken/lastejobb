const http = require("./http");
const log = require("./log");
const fs = require("fs");
const io = require("./io");
const path = require("path");

/**
 * Mirror a remote WFS server
 * Downloads batches of 500 features per request.
 */
async function mirror(url, jsonlFilePath, options = { batchSize: 9000, offset: 0, httpheaders: {} }) {
  jsonlFilePath += "." + options.offset
  io.mkdir(path.dirname(jsonlFilePath));
  if (fs.existsSync(jsonlFilePath))
    fs.unlinkSync(jsonlFilePath)
  log.info("Mirroring WFS " + url + " to " + jsonlFilePath);
  let resultRecordCount = options.batchSize || 1000;
  let resultOffset = options.offset || 0;
  let featureCount = 0;
  fs.writeFileSync(jsonlFilePath, "");
  while (true) {
    const part = await downloadPart(url, resultOffset, resultRecordCount, options.httpheaders);
    const geojson = JSON.parse(part);
    const features = geojson.features;
    const lines = features.map(f => JSON.stringify(f)).join("\n") + "\n";
    if (features.length <= 0) break;
    featureCount += features.length;
    fs.appendFileSync(jsonlFilePath, lines);
    resultOffset += resultRecordCount;
  }
  log.info("Read " + featureCount + " features from " + url);
  return featureCount;
}

async function downloadPart(url, resultOffset, resultRecordCount, headers) {
  url = url.replace('${resultRecordCount}', resultRecordCount)
  url = url.replace('${resultOffset}', resultOffset)
  log.info(url);
  const buffer = await http.downloadBinary(url, null, headers);
  return await buffer.toString();
}

module.exports = {
  mirror
};
