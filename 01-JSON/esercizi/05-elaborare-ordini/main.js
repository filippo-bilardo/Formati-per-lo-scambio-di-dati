const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

function elaboraOrdini(catalogo, ordini) {
  // TODO: verifica ogni ordine prima di scalare le quantità.
  // Restituisci { catalogo, report }; un rifiuto non interrompe gli altri ordini.
  throw new Error("Da completare: elaboraOrdini");
}

try {
  const catalogo = JSON.parse(readFileSync(path.join(__dirname, "../../esempi/catalogo.json"), "utf8"));
  const fileOrdini = process.argv[2] ?? path.join(__dirname, "../dati/ordini.json");
  const ordini = JSON.parse(readFileSync(fileOrdini, "utf8"));
  const risultato = elaboraOrdini(catalogo, ordini);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  for (const [nome, dati] of [["catalogo-residuo.json", risultato.catalogo], ["report-ordini.json", risultato.report]]) {
    writeFileSync(path.join(output, nome), JSON.stringify(dati, null, 2) + "\n", "utf8");
  }
  console.log(JSON.stringify(risultato.report, null, 2));
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
