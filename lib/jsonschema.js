const log = require("log-less-fancy")();
const git = require("./git");

/**
 * Link to JSON schema by URL if available.
 * So we can minimize diffs in output files
 */
function addSchemaLink(o, schemaFilePath) {
  if (o.$schema) return; // Already have a schema
  const url = git.getUpstreamUrlForFile(schemaFilePath);
  if (!url)
    return log.warn("Unable to find git upstream for " + schemaFilePath);
  o.$schema = url + "#";
  log.info("Added JSON schema ref: " + url);
}

module.exports = { addSchemaLink };
