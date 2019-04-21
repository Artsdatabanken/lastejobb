const { json } = require("lastejobb");

const input = {
  z: 2,
  k: [6, 1, 3],
  y: { c: 5, a: "abc" }
};
const inputArray = [6, 1, 3];

// Recursively sort objects
test("sort JSON object", () => {
  const actual = json.sortKeys(input);
  expect(actual).toMatchSnapshot();
});

// We don't sort the array
test("sort JSON array", () => {
  const actual = json.sortKeys(inputArray);
  expect(actual).toMatchSnapshot();
});
