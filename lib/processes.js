const { spawn } = require("child_process");
const log = require("./log");

async function exec(cmd, args) {
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
  if (r.status > 0) {
    log.error(r.stderr.toString());
    process.exit(1);
  }
}

module.exports = { exec };
