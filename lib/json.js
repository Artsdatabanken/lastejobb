// Recursively sort by keys
// So we can minimize diffs in output files
sortKeys = function(x) {
  if (x === null) return x;
  if (x instanceof Date) return x;
  if (typeof x !== "object") return x;
  if (Array.isArray(x)) return x.map(sortKeys);
  var res = {};
  Object.keys(x)
    .sort()
    .forEach(k => (res[k] = sortKeys(x[k])));
  return res;
};

function stringifyGeojsonCompact(geojson) {
  const magic = "😀";
  function replacer(key, value) {
    if (key === "coordinates")
      return magic + JSON.stringify(value, null, 0) + magic;

    return value;
  }
  let json = JSON.stringify(geojson, replacer, "  ");
  json = json.replace(/\"😀/g, "");
  json = json.replace(/😀\"/g, "");
  return json;
}

// Converts an array of objects to an object keyed by property specified in key
const arrayToObject = (arr, key) =>
  arr.reduce((acc, e) => {
    acc[e[key]] = e;
    return acc;
  }, {});

module.exports = { arrayToObject, sortKeys, stringifyGeojsonCompact };
