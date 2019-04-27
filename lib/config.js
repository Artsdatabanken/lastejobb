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

getBuildPath = (relPath, extension) => {
  return getAbsolutePath(buildRoot, relPath, extension);
};

getDataPath = (relPath, extension) => {
  return getAbsolutePath(dataRoot, relPath, extension);
};

getAbsolutePath = (rootPath, relPath, extension) => {
  if (!relPath) return dataRoot;
  const originalExtension = path.extname(relPath);
  extension = extension || originalExtension || ".json";
  const filename = path.basename(relPath, originalExtension) + extension;
  return path.join(rootPath, filename);
};

module.exports = { getBuildPath, getDataPath, getPackage };
