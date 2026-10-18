const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

function creaReport(catalogo, etichetta) {
  // TODO: selezione, ordinamento per prezzo, estrazione degli ID e somme.
  // Non ordinare direttamente catalogo.prodotti.
  throw new Error("Da completare: creaReport");
}

try {
  const catalogo = JSON.parse(readFileSync(path.join(__dirname, "../../esempi/catalogo.json"), "utf8"));
  const report = creaReport(catalogo, process.argv[2] ?? "usb");
  const testo = JSON.stringify(report, null, 2);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "report.json"), testo + "\n", "utf8");
  console.log(testo);
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
