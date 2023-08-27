#!/usr/bin/env node
const lib = require("./lib/");
const init = require("./init");
const { io, log } = lib;
const { kjørLastejobberUnder } = require("./lib/lastejobb");

const argLast = process.argv[process.argv.length - 1];
switch (argLast) {
  case "init":
    log.info("Initialiserer lastejobb...");
    init.init();
}

// By default, ignore the long noisy JSON debug logs from axios library follow-redirects
if (!process.env.DEBUG) process.env.DEBUG = "*,-follow-redirects";
if (process.argv.length === 3) {
  const scripPath = process.argv[2];
  if (!io.directoryExists(scripPath)) {
    log.info("Usage: npx lastejobb <scriptPath>");
    process.abort();
  }
  log.info("Kjører lastejobber i " + scripPath);
  kjørLastejobberUnder(scripPath);
}
