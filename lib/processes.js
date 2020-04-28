const { spawn } = require("child_process");
const log = require("./log");

/**
 * Execute subprocess and capture console/error output.
 * Abort the process on non-zero exit code.
 */
async function exec(cmd, args) {
  return new Promise((resolve, reject) => {
    log.info(cmd);
    const r = spawn(cmd, args, {
      encoding: "buffer",
      shell: true,
      stdio: [0, "pipe", "pipe"]
    });
    r.stdout.on("data", data => {
      const msgs = data.toString().split("\n");
      msgs.forEach(msg => {
        if (msg.trim().length > 0) log.info(msg);
      });
    });
    r.stderr.on("data", data => {
      const msgs = data.toString().split("\n");
      msgs.forEach(msg => {
        if (msg.trim().length > 0) log.error(msg);
      });
    });
    r.on("close", p => {
      if (p > 0) process.exit(1);
      resolve();
    });
  });
}

module.exports = { exec };
