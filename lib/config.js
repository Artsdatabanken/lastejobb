const path = require("path");
const fs = require("fs");

const dataRoot = "data";
const buildRoot = process.env.BUILD || "build";

getPackage = () => {
  const owner = "./package.json";
  return fs.readFileSync(owner, "utf8");
};

getBuildPath = (relPath, extension) => {
  return getAbsolutePath(buildRoot, relPath, extension);
};

getDataPath = (relPath, extension) => {
  return getAbsolutePath(dataRoot, relPath, extension);
};

getAbsolutePath = (rootPath, relPath, extension) => {
  if (!relPath) return rootPath;
  if (path.isAbsolute(relPath)) relPath = path.basename(relPath);
  const originalExtension = path.extname(relPath);
  extension = extension || originalExtension || ".json";
  if (extension == ".js") extension = ".json";
  const relparts = path.parse(relPath);
  const adjustedRelPath = path.join(relparts.dir, relparts.name + extension);
  return path.join(rootPath, adjustedRelPath);
};

module.exports = { getBuildPath, getDataPath, getPackage };
