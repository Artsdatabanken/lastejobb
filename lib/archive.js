var DecompressZip = require("decompress-zip");
const config = require("./config");
const log = require("./log");


/**
 * Unpacks a .tar or tar.gz archive to temp path
 */
async function untar(tarFileName) {
  const isGzipped = path.extname(tarFileName) === '.gz'
  await processes.exec('tar', [
      '-xvf' + (isGzipped ? 'z' : ''), config.getTempPath(tarFileName),
      '--strip=1',
      '--one-top-level',
      '-C ' + config.getTempPath(),
  ]);
}

async function downloadAndUntar(url) {
  const tarFileName = path.basename(new URL(url).pathname);
  await http.downloadBinary(url, tarFileName);
  untar(tarFileName)
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
