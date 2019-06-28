const parse = require("csv-parse/lib/sync");
const fs = require("fs");

function les(csvFilePath, options) {
  const input = fs.readFileSync(csvFilePath);
  const records = parse(input, {
    columns: true,
    ...options
  });
  return records;
}

module.exports = { les };
