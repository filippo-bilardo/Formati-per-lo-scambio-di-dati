const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

function confronta(prima, dopo) {
  // TODO: usa gli ID, confronta i cinque campi e ordina le liste del report.
  // L'ordine dei prodotti e delle proprietà degli oggetti non indica modifiche.
  throw new Error("Da completare: confronta");
}

try {
  const prima = JSON.parse(readFileSync(path.join(__dirname, "../../esempi/catalogo.json"), "utf8"));
  const secondoFile = process.argv[2] ?? path.join(__dirname, "../dati/catalogo-successivo.json");
  const dopo = JSON.parse(readFileSync(secondoFile, "utf8"));
  const report = confronta(prima, dopo);
  const testo = JSON.stringify(report, null, 2);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "confronto.json"), testo + "\n", "utf8");
  console.log(testo);
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
