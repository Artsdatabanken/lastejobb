const http = require("./http");
const log = require("./log");
const fs = require("fs");
const io = require('./io')
const path = require('path')

async function mirror(url, jsonlFilePath) {
  io.mkdir(path.dirname(jsonlFilePath))
  log.info("Mirroring WFS " + url + " to " + jsonlFilePath);
  let resultRecordCount = 500;
  let resultOffset = 0;
  let featureCount = 0;
  fs.writeFileSync(jsonlFilePath, "");
  while (true) {
    const part = await downloadPart(url, resultOffset, resultRecordCount);
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

async function downloadPart(url, resultOffset, resultRecordCount) {
  const args = `&resultRecordCount=${resultRecordCount}&resultOffset=${resultOffset}`;
  const fullUrl = url + args;
  log.info(fullUrl);
  const buffer = await http.downloadBinary(fullUrl);
  return await buffer.toString();
}

module.exports = {
  mirror
};
