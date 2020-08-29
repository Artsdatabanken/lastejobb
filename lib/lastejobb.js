const io = require("./io");
const log = require("./log");
const processes = require("./processes");
const sparql = require("./sparql");

const path = require("path");
const { spawnSync } = require("child_process");

/**
 * Execute javascript through Node.
 */
async function runJavascript(jsFile) {
  const r = spawnSync("node", ["--max_old_space_size=2096", `"${jsFile}"`], {
    shell: true,
    stdio: [0, 1, 2]
  });
  if (r.status > 0) process.exit(r.status);
}

/**
 * Execute bash shell script.
 */
async function runShellscript(shFile) {
  await processes.exec(shFile);
}

/**
 * Execute a SPARQL query.
 * https://www.w3.org/TR/rdf-sparql-query/
 */
async function runSparqlQuery(shFile) {
  const fn = path.parse(shFile).name;
  await sparql.queryFromFile(shFile, fn);
}

/**
 * Run a PostgreSQL query.
 */
async function runPostgresQuery(shFile) {
  await processes.exec('psql', ['-v', 'ON_ERROR_STOP=1', /*'-a',*/ '-f', shFile])
}

const filtypeLaunch = {
  ".js": runJavascript,
  ".sql": runPostgresQuery,
  ".sparql": runSparqlQuery,
  ".sh": runShellscript
};

/**
 * Execute a single stage.
 */
async function kjørLastejobb(scriptFile) {
  if (scriptFile.indexOf(".test") >= 0) return;
  const ext = path.parse(scriptFile).ext;
  const launcher = filtypeLaunch[ext];
  if (!launcher) return log.warn("Mangler funksjon for å kjøre " + scriptFile);
  log.debug("Kjører " + scriptFile);
  await launcher(scriptFile);
}

/**
 * Execute all stages in folder and any subfolders.
 */
async function kjørLastejobberUnder(rotkatalog) {
  let files = io.findFiles(rotkatalog);
  files = files.sort();
  log.info("Fant " + files.length + " lastejobber");
  for (var file of files)
    await kjørLastejobb(file).catch(err => {
      log.error(err);
      process.exit(1);
    });
}

module.exports = {
  kjørLastejobberUnder,
  kjørLastejobb
};
