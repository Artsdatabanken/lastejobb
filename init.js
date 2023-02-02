const { log, processes } = require("./lib");
const fs = require("fs");

const exec = processes.exec;

function addScripts() {
  const scripts = {
    download: "node node_modules/@artsdatabanken/lastejobb stages/download",
    transform: "node node_modules/@artsdatabanken/lastejobb stages/transform",
    build: "npm run download && npm run transform",
    deploy: "node node_modules/@artsdatabanken/lastejobb stages/deploy"
  };
  log.info("Add scripts to package.json");
  const pjson = JSON.parse(fs.readFileSync("package.json"));
  Object.keys(scripts).forEach(key => {
    if (pjson.scripts[key])
      return log.warn("Script '" + key + "' already exists.");
    pjson.scripts[key] = scripts[key];
  });
  fs.writeFileSync("package.json", JSON.stringify(pjson, null, " "));
}

function addReadme() {
  log.info("Create README.md");
  if (fs.existsSync("README.md")) return log.warn("index.js already exists.");
  const filePath = __dirname + "/README.md";
  const readme = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync("README.md", readme);
}

function mkdir(path) {
  log.info("Make directory " + path);
  if (fs.existsSync(path)) return;
  fs.mkdirSync(path);
}

function makeDirs() {
  mkdir("stages");
  mkdir("stages/download");
  mkdir("stages/transform");
  mkdir("stages/deploy");
}

function installLastejobb() {
  log.info("Installing library lastejobb");
  exec("npm", ["install", "lastejobb"]);
}

const steps = [
  {
    path: "stages/download/10_download.js",
    content: [
      'const { http, log } = require("lastejobb");',
      "",
      'log.info("Processing...")',
      ""
    ]
  },
  {
    path: "stages/transform/10_transform.js",
    content: [
      'const { io, log } = require("lastejobb");',
      "",
      "const data = io.readJson('downloaded')"
    ]
  },
  {
    path: "stages/deploy/10_deploy.js",
    content: [
      'const { process } = require("lastejobb");',
      "",
      'log.info("Processing...")'
    ]
  }
];

function makeStep(step) {
  const fn = step.path;
  log.info("Create " + fn);
  if (fs.existsSync(fn)) return log.warn(fn + " already exists");
  fs.writeFileSync(fn, step.content.join("\n"));
}

function makeSteps() {
  steps.forEach(step => makeStep(step));
}

async function npmInit() {
  if (fs.existsSync("package.json")) return;
  log.info("Initialize npm project");
  await exec("npm", ["init", "-y"]);
}

function gitInit() {
  if (fs.existsSync(".git")) return;
  log.info("Initialize Git repo");
  exec("git", ["init"]);
}

function makeGitIgnore() {
  if (fs.existsSync(".gitignore")) return;
  const ignore = ["node_modules", "temp", "build"];
  fs.writeFileSync(".gitignore", ignore.join("\n"));
}

async function init() {
  gitInit();
  makeGitIgnore();
  npmInit();
  installLastejobb();
  addScripts();
  makeDirs();
  makeSteps();
  addReadme();
}

module.exports = { init };
