const path = require("path");
const fs = require("fs");

const kildedataPath = "kildedata";
const dataRoot = "data";
const buildRoot = process.env.BUILD || "build";

getPackage = () => {
  const owner = "../package.json";
  const p = require(owner);
  if (!p._where) return p;
  return require(p._where + "/package.json");
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
