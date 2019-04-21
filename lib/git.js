var gitconfig = require("./gitconfiglocalSync");
const log = require("log-less-fancy")();
const path = require("path");

function upstreamUrl(localPath) {
  const config = gitconfig(localPath);
  if (!config) return log.warn("No git config in " + localPath);
  const remote = config.remote.upstream || config.remote.origin;
  const url = remote.url;
  return url;
}

// Calculate what the upstream git url for a local file would be
// The file need not exist locally or remotely
function upstreamUrlForFile(fullpath) {
  const localPath = path.dirname(fullpath);
  const filename = path.basename(fullpath);
  let baseUrl = upstreamUrl(localPath);
  if (!baseUrl) return null;
  baseUrl = baseUrl.replace(".git", "");
  baseUrl = baseUrl.replace("github.com", "raw.githubusercontent.com");
  //  https://github.com/Artsdatabanken/lastejobb.git/master/schema.json
  //  https://raw.githubusercontent.com/Artsdatabanken/lastejobb/master/index.js
  return `${baseUrl}/master/${filename}`;
}

module.exports = { upstreamUrl, upstreamUrlForFile };
