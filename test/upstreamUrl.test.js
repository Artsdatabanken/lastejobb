const { git } = require("../lib");

test("Schema url", () => {
  const actual = git.getUpstreamUrlForFile("./schema.json");
  expect(actual).toMatchSnapshot();
});
