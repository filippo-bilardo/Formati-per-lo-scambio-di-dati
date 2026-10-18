const { writeFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

async function scaricaCatalogo(url) {
  // TODO: fetch con timeout, controllo HTTP, Content-Type, parsing e struttura.
  // Restituisci il catalogo; lancia Error per una risposta non accettabile.
  throw new Error("Da completare: scaricaCatalogo");
}

async function main() {
  const url = process.argv[2] ?? "http://127.0.0.1:8000/catalogo";
  const catalogo = await scaricaCatalogo(url);
  const output = path.join(__dirname, "output");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "catalogo-http.json"), JSON.stringify(catalogo, null, 2) + "\n", "utf8");
  console.log(`Negozio: ${catalogo.negozio}`);
  console.log(`Prodotti ricevuti: ${catalogo.prodotti.length}`);
}

main().catch(errore => {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
});
