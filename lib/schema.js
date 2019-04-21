const fs = require("fs-extra");
const path = require("path");
const log = require("log-less-fancy")();

const git = require("./git");

function addSchemaLink(o, schemaFilePath) {
  const url = git.upstreamUrlForFile(schemaFilePath);
  if (!url)
    return log.warn("Unable to find git upstream for " + schemaFilePath);
  o["$schema"] = url + "#";
}

module.exports = { addSchemaLink };
