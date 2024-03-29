const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;
var gitconfig = require("./gitconfig/gitconfiglocalSync");
const log = require("./log")

/**
 * Run an arbitrary git command.
 */
function git(cmd, args = "") {
  execSync("git " + cmd + " " + args);
}

/**
 * Get link to the actual repo at the current commit
 */
function getGithubCommitUrl() {
  const fn = ".git/refs/heads/master"
  if (!fs.existsSync(fn)) return null
  const hash = fs
    .readFileSync(fn)
    .toString()
    .trim();
  return `${getUpstreamUrl()}/master/${hash}`;
}

/**
 * Clone (make a copy of) a (remote) Git repository
 */
function clone(url, destFolder) {
  log.info(`Git pull into ${destFolder}` )
  if (fs.existsSync(destFolder)) pull(destFolder);
  // only latest version
  else {
    fs.mkdirSync(destFolder, { recursive: true });
    git(`clone --depth=1 ${url} ${destFolder}`);
  }
}

/**
 * Fetch from and integrate with another repository or a local branch.
 */
function pull(destFolder) {
  log.info(`Git pull into ${destFolder}` )
  git(`-C ${destFolder} pull`);
}

/** 
 * Returns the URL of the upstream (remote) repository the directory was cloned from.
 */
function getUpstreamUrl(localPath = ".") {
  const config = gitconfig(localPath);
  if (!config) return; // log.warn("No git config in " + localPath);
  if (!config.remote) return; // only a local git repo
  const remote = config.remote.upstream || config.remote.origin;
  const url = remote.url;
  return url;
}

/**
 * Calculate what the upstream git url for a local file would be.
 * The file need not exist locally or remotely
 */
function getUpstreamUrlForFile(fullpath) {
  const localPath = path.dirname(fullpath);
  const filename = path.basename(fullpath);
  let baseUrl = getUpstreamUrl(localPath);
  if (!baseUrl) return null;
  // Map from local cloned repo (cloned with SSH): 
  //  git@github.com:Artsdatabanken/lastejobb.git
  baseUrl = baseUrl.replace("git@github.com:", "https://raw.githubusercontent.com/");
  baseUrl = baseUrl.replace(/\.git$/, "");
  // Or Github Action CI:
  //  https://github.com/Artsdatabanken/lastejobb.git/master/schema.json
  baseUrl = baseUrl.replace(".git/", "/");
  baseUrl = baseUrl.replace("github.com", "raw.githubusercontent.com");
  // To: 
  //  https://raw.githubusercontent.com/Artsdatabanken/lastejobb/master/index.js
  return `${baseUrl}/master/${filename}`;
}

module.exports = {
  git,
  clone,
  pull,
  getUpstreamUrl,
  getUpstreamUrlForFile,
  getGithubCommitUrl
};
