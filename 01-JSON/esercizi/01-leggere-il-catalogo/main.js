const { readFileSync } = require("node:fs");
const path = require("node:path");

function creaRiepilogo(catalogo) {
  // TODO: restituisci l'oggetto con i sei campi richiesti nella consegna.
  // Per la promozione, separa presenza della proprietà e confronto con null.
  throw new Error("Da completare: creaRiepilogo");
}

try {
  const ingresso = process.argv[2] ?? path.join(__dirname, "../../esempi/catalogo.json");
  const catalogo = JSON.parse(readFileSync(ingresso, "utf8"));
  console.log(JSON.stringify(creaRiepilogo(catalogo), null, 2));
} catch (errore) {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
}
