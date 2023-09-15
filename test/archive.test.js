const { archive, io } = require("../lib");

test("download and untar gzipped tar", async () => {
    await archive.downloadAndUntar("https://github.com/Artsdatabanken/kommune/releases/latest/download/kommune.tar.gz")
    const actual = io.lesTempJson("kommune/fylke.schema.json")
    expect(actual.$schema).toMatchSnapshot();
});
