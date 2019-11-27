const fs = require("fs");

const signatures = {
  jpg: [255, 216, 255],
  png: [137, 80, 78]
};

// Detects image file type (PNG/JPG) based on content
function getFileType(filePath) {
  const fd = fs.openSync(filePath, "r");
  var buffer = Buffer.alloc(10);
  fs.readSync(fd, buffer, 0, 9, 0);
  buffer = buffer.toJSON().data;
  for (candidateType of Object.keys(signatures)) {
    const sig = signatures[candidateType];
    if (buffersEqual(sig, buffer)) return candidateType;
  }
  return null;
}

function buffersEqual(sig, buffer) {
  for (let i = 0; i < sig.length; i++) if (sig[i] !== buffer[i]) return false;
  return true;
}

module.exports = { getFileType };
