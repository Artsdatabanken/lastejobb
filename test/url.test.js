const { url } = require("..");

const input = {
  "AO-KS-FS-JM": {
    kode: "AO-KS-FS-JM",
    tittel: { nb: "Jan Mayen" },
    foreldre: ["AO-KS-FS"]
  },
  "AO-KS-FS": {
    kode: "AO-KS-FS",
    tittel: {
      nb: "Fiskerisone"
    },
    foreldre: ["AO-KS"]
  },
  "AO-KS": {
    kode: "AO-KS",
    tittel: {
      nb: "Kontinentalsokkel"
    },
    foreldre: ["AO"]
  },
  AO: {
    kode: "AO",
    tittel: {
      nb: "Rot"
    },
    foreldre: []
  }
};

// Recursively sort objects
test("createUrl", () => {
  new url(input).assignUrls();
  expect(input).toMatchSnapshot();
});
