const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const log = require("log-less-fancy")();
const config = require("./config");
const io = require("./io");

function fetchJson(url) {
  const data = fetch(url);
  return JSON.parse(data);
}

async function downloadJson(url, targetFile) {
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
  const targetPath = config.getDataPath(targetFile);
  io.skrivDatafil(targetPath, json);
  return json;
}

async function downloadBinary(url, targetFile) {
  log.info("Download binary " + url);
  const response = await fetch(url).then();
  const buffer = await response.buffer();
  const targetPath = config.getDataPath(targetFile);
  io.writeBinary(targetPath, buffer);
  return buffer;
}

module.exports = {
  fetchJson,
  downloadJson,
  downloadBinary
};
