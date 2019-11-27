const { image } = require("..");

test("detect png", () => {
  const actual = image.getFileType("./test/image/test.png");
  expect(actual).toMatchSnapshot();
});

test("detect jpg", () => {
  const actual = image.getFileType("./test/image/test.jpg");
  expect(actual).toMatchSnapshot();
});
