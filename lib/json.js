function sortByKey(o) {
  if (Array.isArray(o)) return o.sort();
  return Object.keys(o)
    .sort()
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: o[key]
      }),
      {}
    );
}

module.exports = { sortByKey };
