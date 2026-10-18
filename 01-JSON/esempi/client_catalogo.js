// Guida 07: legge un catalogo JSON via HTTP e ne mostra un riepilogo.
const LIMITE_BYTE = 1024 * 1024;
const indirizzo = process.argv[2] ?? "http://127.0.0.1:8000/catalogo.json";

async function main() {
  const risposta = await fetch(indirizzo, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
  const tipo = (risposta.headers.get("content-type") ?? "").split(";")[0].trim();
  if (tipo !== "application/json") {
    await risposta.body.cancel();
    throw new Error(`Tipo di contenuto inatteso: ${tipo}`);
  }

  // La lettura a blocchi permette di applicare il limite prima del parsing.
  const lettore = risposta.body.getReader();
  const blocchi = [];
  let dimensione = 0;
  while (true) {
    const { done, value } = await lettore.read();
    if (done) break;
    dimensione += value.byteLength;
    if (dimensione > LIMITE_BYTE) {
      await lettore.cancel();
      throw new Error("Il documento supera il limite di 1 MiB");
    }
    blocchi.push(value);
  }

  const testo = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(blocchi));
  const catalogo = JSON.parse(testo);
  if (catalogo === null || typeof catalogo !== "object" || Array.isArray(catalogo) ||
      typeof catalogo.negozio !== "string" || !Array.isArray(catalogo.prodotti)) {
    throw new Error("Struttura minima del catalogo non valida");
  }

  console.log(`HTTP ${risposta.status} | ${tipo}`);
  console.log(`Negozio: ${catalogo.negozio}`);
  console.log(`Prodotti ricevuti: ${catalogo.prodotti.length}`);
}

main().catch(errore => {
  console.error(`Errore: ${errore.message}`);
  process.exitCode = 1;
});
