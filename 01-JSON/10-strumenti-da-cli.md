# 10 — Strumenti da CLI

[Guida precedente](09-esercitazioni-e-soluzioni.md) · [Indice del capitolo](README.md)

## Obiettivi e ambiente

La CLI (*Command Line Interface*) permette di lavorare dal terminale. In questa guida userai strumenti per leggere, interrogare, trasformare e validare JSON, poi scaricherai il catalogo via HTTP.

I comandi sono scritti per Bash su Linux, macOS o WSL e vanno eseguiti dalla cartella `01-JSON`. In PowerShell alcuni apici e reindirizzamenti richiedono adattamenti; per richiamare il programma curl usa `curl.exe` se `curl` è un alias della shell.

## Strumenti disponibili

| Strumento | Quando usarlo | Dipendenze del laboratorio |
| --- | --- | --- |
| `python3 -m json.tool` | Formattare e leggere un file | Python |
| `node` | Eseguire trasformazioni JavaScript | Node.js 22 o successivo |
| `jq` | Estrarre campi e filtrare dati con espressioni brevi | Installazione di jq |
| `curl` | Eseguire richieste HTTP e salvare il corpo | Installazione di curl |
| `valida_catalogo.py` | Controllare il contratto con Python | Ambiente virtuale e `jsonschema` |
| `valida_catalogo.js` | Controllare il contratto con JavaScript | Node.js, Ajv e ajv-formats |

Controlla cosa è installato:

```bash
python3 --version
node --version
npm --version
jq --version
curl --version
```

Su Debian/Ubuntu, se mancano jq e curl, puoi installarli con `sudo apt install jq curl`; su macOS con Homebrew, con `brew install jq curl`. Per altri sistemi consulta le pagine ufficiali di [jq](https://jqlang.org/download/) e [curl](https://curl.se/download.html). Per Node.js consulta la [pagina di installazione](https://nodejs.org/en/download).

Per i validatori segui la guida 06: attiva l'ambiente virtuale Python oppure esegui `npm install --prefix esempi` per le dipendenze JavaScript. Gli altri esempi Node.js non richiedono pacchetti npm.

## Formattare e controllare il parsing

Con Python:

```bash
python3 -m json.tool esempi/catalogo.json
python3 -m json.tool esempi/catalogo.json catalogo-formattato.json
```

Il primo comando stampa il documento, il secondo scrive un file distinto. Questi comandi non applicano lo schema e accettano le estensioni Python descritte nella guida 08.

Con jq:

```bash
jq '.' esempi/catalogo.json
jq -c '.' esempi/catalogo.json
jq empty esempi/catalogo.json
```

`.` restituisce il contenuto, `-c` lo rende compatto ed `empty` non stampa risultati. `jq` può leggere una sequenza di valori JSON, quindi `jq empty` non dimostra che il file contenga un solo documento. Per richiedere un solo valore principale:

```bash
jq -e -s 'length == 1' esempi/catalogo.json
```

`-s` raccoglie i valori letti in un array; `-e` rende il codice di uscita dipendente dal risultato. Anche questo controllo non sostituisce lo schema del catalogo.

## Estrarre campi e filtrare con jq

```bash
jq -r '.negozio' esempi/catalogo.json
jq '.prodotti | length' esempi/catalogo.json
jq -r '.prodotti[] | select(.quantita > 0) | .id' esempi/catalogo.json
```

I risultati sono rispettivamente `Laboratorio TPSIT`, `3` e gli ID `P001`, `P003` su righe separate. `-r` stampa le stringhe senza le virgolette JSON. Il simbolo `|` dentro gli apici collega filtri jq; la shell lo passa come parte dell'espressione.

Per creare un array con i soli prodotti disponibili o calcolare il valore del magazzino:

```bash
jq '[.prodotti[] | select(.quantita > 0)]' esempi/catalogo.json
jq '[.prodotti[] | .prezzo_centesimi * .quantita] | add // 0' esempi/catalogo.json
```

Il totale atteso è `44870` centesimi. `// 0` restituisce zero quando la somma dell'array vuoto produce `null`.

Per costruire un nuovo documento:

```bash
jq '.prodotti |= map(if .id == "P001" then .quantita += 1 else . end)' esempi/catalogo.json > catalogo-jq.json
```

La quantità di `P001` diventa `9`; gli altri prodotti restano nel catalogo. La shell crea o sostituisce `catalogo-jq.json`. Usa sempre un percorso di uscita diverso dall'ingresso: il reindirizzamento `>` apre e tronca l'output prima che il programma legga i dati.

## Gli stessi filtri in JavaScript

Per una lettura rapida dalla CLI puoi eseguire un'espressione Node.js:

```bash
node -e 'const fs = require("node:fs"); const dati = JSON.parse(fs.readFileSync("esempi/catalogo.json", "utf8")); console.log(dati.negozio);'
```

Quando l'elaborazione cresce, usa un file `.js` o la console Node.js avviata con `node`:

```javascript
const { readFileSync } = require("node:fs");
const catalogo = JSON.parse(readFileSync("esempi/catalogo.json", "utf8"));
const disponibili = catalogo.prodotti.filter(prodotto => prodotto.quantita > 0);
const totale = catalogo.prodotti.reduce(
  (somma, prodotto) => somma + prodotto.prezzo_centesimi * prodotto.quantita,
  0
);

console.log(disponibili.map(prodotto => prodotto.id)); // [ 'P001', 'P003' ]
console.log(totale); // 44870
```

Per una trasformazione già pronta usa `node esempi/aggiorna_catalogo.js`; per verificare la sintassi di un programma JavaScript senza eseguirlo usa `node --check esempi/aggiorna_catalogo.js`. Quest'ultimo controlla il codice JavaScript, non i dati JSON letti dal programma.

## Validare il contratto

Dopo aver creato `catalogo-jq.json`, verifica il risultato con uno dei validatori:

```bash
python esempi/valida_catalogo.py catalogo-jq.json
node esempi/valida_catalogo.js catalogo-jq.json
```

Entrambi devono stampare `Catalogo valido: 3 prodotti.`. Per osservare il rifiuto di dati sintatticamente corretti:

```bash
node esempi/valida_catalogo.js esempi/catalogo-non-conforme.json
```

Il risultato è un errore di schema con codice `1`. Un filtro jq che restituisce qualche campo non dimostra che tutti i tipi e i vincoli siano rispettati.

## Richieste HTTP con curl

Nel primo terminale avvia il server della guida 07:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory esempi
```

Nel secondo terminale scarica il corpo della risposta e poi controllalo:

```bash
curl --fail --show-error --silent --max-time 5 -H 'Accept: application/json' --output catalogo-http.json http://127.0.0.1:8000/catalogo.json
node esempi/valida_catalogo.js catalogo-http.json
```

`--fail` fa fallire il comando per errori HTTP come `404`; `--silent` nasconde l'indicatore di avanzamento e `--show-error` mantiene visibili i messaggi di errore. `--max-time` limita la durata dell'operazione a cinque secondi.

`Accept` è una richiesta al server, non una garanzia sul contenuto. Per vedere le intestazioni della risorsa locale:

```bash
curl --head --fail --show-error --silent http://127.0.0.1:8000/catalogo.json
```

La risposta deve indicare `Content-Type: application/json`. `--head` invia una richiesta `HEAD`: il server del laboratorio la supporta. Non salvare l'output di `curl -i` come se fosse un documento JSON, perché includerebbe anche le intestazioni HTTP.

## Interpretare i codici di uscita

Il codice `0` segnala normalmente successo; gli altri codici dipendono dal programma. Subito dopo il comando, in Bash puoi leggerlo con:

```bash
echo $?
```

In PowerShell usa `$LASTEXITCODE`.

| Comando | Interpretazione utile |
| --- | --- |
| Validatori del corso | `0`: valido; `1`: violazione del contratto; `2`: lettura/parsing/schema non valido |
| `jq -e` | `0` se l'ultimo risultato non è `false` o `null`; `1` se lo è |
| `curl --fail` | `0` per successo del trasferimento; `22` per errore HTTP rilevato da `--fail` |
| Client Node.js del corso | `0`: successo; `1`: errore di richiesta o dati |

`jq -e` può quindi fallire su `false` o `null` anche se sono valori JSON validi. Per gli altri codici e le condizioni particolari consulta i manuali dei singoli strumenti.

Se unisci più comandi con pipe Bash, abilita `set -o pipefail` per non nascondere il fallimento di un comando precedente all'ultimo. Nel laboratorio abbiamo separato download e validazione per poter controllare ciascun esito.

## Esercizio

Scarica il catalogo, estrai con jq gli ID disponibili, aumenta la quantità di `P001` in una copia e valida il nuovo file. Conferma il totale anche con lo snippet JavaScript.

**Risultati attesi:** `P001` e `P003`, quantità aggiornata `9`, tre prodotti, totale `48860` centesimi e validatore con codice `0`.

## Riferimenti

- [Manuale di jq](https://jqlang.org/manual/).
- [Manuale di curl](https://curl.se/docs/manpage.html).
- [CLI del modulo Python `json`](https://docs.python.org/3/library/json.html#command-line-interface).
- [Opzioni CLI di Node.js](https://nodejs.org/api/cli.html).
- [Guida 06: validazione e installazione delle librerie](06-validazione-con-json-schema.md).

[Torna all'indice del capitolo](README.md) · [Torna all'indice del corso](../README.md)
