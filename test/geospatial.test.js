const { geospatial } = require("..");

test("area", () => {
  const geom = [[0, 0], [0, 10], [10, 10], [0, 0]];
  const actual = geospatial.calculateArea(geom);
  expect(actual).toMatchSnapshot();
});

// function test(a, x) {
//   x();
// }
