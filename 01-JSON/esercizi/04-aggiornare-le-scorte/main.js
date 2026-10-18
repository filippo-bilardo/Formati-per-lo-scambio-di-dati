const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

function riassortisci(catalogo, id, incrementoTesto) {
  // TODO: valida il parametro, trova il prodotto e aggiorna solo la quantità.
  // Un errore deve essere rilevato prima di salvare il documento.
  throw new Error("Da completare: riassortisci");
}

try {
  const catalogo = JSON.parse(readFileSync(path.join(__dirname, "../../esempi/catalogo.json"), "utf8"));
  const aggiornato = riassortisci(catalogo, process.argv[2] ?? "P001", process.argv[3] ?? "1");
  const testo = JSON.stringify(aggiornato, null, 2);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "catalogo-aggiornato.json"), testo + "\n", "utf8");
  console.log("Catalogo salvato in output/catalogo-aggiornato.json");
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
