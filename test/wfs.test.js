const { wfs } = require("../lib");

const url =
  "https://kart.miljodirektoratet.no/arcgis/rest/services/vern/MapServer/0/query?where=1=1&outfields=*&f=geojson";

test("wfs", async () => {
  return true;
  // Integration test follows
  const actual = await wfs.mirror(url, "test.geojsonl").catch(e => {
    console.error(e);
  });
  expect(actual).toMatchSnapshot();
});
