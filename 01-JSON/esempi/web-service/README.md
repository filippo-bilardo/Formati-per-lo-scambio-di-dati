# Un web service semplicissimo: Node.js, PHP e Python

I tre esempi restituiscono lo stesso oggetto JSON quando apri l'indirizzo del servizio. Sono programmi completi, pronti da eseguire, senza librerie esterne.

La risposta ha stato HTTP `200` e intestazione `Content-Type: application/json; charset=utf-8`:

```json
{
  "messaggio": "Ciao dal web service!",
  "corso": "JSON"
}
```

La visualizzazione può essere compatta: spazi e indentazione non cambiano i dati.

## Preparazione

Servono Node.js per il primo esempio, PHP con interfaccia CLI per il secondo e Python 3 per il terzo. I comandi seguenti partono dalla cartella `01-JSON`; dalla radice del repository entra con:

```bash
cd 01-JSON
```

## Esempio 1 — Node.js

Apri [nodejs/server.js](nodejs/server.js). Il programma crea un server HTTP, prepara un oggetto JavaScript e lo converte in testo JSON con `JSON.stringify`.

Avvio:

```bash
node esempi/web-service/nodejs/server.js
```

Il terminale mostra `Web service su http://127.0.0.1:3000/`. Apri questo indirizzo nel browser oppure, in un secondo terminale dalla stessa cartella, esegui:

```bash
curl -i http://127.0.0.1:3000/
```

`createServer` esegue la funzione indicata per ogni richiesta. `writeHead` imposta stato e intestazioni; `end` invia il corpo e conclude la risposta. Il processo resta in ascolto per le richieste successive.

## Esempio 2 — PHP

Apri [php/index.php](php/index.php). Il programma prepara gli stessi dati in un array associativo e li converte in JSON con `json_encode`.

Avvia il server integrato di PHP:

```bash
php -S 127.0.0.1:3001 -t esempi/web-service/php
```

Apri `http://127.0.0.1:3001/` nel browser oppure esegui nel secondo terminale:

```bash
curl -i http://127.0.0.1:3001/
```

Il server esegue `index.php` quando richiedi la cartella principale. `header` dichiara il formato della risposta; `echo` invia il testo prodotto da `json_encode`. Le istruzioni PHP vengono eseguite a ogni richiesta.

## Esempio 3 — Python

Apri [python/server.py](python/server.py). Il programma usa soltanto `http.server` e `json`, inclusi nella libreria standard.

Avvio:

```bash
python3 esempi/web-service/python/server.py
```

Apri `http://127.0.0.1:3002/` nel browser oppure esegui nel secondo terminale:

```bash
curl -i http://127.0.0.1:3002/
```

`HTTPServer` riceve le richieste; la classe `Gestore` definisce come rispondere. Il metodo `do_GET` viene chiamato per le richieste `GET` e prepara lo stesso dizionario di dati degli altri esempi.

`json.dumps` produce una stringa JSON; `encode("utf-8")` la trasforma nei byte inviati da `wfile.write`. `send_response` imposta lo stato HTTP, `send_header` aggiunge le intestazioni ed `end_headers` separa le intestazioni dal corpo. `Content-Length` indica la lunghezza in byte del corpo.

In PowerShell puoi usare `curl.exe` al posto di `curl` se quest'ultimo è un alias. Il comando Python può essere `py` o `python` invece di `python3`.

Per fermare ciascun server premi `Ctrl+C` nel suo terminale. Le porte `3000`, `3001` e `3002` devono essere libere: per PHP puoi scegliere un'altra porta nel comando; per Node.js e Python cambia il numero nel codice e aggiorna il messaggio nel terminale. I server integrati sono usati qui per il laboratorio locale.

## Confronto tra i tre programmi

| Operazione | Node.js | PHP | Python |
| --- | --- | --- | --- |
| Preparare i dati | Oggetto JavaScript | Array associativo | Dizionario |
| Convertire in testo JSON | `JSON.stringify(dati)` | `json_encode($dati, ...)` | `json.dumps(dati, ...)` |
| Dichiarare il formato | `risposta.writeHead(...)` | `header(...)` | `self.send_header(...)` |
| Inviare il corpo | `risposta.end(...)` | `echo ...` | `self.wfile.write(...)` |
| Avviare il servizio | Il programma crea e avvia il server | Il server PHP esegue lo script | Il programma crea e avvia il server |

## Leggere la risposta con JavaScript

Con i tre servizi attivi, avvia la console Node.js con `node` e incolla:

```javascript
async function provaServizi() {
  for (const url of ["http://127.0.0.1:3000/", "http://127.0.0.1:3001/", "http://127.0.0.1:3002/"]) {
    const risposta = await fetch(url);
    if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
    const dati = await risposta.json();
    console.log(url, dati.messaggio, dati.corso);
  }
}

provaServizi().catch(console.error);
```

Per tutti e tre gli indirizzi devono comparire il messaggio `Ciao dal web service!` e il valore `JSON`. Il client riceve gli stessi dati anche se i servizi sono scritti in linguaggi diversi.

## Piccola prova

Aggiungi ai tre programmi il campo booleano `attivo` con valore vero: `true` in JavaScript e PHP, `True` in Python. Riprova le richieste e verifica che la risposta contenga sempre `"attivo": true`, senza virgolette intorno a `true`. Dopo una modifica ai file Node.js e Python riavvia il relativo processo; il server PHP rilegge lo script alla richiesta successiva.

## Riferimenti

- [Server HTTP di Node.js](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener).
- [Server integrato di PHP](https://www.php.net/manual/en/features.commandline.webserver.php).
- [Funzione PHP `json_encode`](https://www.php.net/manual/en/function.json-encode.php).
- [Server HTTP di Python](https://docs.python.org/3/library/http.server.html).
- [Modulo `json` di Python](https://docs.python.org/3/library/json.html).

[Torna al capitolo](../../README.md) · [Guida 07: JSON e HTTP](../../07-json-http-e-configurazioni.md)
