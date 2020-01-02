const archive = require("./archive");
const config = require("./config");
const geospatial = require("./geospatial");
const wfs = require("./wfs");
const git = require("./git");
const http = require("./http");
const image = require("./image");
const io = require("./io");
const json = require("./json");
const log = require("./log");
const csv = require("./csv");
const url = require("./url");
const processes = require("./processes");
const sparql = require("./sparql");
const text = require("./text");

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
  log,
  processes,
  sparql,
  text,
  url
};
