# 07 — JSON, HTTP e configurazioni

[Guida precedente](06-validazione-con-json-schema.md) · [Indice](README.md) · [Guida successiva](08-strumenti-e-interoperabilita.md)

## Obiettivi

Distinguere formato e trasporto, leggere JSON tramite HTTP e capire il ruolo di JSON nelle API e nelle configurazioni.

## JSON dentro uno scambio HTTP

JSON definisce la rappresentazione dei dati. HTTP definisce uno scambio di richieste e risposte: un client chiede una risorsa a un server, che risponde con uno stato, intestazioni e un eventuale corpo.

```http
GET /catalogo.json HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

Una risposta positiva può iniziare così:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"negozio":"Laboratorio TPSIT","valuta":"EUR","aggiornato_il":"2026-10-18","prodotti":[]}
```

`Accept` esprime il formato desiderato dal client; `Content-Type` descrive il contenuto effettivamente inviato. Il tipo di contenuto standard di JSON è `application/json`. Il testo scambiato è codificato in UTF-8.

Lo stato `200` indica successo, ma non garantisce che i dati rispettino lo schema del catalogo. Una risposta può anche essere HTML: prima del parsing controlla stato e tipo di contenuto.

## Laboratorio locale riproducibile

Per iniziare creando una risposta JSON direttamente dal codice, prova i [tre web service minimi equivalenti in Node.js, PHP e Python](esempi/web-service/README.md), con istruzioni di avvio e confronto delle risposte.

Il laboratorio usa un file statico servito via HTTP. Permette di studiare lo scambio senza dipendere da un'API esterna o da credenziali; non implementa aggiornamenti sul server.

Apri due terminali nella cartella `01-JSON`. Nel primo avvia:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory esempi
```

Il server pubblica il contenuto di `esempi` sull'interfaccia locale. Nel secondo terminale esegui:

```bash
python3 esempi/client_catalogo.py
```

Output atteso:

```text
HTTP 200 | application/json
Negozio: Laboratorio TPSIT
Prodotti ricevuti: 3
```

Per terminare il server premi `Ctrl+C` nel primo terminale. Se la porta è occupata, scegli per esempio `8001` e passa il nuovo URL al client:

```bash
python3 esempi/client_catalogo.py http://127.0.0.1:8001/catalogo.json
```

Il server integrato di Python è uno strumento per il laboratorio locale, non un server da distribuire in produzione.

## Come funziona il client

Il programma completo è in [client_catalogo.py](esempi/client_catalogo.py). Il passaggio centrale è:

```python
import json
from urllib.request import Request, urlopen

richiesta = Request(
    "http://127.0.0.1:8000/catalogo.json",
    headers={"Accept": "application/json"},
)

with urlopen(richiesta, timeout=5) as risposta:
    if risposta.headers.get_content_type() != "application/json":
        raise ValueError("Tipo di contenuto inatteso")
    testo = risposta.read().decode("utf-8")

catalogo = json.loads(testo)
print(catalogo["negozio"])
```

Il programma completo limita anche la dimensione letta a 1 MiB, distingue gli errori HTTP da quelli di connessione e controlla la struttura minima prima di stamparla. Non sostituisce il validatore della guida 06: un oggetto con nome del negozio e array dei prodotti può ancora violare il contratto completo.

## Leggere la risposta in JavaScript

Con il server locale ancora attivo, esegui il client Node.js dalla cartella `01-JSON`:

```bash
node esempi/client_catalogo.js
node esempi/client_catalogo.js http://127.0.0.1:8000/assente.json
```

Il primo comando mostra lo stesso riepilogo del client Python; il secondo segnala HTTP `404`. [client_catalogo.js](esempi/client_catalogo.js) usa `fetch`, un timeout e un limite di lettura di 1 MiB.

Questo esempio essenziale mostra richiesta, controllo della risposta e parsing:

```javascript
async function leggiCatalogo() {
  const risposta = await fetch("http://127.0.0.1:8000/catalogo.json", {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!risposta.ok) throw new Error(`HTTP ${risposta.status}`);
  const tipo = (risposta.headers.get("content-type") ?? "").split(";")[0].trim();
  if (tipo !== "application/json") throw new Error(`Tipo inatteso: ${tipo}`);

  const catalogo = await risposta.json();
  console.log(catalogo.negozio);          // Laboratorio TPSIT
  console.log(catalogo.prodotti.length);  // 3
}

leggiCatalogo().catch(errore => console.error(errore.message));
```

`fetch` non rifiuta automaticamente la promessa per HTTP `404`: occorre controllare `ok` o `status`. `risposta.json()` legge il corpo e ne interpreta il testo JSON; non applica lo schema.

Lo snippet funziona in Node.js. Per provarlo nella console di un browser, apri prima `http://127.0.0.1:8000/`: pagina e richiesta usano così la stessa origine. Da una pagina con origine diversa, il browser può bloccare la lettura per le regole CORS.

## Errori da provare

| Prova | Risultato atteso |
| --- | --- |
| Richiedere `/assente.json` | Errore HTTP `404` |
| Fermare il server e ripetere il comando | Errore di connessione |
| Richiedere `/aggiorna_catalogo.py` | Tipo di contenuto inatteso |
| Richiedere `/catalogo-non-conforme.json` | Ricezione riuscita; i vincoli richiedono il validatore della guida 06 |

Una richiesta riuscita a livello HTTP può quindi consegnare dati inadatti all'applicazione. Tieni distinti trasporto, parsing e validazione.

## API REST e invio di JSON

Un'API può offrire risorse come `/prodotti` e `/prodotti/P001`. Il metodo `GET` può leggerle; `POST`, `PUT` e `PATCH` possono essere usati per operazioni di creazione o modifica, secondo il contratto dell'API.

Per inviare dati, il client serializza un oggetto, codifica il testo in UTF-8 e dichiara `Content-Type: application/json`. Il server deve interpretare e validare il corpo. JSON è frequente nelle API REST, ma REST non impone quel formato.

Il server statico del laboratorio non implementa queste operazioni: salvare un file nel client non aggiorna la risorsa remota. Per esercitare `POST` servirebbe un server con una rotta dedicata e regole di aggiornamento esplicite.

## File di configurazione

Un programma può leggere impostazioni da un documento JSON:

```json
{
  "url_catalogo": "http://127.0.0.1:8000/catalogo.json",
  "timeout_secondi": 5,
  "mostra_esauriti": false
}
```

Il programma deve stabilire quali campi sono obbligatori e cosa fare se mancano o hanno un tipo errato. Per esempio, il timeout deve essere positivo e `mostra_esauriti` deve essere booleano. Uno schema dedicato può formalizzare questi vincoli.

Mantieni le spiegazioni nel documento di accompagnamento: i commenti non sono ammessi nel JSON standard.

Puoi leggere una configurazione in JavaScript e verificare i vincoli prima di usarla:

```javascript
const configurazione = JSON.parse(
  '{"url_catalogo":"http://127.0.0.1:8000/catalogo.json","timeout_secondi":5,"mostra_esauriti":false}'
);

if (typeof configurazione.timeout_secondi !== "number" ||
    !Number.isFinite(configurazione.timeout_secondi) ||
    configurazione.timeout_secondi <= 0) {
  throw new Error("Il timeout deve essere un numero positivo");
}
if (typeof configurazione.mostra_esauriti !== "boolean") {
  throw new Error("mostra_esauriti deve essere booleano");
}
console.log(configurazione.timeout_secondi * 1000); // 5000 millisecondi
```

## Riferimenti

Consulta [`urllib.request`](https://docs.python.org/3/library/urllib.request.html), il [server HTTP di Python](https://docs.python.org/3/library/http.server.html), [`fetch` in Node.js](https://nodejs.org/api/globals.html#fetch), [RFC 9110 per la semantica HTTP](https://www.rfc-editor.org/rfc/rfc9110.html) e [RFC 8259 per `application/json`](https://www.rfc-editor.org/rfc/rfc8259.html#section-11).

[Indice](README.md) · [Prosegui: strumenti e interoperabilità](08-strumenti-e-interoperabilita.md)
