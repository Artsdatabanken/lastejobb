const log = require("./log");
const config = require("./config");
const io = require("./io");

const fetchWithRedirect = async (url, headers = {}) => {
  const userAgent =
    "Artsdatabank-bot/1.0 (https://github.com/Artsdatabanken/lastejobb; postmottak@artsdatabanken.no) node-fetch/2.6";
  headers = {
      redirect: "follow",
      "user-agent": userAgent, 
      ...headers
  };
  url = encodeURI(url);
  const response = await fetch(url, {headers});
  await validateResponse(response);
  return response;
};

async function downloadJson(url, targetFile, headers = {}) {
  log.info("Download " + url);
  headers = { Accept: "application/json", ...headers };
  const response = await fetchWithRedirect(url, headers);
  const srcJson = await response.json();
  const out = {
    items: srcJson,
    meta: {
      produsertUtc: new Date().toJSON(),
      tool: process.argv[2],
      url: url
    }
  }
  io.skrivDatafil(targetFile, out);
}

async function downloadBinary(url, targetFile, headers = {}) {
  log.info("Download binary " + url);
  const response = await fetchWithRedirect(url, headers);
  const buffer =  Buffer(await (await response.blob()).arrayBuffer());
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
  log.warn(body)
  throw new Error(httpText);
}

module.exports = {
  downloadJson,
  downloadBinary
};