#!/usr/bin/env node
const lib = require("./lib");
const init = require("./init");
const { io, log, processes } = lib;
const path = require("path");

async function runJavascript(jsFile) {
  await processes.exec("node", ["--max_old_space_size=2096", `"${jsFile}"`]);
}

async function runShellscript(shFile) {
  await processes.exec(shFile);
}

const filtypeLaunch = {
  ".js": runJavascript,
  ".sh": runShellscript
};

async function kjørLastejobb(scriptFile) {
  if (scriptFile.indexOf(".test") >= 0) return;
  const ext = path.parse(scriptFile).ext;
  const launcher = filtypeLaunch[ext];
  if (!launcher) return log.warn("Mangler funksjon for å kjøre " + scriptFile);
  log.debug("Kjører " + scriptFile);
  await launcher(scriptFile);
}

async function kjørLastejobberUnder(rotkatalog) {
  let files = io.findFiles(rotkatalog);
  files = files.sort();
  log.info("Fant " + files.length + " lastejobber");
  for (var file of files) await kjørLastejobb(file);
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
