#!/usr/bin/env node
const lib = require("./lib");
const init = require("./init");
const { io, log, processes } = lib;

function kjørLastejobb(sciptFile) {
  if (sciptFile.indexOf(".test") >= 0) return;
  const ext = path.parse(sciptFile);
  const launcher = filtypeLaunch[ext];
  log.debug("Kjører " + sciptFile);
  const status = launcher(sciptFile);
  if (status > 0) process.exit(1);
}

function kjørLastejobberUnder(rotkatalog) {
  let files = io.findFiles(rotkatalog);
  files = files.sort();
  log.info("Fant " + files.length + " lastejobber");
  files.forEach(file => kjørLastejobb(file));
}

const argLast = process.argv[process.argv.length];
switch (argLast) {
  case "init":
    log.info("Initialiserer lastejobb");
    init.init();
}

module.exports = {
  ...lib,
  kjørLastejobberUnder,
  kjørLastejobb
};

function runJavascript(fn) {
  const r = processes.exec("node", [
    "--max_old_space_size=2096",
    `"${jsFile}"`
  ]);
  return r.status;
}

function runShellscript(fn) {
  const r = processes.exec(fn);
  return r.status;
}

const filtypeLaunch = {
  ".js": runJavascript,
  ".sh": runShellscript
};
