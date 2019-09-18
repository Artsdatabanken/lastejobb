const { spawnSync } = require("child_process");
const { log } = require("./lib");
const fs = require("fs");

function exec(cmd, args) {
  const r = spawnSync(cmd, args, {
    encoding: "buffer",
    shell: true,
    stdio: [0, 1, 2]
  });
  if (r.status > 0) process.exit(1);
}

const scripts = {
  download: "node index download",
  transform: "node index transform",
  build: "npm run download && npm run transform",
  deploy: "./scripts/deploy.sh"
};

function addScripts() {
  log.info("Add scripts to package.json");
  const package = JSON.parse(fs.readFileSync("package.json"));
  Object.keys(scripts).forEach(key => {
    if (package.scripts[key])
      return log.warn("Script '" + key + "' already exists.");
    package.scripts[key] = scripts[key];
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
  exec("npm", ["install", "lastejobb"]);
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
  makeStep("stages/download/10_sample.js");
  makeStep("stages/transform/10_sample.js");
}

function npmInit() {
  if (fs.existsSync("package.json")) return;
  log.info("Initialize npm project");
  exec("npm", ["init", "-y"]);
}

function gitInit() {
  if (fs.existsSync(".git")) return;
  log.info("Initialize Git repo");
  exec("git", ["init"]);
}

function makeGitIgnore() {
  if (fs.existsSync(".gitignore")) return;
  const ignore = ["node_modules", "data", "build"];
  fs.writeFileSync(".gitignore", ignore.join("\n"));
}

function init() {
  npmInit();
  installLastejobb();
  addScripts();
  writeIndex();
  makeDirs();
  makeSteps();
  gitInit();
  makeGitIgnore();
}

module.exports = { init };
