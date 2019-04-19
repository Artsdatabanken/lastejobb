const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const log = require("log-less-fancy")();
const io = require("./io");

function fetchJson(url) {
  const data = fetch(url);
  return JSON.parse(data);
}

async function downloadJson2File(url, targetFile) {
  log.info("Download " + url);
  const headers = { Accept: "application/json" };
  const response = await fetch(url, { headers });
  let text = "";
  if (response.status !== 200) {
    log.debug("HTTP status " + response.status);
    const httpText = response.status + " " + response.statusText;
    log.error(httpText);
    const body = await response.text();
    log.error(body);
    throw new Error(httpText);
  }
  const json = await response.json();
  io.skrivDatafil(targetFile, json);
  return json;
}

async function downloadBinary2File(url, targetFile) {
  log.info("Download binary " + url);
  const response = await fetch(url).then();
  const buffer = await response.buffer();
  io.writeBinary(targetFile, buffer);
  return buffer;
}

async function getJsonFromCache(url, targetFile) {
  const inCache = fs.existsSync(targetFile);
  if (!inCache) await downloadJson2File(url, targetFile);
  return io.readJson(targetFile);
}

async function getBinaryFromCache(url, targetFile) {
  const inCache = fs.existsSync(targetFile);
  if (!inCache) await downloadBinary2File(url, targetFile);
  return io.readBinary2(targetFile);
}

module.exports = {
  fetchJson,
  downloadJson2File,
  downloadBinary2File,
  getJsonFromCache,
  getBinaryFromCache
};
