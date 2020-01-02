const { wfs } = require("..");

const url =
  "https://kart.miljodirektoratet.no/arcgis/rest/services/vern/MapServer/0/query?where=1=1&outfields=*&f=geojson";

test("wfs", () => {
  const actual = wfs.mirror(url, "test.geojsonl");
  expect(actual).toMatchSnapshot();
});
