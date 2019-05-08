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
const arrayToObject = (arr, { uniqueKey, removeKeyProperty = true }) =>
  arr.reduce((acc, e) => {
    acc[e[uniqueKey]] = e;
    if (removeKeyProperty) delete e[uniqueKey];
    return acc;
  }, {});

// Convert a javascript object into an array
// Arguments:
//    propertyForKey (optional): Assigns a property on the array element with the key from the input object
const objectToArray = (o, propertyForKey) =>
  Object.entries(o).reduce((acc, [key, value]) => {
    if (propertyForKey) value[propertyForKey] = key;
    acc.push(value);
    return acc;
  }, []);

// Move a property to a different location within the object
// Warning: Mutates the object
// Arguments:
//   srcProperty: Name of the property whose value will be moved
//   destPath: New path to put the property
// Example:
//   o =  {a: 42}
//   moveKey(o, 'a', 'd.e') => {d:{e:42}}
function moveKey(o, srcProperty, destPath) {
  if (!o[srcProperty]) return;

  let node = o;
  const destArr = destPath.split(".");
  while (destArr.length > 1) {
    const dest = destArr.shift();
    if (!node[dest]) node[dest] = {};
    node = node[dest];
  }

  const dest = destArr.pop();
  node[dest] = o[srcProperty];
  delete o[srcProperty];
  return o;
}

module.exports = {
  arrayToObject,
  objectToArray,
  moveKey,
  sortKeys,
  stringifyGeojsonCompact
};
