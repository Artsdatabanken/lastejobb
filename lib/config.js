const path = require("path");
const fs = require("fs");

const kildedataPath = "kildedata";
const dataRoot = "data";
const buildRoot = process.env.BUILD || "build";

getPackage = () => {
  if (fs.existsSync("../../package.json")) return require("../../package.json");
  return require("../package.json");
};

getBuildPath = (relPath, extension = ".json") => {
  const filename = path.basename(relPath, path.extname(relPath)) + extension;
  return path.join(buildRoot, filename);
};

getDataPath = (relPath, extension = ".json") => {
  const filename = path.basename(relPath, path.extname(relPath)) + extension;
  return path.join(dataRoot, filename);
};

module.exports = { getBuildPath, getDataPath, getPackage };
