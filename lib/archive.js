var DecompressZip = require("decompress-zip");
const log = require("./log");
const config = require("./config");
const http = require("./http");
const processes = require("./processes");
const path = require("path");

/**
 * Unpacks a .tar or tar.gz archive to temp path
 */
async function untar(tarFileName) {
  const isGzipped = '.gz.tgz'.indexOf(path.extname(tarFileName))>=0; 
  await processes.exec('tar', [
    `-x${isGzipped ? 'z' : ''}vf ${config.getTempPath(tarFileName)}`,
    '--one-top-level',
    '-C ' + config.getTempPath(),
  ]);
}

async function downloadAndUntar(url) {
  const tarFileName = path.basename(new URL(url).pathname);
  await http.downloadBinary(url, tarFileName);
  await untar(tarFileName)
}

/**
 * Unzips .zip archive to temp path.
 */
function unzip(filename) {
  const filePath = config.getTempPath(filename);

  var unzipper = new DecompressZip(filePath);
  unzipper.on("error", function (err) {
    log.fatal(err);
    process.exit(1);
  });

  unzipper.on("extract", function (json) {
    log.debug("Extracted " + json.map(e => Object.values(e)[0]).join(", "));
  });

  unzipper.extract({
    path: config.getTempPath(),
    restrict: false,
    strip: 1, // Ikke lag første katalognivå (zipfilnavnet)
    filter: function (file) {
      return file.type !== "SymbolicLink";
    }
  });
}

module.exports = { untar, downloadAndUntar, unzip };
