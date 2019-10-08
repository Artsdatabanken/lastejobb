const log = require("log-less-fancy")();

class UrlGenerator {
  constructor(tre, prefix = "") {
    this.usedUrls = {};
    this.tre = tre;
    this.prefix = prefix;
  }

  assignUrls() {
    Object.keys(this.tre).forEach(kode => this.addUrl(kode, this.tre[kode]));
    Object.keys(this.tre).forEach(kode =>
      this.addUrlPåRelasjoner(this.tre[kode])
    );
  }

  url(kode) {
    const node = this.tre[kode];
    if (node.hasOwnProperty("url")) return node.url;
    let foreldre = node.foreldre;
    if (!foreldre || foreldre.length === 0)
      foreldre = [
        kode
          .split("-")
          .slice(0, -1)
          .join("-")
      ];
    if (!foreldre) {
      log.error(kode, JSON.stringify(node));
      throw new Error("Mangler foreldre for " + kode);
    }
    const subUrl = this.urlify(node.tittel, kode, true);
    node.url = "/" + subUrl;
    if (foreldre.length > 0) {
      let parentUrl = this.url(foreldre[0]);
      if (parentUrl !== "/") node.url = parentUrl + node.url;
    } else if (this.prefix) node.url = "/" + this.prefix + node.url;
    return node.url;
  }

  urlify(tittel, kode, makevalid) {
    let s = tittel.url || tittel.nob || tittel.nb; // TODO: Remove nb
    if (!s) {
      log.error("Mangler tittel: " + kode + ": " + JSON.stringify(tittel));
      return kode;
    }

    let url = s.replace(/[\/:\s]/g, "_");
    if (makevalid) {
      url = url.replace("%", "_prosent");
      url = url.replace("__", "_");
    }
    return url;
  }

  addUrl(kode, node) {
    if (!node.hasOwnProperty("url")) node.url = this.url(kode);
    if (this.usedUrls[node.url])
      log.warn(
        "Dupe URL " + kode + "," + this.usedUrls[node.url] + ": " + node.url
      );
    this.usedUrls[node.url] = kode;
  }

  addUrlPåRelasjoner(node) {
    this.urlPåGraf(node);
    this.urlPåGradient(node);
    this.urlPåFlagg(node);
  }

  urlPåGraf(node) {
    if (!node.graf) return;
    const grafArray = [];
    Object.keys(node.graf).forEach(typeRelasjon => {
      const tr = { type: typeRelasjon, noder: [] };
      Object.keys(node.graf[typeRelasjon]).forEach(kode => {
        const sub = node.graf[typeRelasjon][kode];
        sub.kode = kode;
        sub.url = this.url(kode);
        tr.noder.push(sub);
      });
      grafArray.push(tr);
    });
    node.graf = grafArray;
  }

  urlPåGradient(node) {
    if (!node.gradient) return;
    Object.keys(node.gradient).forEach(domenekode => {
      const domenenode = node.gradient[domenekode];
      domenenode.url = this.url(domenekode);
      Object.keys(domenenode.barn).forEach(gradientkode => {
        const gradientnode = domenenode.barn[gradientkode];
        gradientnode.url = this.url(gradientkode);
        gradientnode.trinn.forEach(trinn => {
          trinn.url = this.url(trinn.kode);
        });
      });
    });
  }

  urlPåFlagg(node) {
    if (!node.flagg) return;
    Object.keys(node.flagg).forEach(kode => {
      node.flagg[kode].url = this.tre[kode].url;
    });
  }
}

module.exports = UrlGenerator;
