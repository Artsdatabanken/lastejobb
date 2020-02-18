var DecompressZip = require("decompress-zip");
const config = require("./config");
const log = require("log-less-fancy")();

/**
 * Unzips .zip archive to temp path.
 */
function unzip(filename) {
  const filePath = config.getTempPath(filename);

  var unzipper = new DecompressZip(filePath);
  unzipper.on("error", function(err) {
    log.fatal(err);
    process.exit(1);
  });

  unzipper.on("extract", function(json) {
    log.debug("Extracted " + json.map(e => Object.values(e)[0]).join(", "));
  });

  unzipper.extract({
    path: config.getTempPath(),
    restrict: false,
    strip: 1, // Ikke lag første katalognivå (zipfilnavnet)
    filter: function(file) {
      return file.type !== "SymbolicLink";
    }
  });
}

module.exports = { unzip };
