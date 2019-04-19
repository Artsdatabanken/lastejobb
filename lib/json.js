function sortByKey(o) {
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
