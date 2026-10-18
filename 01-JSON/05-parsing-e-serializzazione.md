# 05 — Parsing e serializzazione

[Guida precedente](04-oggetti-array-e-modellazione.md) · [Indice](README.md) · [Guida successiva](06-validazione-con-json-schema.md)

## Obiettivi

Convertire testo e strutture dati, leggere e scrivere file e realizzare una trasformazione ripetibile del catalogo.

## Da testo a dati e viceversa

Il parsing interpreta il testo; la serializzazione produce il testo a partire dai dati. In Python le operazioni fondamentali del modulo `json` sono:

| Funzione | Ingresso | Risultato |
| --- | --- | --- |
| `json.loads(testo)` | Stringa JSON | Valore Python |
| `json.dumps(dati)` | Valore Python | Stringa JSON |
| `json.load(file)` | File aperto in lettura | Valore Python |
| `json.dump(dati, file)` | Dati e file aperto in scrittura | Scrittura del documento |

La `s` finale di `loads` e `dumps` aiuta a ricordare la versione per stringhe.

```python
import json

testo = '{"id": "P001", "quantita": 8, "promozione": null}'
prodotto = json.loads(testo)
prodotto["quantita"] += 1

nuovo_testo = json.dumps(prodotto, ensure_ascii=False, indent=2, allow_nan=False)
print(nuovo_testo)
```

Il risultato contiene quantità `9` e `promozione: null`. In memoria la promozione vale `None`: il serializzatore applica la conversione.

Non usare `eval()` per leggere JSON. Serve un parser del formato, non l'esecuzione del contenuto come codice.

## Leggere un file

Esegui gli esempi dalla cartella `01-JSON`:

```python
import json

with open("esempi/catalogo.json", encoding="utf-8") as file:
    catalogo = json.load(file)

print(catalogo["negozio"])
print(len(catalogo["prodotti"]))
```

L'output è `Laboratorio TPSIT` seguito da `3`. Il blocco `with` chiude il file anche se si verifica un errore.

Per filtrare i prodotti con quantità positiva:

```python
disponibili = [p for p in catalogo["prodotti"] if p["quantita"] > 0]
print([p["id"] for p in disponibili])
```

Il risultato è `['P001', 'P003']`. La selezione non modifica l'array originale, ma gli oggetti selezionati sono gli stessi: modificarne una proprietà cambia anche il prodotto presente in `catalogo`. Se vuoi dati completamente indipendenti, valuta una copia profonda.

## Salvare una copia aggiornata

Qui aggiungiamo una unità alla quantità del primo prodotto e salviamo il catalogo completo:

```python
catalogo["prodotti"][0]["quantita"] += 1

with open("catalogo-aggiornato.json", "w", encoding="utf-8") as file:
    json.dump(catalogo, file, ensure_ascii=False, indent=2, allow_nan=False)
    file.write("\n")
```

`ensure_ascii=False` mantiene leggibili gli accenti; `encoding="utf-8"` stabilisce la codifica del file. `indent=2` migliora la lettura e `allow_nan=False` impedisce di generare i letterali non standard `NaN` e `Infinity`.

La modalità `w` crea il file o ne sostituisce il contenuto se esiste già. Usa quindi un nome di output diverso dall'originale. Per produrre un documento compatto puoi usare `separators=(",", ":")` senza indentazione.

## Programma completo

Il file [aggiorna_catalogo.py](esempi/aggiorna_catalogo.py) riunisce lettura, selezione, aggiornamento e salvataggio. Il filtro serve a stampare i prodotti disponibili; il documento salvato conserva tutti i prodotti.

```bash
python3 esempi/aggiorna_catalogo.py --output catalogo-aggiornato.json
```

Output atteso:

```text
Disponibili: P001, P003
Quantita P001 aggiornata: 9
Salvato: catalogo-aggiornato.json
```

Il programma parte ogni volta dal catalogo originale: ripetere il comando produce ancora quantità `9`. Per elaborare un altro file puoi indicarlo come argomento:

```bash
python3 esempi/aggiorna_catalogo.py catalogo-aggiornato.json --output catalogo-secondo-aggiornamento.json
```

In questo caso la quantità diventa `10`. Lo script è un esempio di trasformazione su dati che rispettano il modello; il controllo completo del contratto è trattato nella guida 06.

## Gestire gli errori

```python
import json

try:
    with open("esempi/catalogo.json", encoding="utf-8") as file:
        dati = json.load(file)
except json.JSONDecodeError as errore:
    print(f"JSON errato alla riga {errore.lineno}, colonna {errore.colno}")
except UnicodeDecodeError:
    print("Il file non è codificato correttamente in UTF-8")
except OSError as errore:
    print(f"Impossibile leggere il file: {errore}")
else:
    print("Parsing completato")
```

Un parsing riuscito non garantisce che `dati` sia un catalogo: potrebbe essere il numero `42` o un oggetto senza `prodotti`. Lo schema controllerà questa struttura. La guida 08 approfondisce anche le estensioni del parser Python.

## Confronto con JavaScript

Nella console di un browser o in Node.js:

```javascript
const testo = '{"id":"P001","quantita":8,"promozione":null}';
const prodotto = JSON.parse(testo);
prodotto.quantita += 1;
console.log(JSON.stringify(prodotto, null, 2));
```

`JSON.parse` interpreta il testo e può lanciare `SyntaxError`. `JSON.stringify` serializza i dati; il terzo argomento sceglie l'indentazione. Usa queste funzioni anche quando l'oggetto di partenza sembra facile da ricostruire concatenando stringhe: il serializzatore gestisce correttamente virgolette ed escape.

### Leggere e salvare file con Node.js

Il programma [aggiorna_catalogo.js](esempi/aggiorna_catalogo.js) esegue la stessa trasformazione della versione Python. Dalla cartella `01-JSON`:

```bash
node esempi/aggiorna_catalogo.js
```

Output atteso:

```text
Disponibili: P001, P003
Quantita P001 aggiornata: 9
Salvato: catalogo-aggiornato-js.json
```

Il nucleo della lettura e scrittura, da eseguire in Node.js dalla stessa cartella, è:

```javascript
const { readFileSync, writeFileSync } = require("node:fs");

const catalogo = JSON.parse(readFileSync("esempi/catalogo.json", "utf8"));
const prodotto = catalogo.prodotti.find(elemento => elemento.id === "P001");
if (!prodotto) throw new Error("Prodotto P001 assente");
prodotto.quantita += 1;

const testo = JSON.stringify(catalogo, null, 2);
writeFileSync("catalogo-aggiornato-js.json", testo + "\n", "utf8");
```

Per elaborare un altro file con lo script completo, passa nell'ordine ingresso e uscita:

```bash
node esempi/aggiorna_catalogo.js catalogo-aggiornato-js.json catalogo-secondo-aggiornamento-js.json
```

Come nella versione Python, il file salvato conserva tutti i prodotti. Lo script completo gestisce gli errori di lettura e parsing e impedisce di usare lo stesso percorso per ingresso e uscita. La guida 08 spiega i casi in cui `JSON.stringify` può convertire o omettere valori del linguaggio.

## Esercizio rapido

Calcola il valore del magazzino come somma di `prezzo_centesimi * quantita`, usando il catalogo originale.

**Verifica:** `44870` centesimi, cioè 448,70 euro. Dopo l'aggiornamento di `P001` il totale deve essere `48860` centesimi.

## Riferimenti

Consulta le API del [modulo `json`](https://docs.python.org/3/library/json.html), il tutorial Python su [lettura e scrittura dei file](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files) e la [specifica ECMAScript dell'oggetto `JSON`](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object).

[Indice](README.md) · [Prosegui: validazione con JSON Schema](06-validazione-con-json-schema.md)
