const { archive, io } = require("../lib");

test("download and untar tar", async () => {
    await archive.downloadAndUntar("https://github.com/Artsdatabanken/kommune/releases/latest/download/artifacts.tar")
    const actual = io.lesTempJson("artifacts/fylke.schema.json")
    expect(actual.$schema).toMatchSnapshot();
});
