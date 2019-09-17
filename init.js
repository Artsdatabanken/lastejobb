const { spawnSync } = require("child_process");
const { log } = require("./lib");
const fs = require("fs");

const scripts = {
  download: "node index download",
  transform: "node --max_old_space_size=8192 index transform",
  build: "npm run download && npm run transform",
  test: "node --max_old_space_size=6144 node_modules/.bin/jest",
  deploy: "./scripts/deploy.sh"
};

function addScripts() {
  log.info("Add scripts to package.json");
  const package = JSON.parse(fs.readFileSync("package.json"));
  Object.keys(scripts).forEach(key => {
    if (package.scripts[key])
      return log.warn("Script '" + key + "' already exists.");
    package.scripts[key] = scripts[keys];
  });
  fs.writeFileSync("package.json", JSON.stringify(package, null, " "));
}

function writeIndex() {
  log.info("Create index.js");
  if (fs.existsSync("index.js")) throw new Error("index.js already exists.");
  const index = [
    'if (!process.env.DEBUG) process.env.DEBUG = "*"',
    'const { kjørLastejobberUnder } = require("lastejobb")',
    "",
    'const scripPath = "stages/" + (process.argv[2] || "")',
    "kjørLastejobberUnder(scripPath)"
  ];
  fs.writeFileSync("index.js", index.join("\n"));
}

function mkdir(path) {
  log.info("Make directory " + path);
  fs.mkdirSync(path);
}

function makeDirs() {
  mkdir("stages");
  mkdir("stages/download");
  mkdir("stages/transform");
}

function installLastejobb() {
  log.info("Installing library lastejobb");
  const r = spawnSync("npm", ["install", "lastejobb"], {
    encoding: "buffer",
    shell: true,
    stdio: [0, 1, 2]
  });
  if (r.status > 0) process.exit(1);
}

function makeStep(fn) {
  log.info("Create " + fn);
  const script = [
    'const { log } = require("lastejobb");',
    "",
    'log.info("Processing...")'
  ];
  if (fs.existsSync(fn)) return log.warn(fn + " already exists");
  fs.writeFileSync(fn, script.join("\n"));
}

function makeSteps() {
  makeStep("stages/download/10_sample");
  makeStep("stages/transform/10_sample");
}

function init() {
  installLastejobb();
  addScripts();
  writeIndex();
  makeDirs();
  makeSteps();
}

module.exports = { init };
