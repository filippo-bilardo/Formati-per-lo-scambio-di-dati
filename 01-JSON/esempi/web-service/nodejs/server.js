const http = require("node:http");

const server = http.createServer((richiesta, risposta) => {
  const dati = { messaggio: "Ciao dal web service!", corso: "JSON" };

  risposta.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  risposta.end(JSON.stringify(dati));
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Web service su http://127.0.0.1:3000/");
});
