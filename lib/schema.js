const fs = require("fs-extra");
const path = require("path");
const log = require("log-less-fancy")();

const git = require("./git");

function addSchemaLink(o, schemaFilePath) {
  if (o.$schema) return; // Already have a schema
  const url = git.upstreamUrlForFile(schemaFilePath);
  if (!url)
    return log.warn("Unable to find git upstream for " + schemaFilePath);
  o.$schema = url + "#";
  log.warn("Automatically add JSON schema link: " + url);
}

module.exports = { addSchemaLink };
