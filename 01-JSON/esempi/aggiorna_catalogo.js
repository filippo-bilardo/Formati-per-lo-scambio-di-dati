// Guida 05: legge un catalogo, incrementa P001 e salva una copia.
const { readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");

const ingresso = process.argv[2] ?? path.join(__dirname, "catalogo.json");
const uscita = process.argv[3] ?? "catalogo-aggiornato-js.json";

try {
  if (path.resolve(ingresso) === path.resolve(uscita)) {
    throw new Error("Scegli un file di output diverso dall'originale");
  }
  // Questo esempio presuppone dati che rispettano il modello del catalogo.
  const catalogo = JSON.parse(readFileSync(ingresso, "utf8"));
  const disponibili = catalogo.prodotti.filter(prodotto => prodotto.quantita > 0);
  const prodotto = catalogo.prodotti.find(elemento => elemento.id === "P001");
  if (!prodotto) throw new Error("Il catalogo non contiene il prodotto P001");
  prodotto.quantita += 1;

  const testo = JSON.stringify(catalogo, null, 2);
  writeFileSync(uscita, testo + "\n", "utf8");
  console.log("Disponibili: " + disponibili.map(elemento => elemento.id).join(", "));
  console.log(`Quantita P001 aggiornata: ${prodotto.quantita}`);
  console.log(`Salvato: ${uscita}`);
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
