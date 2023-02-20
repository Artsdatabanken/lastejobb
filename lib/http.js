const log = require("./log");
const config = require("./config");
const io = require("./io");
const axios = require("axios");


const useAxios = async (url, headers = {}, returntype_buffer = false) => {
  const userAgent =
    "Artsdatabank-bot/1.0 (https://github.com/Artsdatabanken/lastejobb; postmottak@artsdatabanken.no) node-fetch/2.6";
  headers = {
    "user-agent": userAgent, ...headers
  };
  url = encodeURI(url);
  let response = {};
  if (returntype_buffer){
    response = await axios.get(url, 
      {responseType: 'arraybuffer'});
  }else{
    response = await axios.get(url);
  }
  
  await validateResponse(response);
  return response;
};

async function downloadJson(url, targetFile, headers = {}) {
  log.info("Download " + url);
  headers = { Accept: "application/json", ...headers };
  const response = await useAxios(url, headers);
  const srcJson = response.data;
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
  const response = await useAxios(url, headers, true);
  //const buffer = await response.buffer();
  const buffer = response.data;
  if (!targetFile) return buffer;
  const targetPath = config.getTempPath(targetFile);
  io.writeBinary(targetPath, buffer);
  //io.skrivDatafil(targetPath, buffer);
  return buffer;
}

async function validateResponse(response) {
  if (response.status === 200) return;
  log.debug("HTTP status " + response.status);
  const httpText = response.status + " " + response.statusText;
  const body = response.data;
    log.error(body);
    throw new Error(httpText);
}

module.exports = {
  downloadJson,
  downloadBinary
};