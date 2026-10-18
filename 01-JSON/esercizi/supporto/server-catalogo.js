// Server completo di supporto all'esercizio 07; non richiede pacchetti npm.
const http = require("node:http");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const porta = Number(process.argv[2] ?? "8000");
if (!Number.isInteger(porta) || porta < 0 || porta > 65535) {
  console.error("La porta deve essere un intero tra 0 e 65535.");
  process.exit(1);
}

let catalogo;
try {
  const file = path.join(__dirname, "../../esempi/catalogo.json");
  catalogo = JSON.stringify(JSON.parse(readFileSync(file, "utf8")));
} catch (errore) {
  console.error(`Impossibile caricare il catalogo: ${errore.message}`);
  process.exit(1);
}

const server = http.createServer((richiesta, risposta) => {
  const invia = (stato, corpo, tipo = "application/json") => {
    risposta.writeHead(stato, { "Content-Type": tipo });
    risposta.end(corpo);
  };

  if (richiesta.method !== "GET") {
    risposta.setHeader("Allow", "GET");
    return invia(405, JSON.stringify({ errore: "Metodo non consentito" }));
  }

  const indirizzo = new URL(richiesta.url, "http://127.0.0.1");
  switch (indirizzo.pathname) {
    case "/catalogo":
      return invia(200, catalogo);
    case "/non-json":
      return invia(200, "Questa risposta non contiene JSON.", "text/plain; charset=utf-8");
    case "/json-malformato":
      return invia(200, '{"prodotti":[}');
    case "/errore":
      return invia(500, JSON.stringify({ errore: "Errore simulato del laboratorio" }));
    default:
      return invia(404, JSON.stringify({ errore: "Risorsa inesistente" }));
  }
});

server.on("error", errore => {
  console.error(`Errore del server: ${errore.message}`);
  process.exitCode = 1;
});
server.listen(porta, "127.0.0.1", () => {
  console.log(`Server su http://127.0.0.1:${server.address().port}`);
  console.log("Interrompi con Ctrl+C.");
});
