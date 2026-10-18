const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

function controllaProdotto(prodotto) {
  // TODO: controlla i campi richiesti; lancia Error se un vincolo fallisce.
  // Il parsing riuscito non garantisce i tipi attesi dal modello.
  throw new Error("Da completare: controllaProdotto");
}

try {
  const ingresso = process.argv[2] ?? path.join(__dirname, "../dati/prodotto-da-correggere.txt");
  const prodotto = JSON.parse(readFileSync(ingresso, "utf8"));
  controllaProdotto(prodotto);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "prodotto-normalizzato.json"), JSON.stringify(prodotto, null, 2) + "\n", "utf8");
  console.log(`Prodotto valido: ${prodotto.id}`);
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
