function polygonArea(polygon) {
  const numPoints = polygon.length;
  let area = 0;
  let prev = polygon[0];
  for (let i = 1; i <= numPoints; i++) {
    let cur = polygon[i % numPoints];
    area += (prev[0] + cur[0]) * (prev[1] - cur[1]);
    prev = cur;
  }
  return Math.abs(area / 2);
}

// Calculate area covered by geometry
// Makes most sense to use on UTM coordinates - does not reproject coordinates
// Returns: Area in square meters (if input is UTM)
function calculateArea(geoJsonGeometries) {
  let area = 0;
  if (Array.isArray(geoJsonGeometries[0][0]))
    geoJsonGeometries.forEach(geom => (area += calculateArea(geom)));
  else return polygonArea(geoJsonGeometries);
  return area;
}

module.exports = { calculateArea };
