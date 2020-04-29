const fs = require("fs-extra");
const path = require("path");
const log = require("log-less-fancy")();
const GenerateSchema = require("generate-schema");

const config = require("./config");
const git = require("./git");
const json = require("./json");
const jsonschema = require("./jsonschema");

capitalizeTittel = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

function getLength(o) {
  if (o.features) return o.features.length;
  if (o.items) return o.items.length || Object.keys(o.items).length;
  if (o.length) return o.length;
  return Object.keys(o).length;
}


const sourceFileMetas = []
/**
 * Read JSON from temp directory.
 */
function lesTempJson(filename, extension, defaultJson) {
  const jsonPath = config.getTempPath(filename, extension);
  const content = readJson(jsonPath, defaultJson)
  sourceFileMetas.push({ name: filename, ...(content.meta || {}) })
  return content.items ? content.items : content;
}

/**
 * Read JSON from build directory.
 */
function lesBuildfil(filename, extension, defaultJson) {
  const jsonPath = config.getBuildPath(filename, extension);
  return readJson(jsonPath, defaultJson);
}

/**
 * Write JSON to temp directory.
 */
function skrivDatafil(filename, o) {
  const jsonPath = config.getTempPath(filename);
  return writeJson(jsonPath, o);
}

function skrivBuildfil(filename, o, delimiter = "  ") {
  const jsonPath = config.getBuildPath(filename);
  o = convertObjectToArray(o);
  const dokument = writeJson(jsonPath, o, delimiter);

  // Lag schema json for build outputs
  const schema = GenerateSchema.json(dokument);
  writeJson(jsonPath.replace(".json", "") + ".schema.json", schema, delimiter);
  return dokument;
}

function convertObjectToArray(o) {
  if (o.features) return o; // Don't mess with a GeoJSON
  if (!o.items) o = { items: o };
  if (!Array.isArray(o.items))
    // Skriv alltid arrays (da fungerer schema osv)
    // med mindre output er GeoJSON
    o.items = json.objectToArray(o.items, "kode");

  o.items = o.items.sort((a, b) => (a.kode > b.kode ? 1 : -1));
  return o;
}

function skrivLoggLinje(aksjon, filePath, json) {
  let produsertUtc = null;
  if (json.meta && json.meta.produsertUtc)
    produsertUtc = new Date(json.meta.produsertUtc);
  else produsertUtc = new Date(fs.statSync(filePath).ctime);
  const now = new Date();
  const timerGammel =
    Math.round((10 * (now - produsertUtc)) / 1000 / 60 / 60) / 10;

  if (json.data) json = json.data;
  log.info(
    "Lest " +
    getLength(json) +
    " elementer fra " +
    timerGammel +
    " timer gammel fil."
  );
}

function readRaw(filePath) {
  let data = fs.readFileSync(filePath, "utf8");
  //  data = data.replace(/^\uFEFF/, '') // node #fail https://github.com/nodejs/node/issues/6924
  if (data.charCodeAt(0) === 0xfeff) data = data.slice(1);
  return data;
}

// Read file, parse to JSON.  If file doesn't exists defaultJson will be returned
function readJson(filePath, defaultJson) {
  log.info("Åpner " + filePath);
  if (defaultJson && !fs.existsSync(filePath)) return defaultJson;
  let data = readRaw(filePath);
  let json = JSON.parse(data);
  skrivLoggLinje("Lest", filePath, json);
  return json;
}

/**
 * Read JSONLines format from file.
 * http://jsonlines.org/
 */
function lesJsonLines(filnavn) {
  const filePath = config.getTempPath(filnavn, "");
  log.info("Åpner " + filePath);
  let data = readRaw(filePath)
    .trim()
    .split("\n");
  let json = data.map(line => JSON.parse(line));
  skrivLoggLinje("Lest", filePath, json);
  return json;
}

/**
 * Read raw data from file.
 */
function lesDataRå(filnavn) {
  const filePath = config.getTempPath(filnavn, "");
  return readRaw(filePath);
}

/**
 * Write JSON to file.
 */
function writeJson(filePath, o, delimiter) {
  const parsedFn = path.parse(filePath);
  const basename = parsedFn.name;
  let dokument = o.items ? o : { items: o }
  const meta = Object.assign({}, dokument.meta, { source: sourceFileMetas })
  const pjson = config.getPackage();
  dokument.meta = {
    tittel: capitalizeTittel(basename.replace(/_/g, " ")),
    produsertUtc: new Date().toJSON(),
    utgiver: "Artsdatabanken",
    url: git.getUpstreamUrlForFile(filePath),
    tool: {
      name: pjson.name,
      url: pjson.homepage,
      commit: git.getGithubCommitUrl()
    },
    elementer: getLength(dokument)
  };
  if (meta) Object.assign(dokument.meta, meta);
  dokument.items = json.sortKeys(dokument.items);
  const schemaFilename = filePath.replace(parsedFn.ext, ".schema.json");
  if (fs.existsSync(schemaFilename))
    jsonschema.addSchemaLink(dokument, schemaFilename);
  const bytes = writeBinary(
    filePath,
    stringify(dokument, parsedFn.ext, delimiter)
  );
  log.info("Skrevet " + getLength(o) + " elementer, " + bytes + " bytes");
  return dokument;
}

function stringify(o, extension, delimiter) {
  if (extension === ".geojson") return json.stringifyGeojsonCompact(o);
  return JSON.stringify(o, null, delimiter);
}

/**
 * Write binary data to file.
 */
function writeBinary(filePath, o) {
  if (!filePath) throw new Error("Filename is required");
  if (!o) throw new Error("No data provided");
  log.info("Writing " + filePath);
  const dir = path.dirname(filePath);
  mkdir(dir);
  fs.writeFileSync(filePath, o, "utf8");
  return o.length;
}

/**
 * Create a directory if it does not already exist.
 */
function mkdir(path) {
  fs.ensureDirSync(path);
}

/**
 * Check if a file exists.
 */
function fileExists(path) {
  return fs.existsSync(path);
}

/**
 * Check if a directory exists.
 */
function directoryExists(path) {
  return fs.pathExistsSync(path);
}

/**
 * Recursive find files in startPath satisfying filter
 */
function findFiles(startPath, filter) {
  let r = [];
  var files = fs.readdirSync(startPath);
  for (var file of files) {
    var filename = path.join(startPath, file);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      r = r.concat(findFiles(filename, filter));
    } else if (filter && filter !== path.parse(filename).ext) {
    } else r.push(filename);
  }
  return r;
}

module.exports = {
  lesDataRå,
  lesTempJson,
  readJson,
  lesJsonLines,
  writeBinary,
  writeJson,
  skrivDatafil,
  skrivBuildfil,
  findFiles,
  fileExists,
  directoryExists,
  mkdir
};
