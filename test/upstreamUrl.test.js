const { git } = require("../lib");

test("Schema url", () => {
  const actual = git.getUpstreamUrlForFile("./package.json");
  expect(actual).toMatchSnapshot();
});
