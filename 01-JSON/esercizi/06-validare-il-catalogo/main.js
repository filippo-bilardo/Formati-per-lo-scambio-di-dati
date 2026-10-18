const { readFileSync } = require("node:fs");
const path = require("node:path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

function trovaErrori(catalogo, schema) {
  // TODO: configura Ajv, valida lo schema e poi controlla gli ID.
  // Restituisci [] sul successo oppure un array di messaggi sugli errori.
  throw new Error("Da completare: trovaErrori");
}

try {
  const ingresso = process.argv[2] ?? path.join(__dirname, "../../esempi/catalogo.json");
  const catalogo = JSON.parse(readFileSync(ingresso, "utf8"));
  const schema = JSON.parse(readFileSync(path.join(__dirname, "../../esempi/catalogo.schema.json"), "utf8"));
  const errori = trovaErrori(catalogo, schema);
  if (errori.length > 0) {
    for (const errore of errori) console.error(errore);
    process.exitCode = 1;
  } else {
    console.log(`Catalogo valido: ${catalogo.prodotti.length} prodotti.`);
  }
} catch (errore) {
  console.error(`Lettura, parsing o preparazione non riusciti: ${errore.message}`);
  process.exitCode = 2;
}
