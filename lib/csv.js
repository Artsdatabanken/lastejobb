//const parse = require("csv-parse/lib/sync");
const parse = require('csv-parse/sync')
const fs = require("fs");

/**
 * Read a CSV file and convert to an object.
 */
function les(csvFilePath, csvOptions, readFileOptions) {
  const input = fs.readFileSync(csvFilePath, readFileOptions);
  const records = parse(input, {
    columns: true,
    ...csvOptions
  });
  return records;
}

module.exports = { les };
