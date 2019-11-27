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
    if (typeof value !== "object") value = { value };
    if (propertyForKey) {
      if (value.hasOwnProperty(propertyForKey))
        throw new Error(
          `Key target ${propertyForKey} already set to "${value[propertyForKey]}"`
        );
      value[propertyForKey] = key;
    }
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
function moveKey(o, srcPath, destPath) {
  const value = popKey(o, srcPath);
  if (!value) return;
  deleteKey(o, srcPath);
  return createKey(o, destPath, value);
}

function createKey(o, destPath, value) {
  let node = o;
  const destArr = destPath.split(".");
  while (destArr.length > 1) {
    const dest = destArr.shift();
    if (!node[dest]) node[dest] = {};
    node = node[dest];
  }

  const dest = destArr.pop();
  if (node.hasOwnProperty(dest) && !isEmpty(node[dest]))
    throw new Error(
      `Forsøk på å skrive over nøkkel "${dest}" fra nøkkel "${srcProperty}: ${JSON.stringify(
        node
      )}`
    );
  node[dest] = value;
  return o;
}

function isEmpty(obj) {
  // because Object.entries(new Date()).length === 0;
  // we have to do some additional check
  if (obj == null) return true;
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

// Find nested subkey in object o.
// Example path: "subkey.subkeylevel2"
function getKey(o, path) {
  path = path.split(".");
  while (path.length > 0) {
    if (!o) return;
    const segment = path[0];
    if (o[segment]) {
      o = o[segment];
      path.shift();
    } else {
      // path might include dots.  Try as last resort
      return o[path.join(".")];
    }
  }
  return o;
}

// Find and remove nested subkey in object o.
// Example path: "subkey.subkeylevel2"
function popKey(o, path) {
  path = path.split(".");
  while (path.length > 0) {
    if (!o) return;
    const segment = path[0];
    if (o[segment]) {
      if (path.length === 1) {
        const value = o[segment];
        delete o[segment];
        return value;
      }
      o = o[segment];
      path.shift();
    } else {
      // path might include dots.  Try as last resort
      const key = path.join(".");
      const value = o[key];
      delete o[key];
      return value;
    }
  }
  return o;
}

// Find nested subkey in object o.
// Example path: "subkey.subkeylevel2"
function deleteKey(o, path) {
  path = path.split(".");
  const stack = [];
  while (path.length > 0) {
    if (!o) break;
    const segment = path.shift();
    if (!o.hasOwnProperty(segment)) break;
    stack.push({ o, segment });
    o = o[segment];
  }
  while (stack.length > 0) {
    const a = stack.pop();
    if (!a) debugger;
    const { o, segment } = a; // stack.pop()
    if (!isEmpty(o[segment])) return;
    delete o[segment];
  }
}

// Remove keys that don't have values
// Example: {a: null, b: {}, c: undefined}
function removeEmptyKeys(o) {
  if (o === undefined) return;
  if (o === null) return;
  if (o.constructor !== Object) return;
  for (var key of Object.keys(o)) {
    const obj = o[key];
    removeEmptyKeys(obj);
    if (isEmpty(obj)) delete o[key];
  }
  return o;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = Array.from(new Set([...pVal, ...oVal]));
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

module.exports = {
  arrayToObject,
  objectToArray,
  mergeDeep,
  createKey,
  getKey,
  moveKey,
  popKey,
  deleteKey,
  removeEmptyKeys,
  sortKeys,
  stringifyGeojsonCompact
};
