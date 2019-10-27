const fetch = require("node-fetch");

const log = require("log-less-fancy")();
const config = require("./config");
const io = require("./io");

function fetchJson(url) {
  url = encodeURI(url);
  const data = fetch(url);
  return JSON.parse(data);
}

async function downloadJson(url, targetFile) {
  url = encodeURI(url);
  log.info("Download " + url);
  const headers = { Accept: "application/json" };
  const response = await fetch(url, { headers });
  await validateResponse(response);
  const json = await response.json();
  io.skrivDatafil(targetFile, json);
  return json;
}

async function downloadBinary(url, targetFile) {
  url = encodeURI(url);
  log.info("Download binary " + url);
  const response = await fetch(url);
  await validateResponse(response);
  const buffer = await response.buffer();
  const targetPath = config.getDataPath(targetFile);
  io.writeBinary(targetPath, buffer);
  return buffer;
}

async function validateResponse(response) {
  if (response.status === 200) return;
  log.debug("HTTP status " + response.status);
  const httpText = response.status + " " + response.statusText;
  const body = await response.text();
  log.error(body);
  throw new Error(httpText);
}

module.exports = {
  fetchJson,
  downloadJson,
  downloadBinary
};
