var fs = require("fs");
var ini = require("ini");
var path = require("path");
const log = require("log-less-fancy")();

module.exports = function(dir) {
  var configPath = path.resolve(dir, process.env.GIT_DIR || ".git", "config");
  if (!fs.existsSync(configPath))
    return log.warn("no gitconfig found at " + dir);
  const data = fs.readFileSync(configPath);
  const inidata = ini.parse(data.toString());
  var formatted = format(inidata);
  return formatted;
};

function format(data) {
  var out = {};
  Object.keys(data).forEach(k => {
    if (k.indexOf('"') > -1) {
      var parts = k.split('"');
      var parentKey = parts.shift().trim();
      var childKey = parts.shift().trim();
      if (!out[parentKey]) out[parentKey] = {};
      out[parentKey][childKey] = data[k];
    } else {
      out[k] = { ...out[k], ...data[k] };
    }
  });
  return out;
}
