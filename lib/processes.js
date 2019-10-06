const { spawnSync } = require("child_process");
const log = require("./log");

function exec(cmd, args) {
  const r = spawnSync(cmd, args, {
    encoding: "buffer",
    shell: true,
    stdio: [0, "pipe", "pipe"]
  });
  r.stdout
    .toString()
    .split("\n")
    .forEach(line => {
      if (line.trim().length > 0) log.info(line);
    });
  if (r.status > 0) {
    log.error(r.stderr.toString());
    process.exit(1);
  }
}

module.exports = { exec };
