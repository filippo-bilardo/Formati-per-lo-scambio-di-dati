// Guida 06: controlla parsing, schema e unicità degli ID del catalogo.
const { readFileSync } = require("node:fs");
const path = require("node:path");

function main() {
  let catalogo;
  let valida;
  try {
    const Ajv2020 = require("ajv/dist/2020");
    const addFormats = require("ajv-formats");
    const ingresso = process.argv[2] ?? path.join(__dirname, "catalogo.json");
    const schema = JSON.parse(readFileSync(path.join(__dirname, "catalogo.schema.json"), "utf8"));
    catalogo = JSON.parse(readFileSync(ingresso, "utf8"));
    const ajv = new Ajv2020({ allErrors: true });
    addFormats(ajv);
    valida = ajv.compile(schema);
  } catch (errore) {
    console.error(`Errore di lettura, parsing o preparazione dello schema: ${errore.message}`);
    return 2;
  }

  if (!valida(catalogo)) {
    for (const errore of valida.errors) {
      console.error(`Schema ${errore.instancePath || "(radice)"}: ${errore.message}`);
    }
    return 1;
  }

  const identificativi = new Set();
  const duplicati = new Set();
  for (const prodotto of catalogo.prodotti) {
    if (identificativi.has(prodotto.id)) duplicati.add(prodotto.id);
    identificativi.add(prodotto.id);
  }
  if (duplicati.size > 0) {
    console.error("ID duplicati: " + [...duplicati].sort().join(", "));
    return 1;
  }

  console.log(`Catalogo valido: ${catalogo.prodotti.length} prodotti.`);
  return 0;
}

process.exitCode = main();
