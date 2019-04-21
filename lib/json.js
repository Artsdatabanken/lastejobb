// Recursively sort by keys
// So we can minimize diffs in output files
sortKeys = function(x) {
  if (typeof x !== "object") return x;
  if (Array.isArray(x)) return x.map(sortKeys);
  var res = {};
  Object.keys(x)
    .sort()
    .forEach(k => (res[k] = sortKeys(x[k])));
  return res;
};

module.exports = { sortKeys };
