const path = require("path");

const tempRoot = "temp";
const buildRoot = process.env.BUILD || "build";

/**
 * The build output artifact directory.
 * Default: ./build
 */
getBuildPath = (relPath, extension) => {
  return getAbsolutePath(buildRoot, relPath, extension);
};

/**
 * Temporary data file working directory.
 * Default: ./temp
 */
getTempPath = (relPath, extension) => {
  return getAbsolutePath(tempRoot, relPath, extension);
};

/**
 * Convert relative path to absolute path.
 * Default: ./temp
 */
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

let packagejson = null;
function getPackage() {
  if (packagejson) return packagejson;
  packagejson = getPackageInner();
  return packagejson;
}

getPackageInner = () => {
  const baseModulePath = getPackageInner(__dirname.replace(/\/node_modules.*/,''));
  const p = require(path.join(baseModulePath, 'package.json'));
  if (!p._where) return p;
  return require(p._where + "/package.json");
};

module.exports = { getBuildPath, getTempPath, getPackage };
