const fs = require("fs");

// Write a file in step 1, read it back in step 2
const data = fs.readFileSync("testdata").toString();
if (data !== "OK") throw new Error("Test failed.");
