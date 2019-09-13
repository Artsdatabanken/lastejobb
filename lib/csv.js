const parse = require("csv-parse/lib/sync");
const fs = require("fs");

function les(csvFilePath, options, encoding) {
  const input = fs.readFileSync(csvFilePath, encoding);
  const records = parse(input, {
    columns: true,
    ...options
  });
  return records;
}

module.exports = { les };
