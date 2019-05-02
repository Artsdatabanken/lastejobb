const { json } = require("..");

const input = {
  z: 2,
  k: [6, 1, 3],
  y: { c: 5, a: "abc", inception: new Date(1880, 1, 2) }
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

test("arrayToObject", () => {
  const arr = [{ id: 5, value: "abc" }, { id: 2, name: "def" }];
  const actual = json.arrayToObject(arr, "id");
  expect(actual).toMatchSnapshot();
});

test("objectToArray", () => {
  const o = { a: { id: 5 }, b: { name: "def" } };
  const actual = json.objectToArray(o, "identifier");
  expect(actual).toMatchSnapshot();
});
