const nodefetch = require("node-fetch");

const log = require("log-less-fancy")();
const config = require("./config");
const io = require("./io");

const fetch = async (url, headers = {}) => {
  const userAgent =
    "Artsdatabank-bot/1.0 (https://github.com/Artsdatabanken/lastejobb; postmottak@artsdatabanken.no) node-fetch/2.6";
  headers = { "user-agent": userAgent, ...headers };
  url = encodeURI(url);
  const response = await nodefetch(url, { headers });
  await validateResponse(response);
  return response;
};

async function downloadJson(url, targetFile) {
  log.info("Download " + url);
  const headers = { Accept: "application/json" };
  const response = await fetch(url, headers);
  const json = await response.json();
  io.skrivDatafil(targetFile, json);
  return json;
}

async function downloadBinary(url, targetFile) {
  log.info("Download binary " + url);
  url = "https://data.test.artsdatabanken.no/";
  const response = await fetch(url);
  const buffer = await response.buffer();
  if (!targetFile) return buffer;
  const targetPath = config.getTempPath(targetFile);
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
  downloadJson,
  downloadBinary
};
