# 09 — Esercitazioni e soluzioni

[Guida precedente](08-strumenti-e-interoperabilita.md) · [Indice del capitolo](README.md) · [Guida successiva](10-strumenti-da-cli.md)

## Come lavorare

Svolgi le consegne prima di consultare le soluzioni. Esegui i comandi dalla cartella `01-JSON`, conserva il [catalogo originale](esempi/catalogo.json) e usa file distinti per le prove. Per gli esercizi di validazione attiva l'ambiente virtuale descritto nella guida 06.

Puoi svolgere il percorso in Python oppure in JavaScript con Node.js. Per il validatore JavaScript installa prima le dipendenze con `npm install --prefix esempi`. Le soluzioni mostrano entrambe le alternative; i risultati sui dati del catalogo devono coincidere.

Per ogni esercizio consegna il documento o lo script creato, i comandi usati e un breve resoconto degli esiti. Spiega il motivo degli errori, anche quando il programma li segnala automaticamente.

## Esercizio 1 — Correggere la sintassi

**Ingresso:** questo testo intenzionalmente errato:

```text
{
  id: 'P004',
  "nome": "Cavo USB",
  "prezzo_centesimi": 0990,
  "quantita": 2,
  "etichette": ["usb",],
  "promozione": None
}
```

**Consegna:** correggi il testo e salvalo come `prodotto.json`. Mantieni i numeri come numeri e rappresenta l'assenza di promozione con il letterale corretto.

**Verifica:** `python3 -m json.tool prodotto.json` deve terminare senza errori. Elenca le cinque correzioni necessarie. Questo esercizio verifica la sintassi di un prodotto; lo schema del capitolo richiede invece un catalogo completo.

<details>
<summary>Soluzione commentata</summary>

```json
{
  "id": "P004",
  "nome": "Cavo USB",
  "prezzo_centesimi": 990,
  "quantita": 2,
  "etichette": ["usb"],
  "promozione": null
}
```

Occorrono doppi apici per la chiave `id` e per il suo valore, rimozione dello zero iniziale del prezzo, rimozione della virgola finale dell'array e sostituzione di `None` con `null`.

Puoi controllare il documento anche in Node.js:

```javascript
const { readFileSync } = require("node:fs");
const prodotto = JSON.parse(readFileSync("prodotto.json", "utf8"));
console.log(prodotto.id, prodotto.prezzo_centesimi); // P004 990
```

</details>

## Esercizio 2 — Estendere il modello

**Ingresso:** il catalogo originale e il prodotto corretto nell'esercizio 1.

**Consegna:** aggiungi il nuovo prodotto all'array `prodotti` e salva `catalogo-esteso.json`. Conserva metadati, prodotti iniziali e unità di misura. Spiega perché l'identificativo è una stringa.

**Risultato atteso:** quattro prodotti, identificativi distinti e valore totale del magazzino pari a `46850` centesimi.

**Verifica:** il validatore deve stampare `Catalogo valido: 4 prodotti.` e terminare con codice `0`.

```bash
python esempi/valida_catalogo.py catalogo-esteso.json
```

<details>
<summary>Soluzione commentata</summary>

```python
import json
from pathlib import Path

catalogo = json.loads(Path("esempi/catalogo.json").read_text(encoding="utf-8"))
prodotto = json.loads(Path("prodotto.json").read_text(encoding="utf-8"))
catalogo["prodotti"].append(prodotto)

testo = json.dumps(catalogo, ensure_ascii=False, indent=2, allow_nan=False)
Path("catalogo-esteso.json").write_text(testo + "\n", encoding="utf-8")

totale = sum(p["prezzo_centesimi"] * p["quantita"] for p in catalogo["prodotti"])
print(totale)  # 46850
```

Il nuovo prodotto contribuisce per `990 * 2 = 1980` centesimi. L'identificativo è un codice alfanumerico su cui non si effettuano calcoli.

Soluzione equivalente in Node.js:

```javascript
const { readFileSync, writeFileSync } = require("node:fs");
const catalogo = JSON.parse(readFileSync("esempi/catalogo.json", "utf8"));
const prodotto = JSON.parse(readFileSync("prodotto.json", "utf8"));
catalogo.prodotti.push(prodotto);

writeFileSync("catalogo-esteso-js.json", JSON.stringify(catalogo, null, 2) + "\n", "utf8");
const totale = catalogo.prodotti.reduce(
  (somma, elemento) => somma + elemento.prezzo_centesimi * elemento.quantita,
  0
);
console.log(totale); // 46850
```

Valida il risultato con `node esempi/valida_catalogo.js catalogo-esteso-js.json`.

</details>

## Esercizio 3 — Elaborare e salvare

**Ingresso:** il catalogo originale, non quello esteso.

**Consegna:** scrivi uno script che elenchi gli ID dei prodotti disponibili, calcoli il valore del magazzino, aumenti di uno la quantità di `P001` e salvi `catalogo-aggiornato.json` senza eliminare i prodotti esauriti.

**Risultati attesi:**

| Controllo | Prima dell'aggiornamento | Dopo l'aggiornamento |
| --- | --- | --- |
| ID disponibili | `P001`, `P003` | `P001`, `P003` |
| Quantità di `P001` | `8` | `9` |
| Valore totale in centesimi | `44870` | `48860` |
| Numero di prodotti | `3` | `3` |

**Verifica:** riapri il file salvato con il parser, controlla i risultati e validalo con lo schema. Ripartendo sempre dall'originale, due esecuzioni devono produrre gli stessi dati finali.

<details>
<summary>Soluzione commentata</summary>

Una soluzione completa per filtro, incremento e salvataggio è [aggiorna_catalogo.py](esempi/aggiorna_catalogo.py):

```bash
python3 esempi/aggiorna_catalogo.py --output catalogo-aggiornato.json
python esempi/valida_catalogo.py catalogo-aggiornato.json
```

Per il totale, prima e dopo l'incremento:

```python
totale = sum(p["prezzo_centesimi"] * p["quantita"] for p in catalogo["prodotti"])
print(f"{totale // 100},{totale % 100:02d} EUR")
```

La formattazione usa divisione e resto tra interi, mantenendo esatto il calcolo in centesimi.

Per la soluzione JavaScript usa [aggiorna_catalogo.js](esempi/aggiorna_catalogo.js):

```bash
node esempi/aggiorna_catalogo.js
node esempi/valida_catalogo.js catalogo-aggiornato-js.json
```

Questo frammento Node.js controlla il valore del file salvato:

```javascript
const { readFileSync } = require("node:fs");
const catalogo = JSON.parse(readFileSync("catalogo-aggiornato-js.json", "utf8"));
const totale = catalogo.prodotti.reduce(
  (somma, prodotto) => somma + prodotto.prezzo_centesimi * prodotto.quantita,
  0
);
const euro = Math.floor(totale / 100);
const centesimi = String(totale % 100).padStart(2, "0");
console.log(`${euro},${centesimi} EUR`); // 488,60 EUR
```

</details>

## Esercizio 4 — Capire quale controllo fallisce

**Ingresso:** una nuova copia del catalogo originale per ogni prova. Non accumulare le modifiche.

**Consegna:** applica una sola variazione alla volta e valida il documento. Registra livello dell'errore, percorso segnalato e codice di uscita.

| Variazione | Esito atteso | Livello | Codice |
| --- | --- | --- | --- |
| Virgola dopo l'ultima proprietà | Errore | Sintassi | `2` |
| Prezzo `"3990"` come stringa | Errore | Schema | `1` |
| Quantità `-1` | Errore | Schema | `1` |
| Rimozione di `promozione` | Errore | Schema | `1` |
| `promozione` impostata a `null` | Valido | Tutti superati | `0` |
| Data impostata a `2026-02-30` | Errore | Schema con controllo del formato | `1` |
| Nuovo prodotto con ID `P001` e nome differente | Errore | Applicazione | `1` |
| Chiave `quantita` ripetuta nello stesso prodotto | Errore | Politica del parser sulle chiavi | `2` |
| Quantità impostata al letterale `NaN` | Errore | Parsing, letterale non JSON | `2` |

Per creare la prova con chiave ripetuta devi modificare il testo nell'editor: un dizionario Python non può conservare due valori per la stessa chiave.

Per leggere il codice appena restituito, in Bash esegui `echo $?`; in PowerShell esegui `$LASTEXITCODE`.

<details>
<summary>Soluzione commentata</summary>

Il file [catalogo-non-conforme.json](esempi/catalogo-non-conforme.json) riunisce due violazioni dello schema. Il parser ordinario lo legge, ma il validatore segnala prezzo stringa e quantità negativa:

```bash
python3 -m json.tool esempi/catalogo-non-conforme.json
python esempi/valida_catalogo.py esempi/catalogo-non-conforme.json
```

Per la prova degli ID, duplica un prodotto completo e cambia solo il nome. I singoli prodotti rispettano lo schema, ma il programma segnala `ID duplicati: P001`.

La ripetizione di una chiave non equivale a un errore grammaticale vietato dalla RFC: il nostro parser la rifiuta deliberatamente per evitare interpretazioni ambigue. `NaN`, invece, non appartiene alla sintassi JSON standard.

Confronta i risultati con `node esempi/valida_catalogo.js nome-della-copia.json`. La prova con chiave ripetuta ha un esito differente: `JSON.parse` conserva l'ultimo valore. Se questo rispetta il contratto, la versione JavaScript restituisce `0`, mentre quella Python restituisce `2` per la propria politica sui duplicati. Le altre prove della tabella hanno gli stessi codici nelle due versioni.

Per osservare il codice restituito da un programma in JavaScript puoi usare Node.js:

```javascript
const { spawnSync } = require("node:child_process");
const esito = spawnSync(process.execPath, [
  "esempi/valida_catalogo.js",
  "esempi/catalogo-non-conforme.json",
], { encoding: "utf8" });

console.log(esito.status); // 1
console.log(esito.stderr.trim()); // Messaggi sulle due violazioni dello schema
```

</details>

## Esercizio 5 — Leggere il catalogo via HTTP

**Ingresso:** i file della cartella `esempi` e il client della guida 07.

**Consegna:** avvia il server locale, richiedi il catalogo e ripeti la prova con un percorso inesistente. Ferma poi il server e osserva il nuovo errore.

Nel primo terminale:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory esempi
```

Nel secondo:

```bash
python3 esempi/client_catalogo.py
python3 esempi/client_catalogo.py http://127.0.0.1:8000/assente.json
```

**Risultato atteso:** la prima richiesta mostra HTTP `200`, tipo `application/json` e tre prodotti; la seconda segnala HTTP `404`. Dopo `Ctrl+C` sul server, una richiesta allo stesso indirizzo segnala un errore di connessione. Il client restituisce `0` per il successo e `1` per questi errori.

**Domanda:** perché una risposta HTTP `200` contenente il documento non conforme non dimostra che il catalogo sia valido?

<details>
<summary>Soluzione commentata</summary>

Il client completo è [client_catalogo.py](esempi/client_catalogo.py). Distingue errori HTTP, connessione, tipo di contenuto e dati minimi ricevuti. Il suo controllo strutturale è volutamente limitato: la conformità completa richiede lo schema e la regola sugli identificativi.

Lo stato HTTP descrive l'esito della richiesta. Non sostituisce i controlli di tipo, quantità, date o unicità del catalogo.

Per ripetere le prove con JavaScript usa il client Node.js:

```bash
node esempi/client_catalogo.js
node esempi/client_catalogo.js http://127.0.0.1:8000/assente.json
```

Anche questa versione restituisce `0` per il successo e `1` per gli errori. Il codice che usa `fetch` è spiegato nella guida 07.

</details>

## Criteri di valutazione

Ogni esercizio vale fino a quattro punti: due per il risultato corretto, uno per una verifica ripetibile e uno per la spiegazione. Il totale è di venti punti.

Prima della consegna controlla che i file di lavoro siano distinti dagli originali e che un compagno possa ripetere le prove usando i comandi riportati nel tuo resoconto.

[Indice del capitolo](README.md) · [Prosegui: strumenti da CLI](10-strumenti-da-cli.md) · [Indice del corso](../README.md)
