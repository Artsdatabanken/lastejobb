const archive = require("./archive");
const config = require("./config");
const csv = require("./csv");
const geospatial = require("./geospatial");
const git = require("./git");
const http = require("./http");
const image = require("./image");
const io = require("./io");
const json = require("./json");
const lastejobb = require("./lastejobb");
const log = require("./log");
const processes = require("./processes");
const sparql = require("./sparql");
const text = require("./text");
const url = require("./url");
const wfs = require("./wfs");

module.exports = {
  archive,
  config,
  csv,
  geospatial,
  wfs,
  git,
  http,
  image,
  io,
  json,
  lastejobb,
  log,
  processes,
  sparql,
  text,
  url
};
