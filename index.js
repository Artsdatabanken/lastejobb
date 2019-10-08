#!/usr/bin/env node
const lib = require("./lib");
const init = require("./init");
const { io, log, processes, sparql } = lib;
const path = require("path");
const { spawnSync } = require("child_process");

async function runJavascript(jsFile) {
  const r = spawnSync("node", ["--max_old_space_size=2096", `"${jsFile}"`], {
    shell: true,
    stdio: [0, 1, 2]
  });
  if (r.status > 0) process.exit(1);
}

async function runShellscript(shFile) {
  await processes.exec(shFile);
}

async function runSparqlQuery(shFile) {
  const fn = path.parse(shFile).name;
  await sparql.queryFromFile(shFile, fn);
}

const filtypeLaunch = {
  ".js": runJavascript,
  ".sparql": runSparqlQuery,
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
