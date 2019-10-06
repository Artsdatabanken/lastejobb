const { spawn } = require("child_process");
const log = require("./log");

async function exec(cmd, args) {
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
  if (r.status > 0) process.exit(1);
}

module.exports = { exec };
