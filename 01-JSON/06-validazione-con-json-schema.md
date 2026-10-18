# 06 — Validazione con JSON Schema

[Guida precedente](05-parsing-e-serializzazione.md) · [Indice](README.md) · [Guida successiva](07-json-http-e-configurazioni.md)

## Obiettivi

Definire il contratto del catalogo con JSON Schema e distinguere validità sintattica, conformità strutturale e correttezza applicativa.

## Tre livelli di controllo

| Livello | Domanda | Esempio di errore |
| --- | --- | --- |
| Sintassi | Il testo rispetta la grammatica JSON? | Virgola finale |
| Schema | Il valore ha struttura, tipi e vincoli previsti? | Quantità negativa o proprietà obbligatoria assente |
| Applicazione | I dati rispettano le regole del problema? | Due prodotti differenti con lo stesso identificativo |

JSON Schema è un linguaggio per descrivere e validare dati JSON. Anche lo schema è un documento JSON. Non serve per trasformare automaticamente un prezzo stringa in numero o per correggere i dati.

## Un primo schema di prodotto

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": {"type": "string", "minLength": 1},
    "quantita": {"type": "integer", "minimum": 0},
    "promozione": {"type": ["string", "null"], "minLength": 1}
  },
  "required": ["id", "quantita", "promozione"],
  "additionalProperties": false
}
```

`$schema` dichiara il dialetto usato: qui **Draft 2020-12**. I validatori devono supportarlo; non basta caricare lo schema con un parser JSON.

Questo primo schema accetta `{"id": "P001", "quantita": 8, "promozione": null}`. È una semplificazione: il contratto completo è nel file [catalogo.schema.json](esempi/catalogo.schema.json).

## Parole chiave essenziali

| Parola chiave | Funzione nel nostro modello |
| --- | --- |
| `type` | Dichiara il tipo atteso, anche con alternative |
| `properties` | Associa i nomi delle proprietà ai relativi schemi |
| `required` | Elenca le proprietà che devono esistere |
| `additionalProperties: false` | Rifiuta proprietà non dichiarate nell'oggetto |
| `minimum` | Impone un limite numerico inferiore incluso |
| `minLength` / `maxLength` | Impongono limiti alla lunghezza di una stringa |
| `pattern` | Applica un'espressione regolare a una stringa |
| `const` | Richiede un valore esatto, per esempio `EUR` |
| `items` | Definisce lo schema degli elementi di un array |
| `uniqueItems` | Impedisce valori ripetuti nell'array |
| `$defs` / `$ref` | Definiscono e riutilizzano sottoschemi |

`properties` non rende un campo obbligatorio: serve `required`. Viceversa un campo obbligatorio può ammettere `null`, come `promozione`. Il vincolo `minLength` si applica alle stringhe e lascia quindi valido `null` nell'esempio.

Lo schema usa `integer` per prezzi e quantità: in JSON Schema significa un numero senza parte frazionaria, anche se scritto come `8.0`. Il parser Python può comunque rappresentare quest'ultimo come `float`: tipo dello schema e tipo in memoria sono concetti distinti.

## Lo schema completo

Apri [catalogo.schema.json](esempi/catalogo.schema.json) e segui i riferimenti:

1. l'oggetto principale richiede i quattro metadati/campi del catalogo;
2. `prodotti.items` richiama `#/$defs/prodotto`;
3. il sottoschema del prodotto impone i sei campi concordati;
4. `etichette` richiede stringhe non vuote e non ripetute;
5. `aggiornato_il` usa `format: "date"`.

Nel Draft 2020-12 il controllo di `format` non va dato per scontato. Nello script attiviamo esplicitamente `FormatChecker()` per verificare anche date impossibili come `2026-02-30`.

`additionalProperties: false` è applicato sia alla radice sia al prodotto: la regola riguarda ciascun oggetto in cui è dichiarata, non si propaga automaticamente a tutti i livelli.

## Preparare l'ambiente

Dalla cartella `01-JSON`, su Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r esempi/requirements.txt
```

Su Windows PowerShell, al posto dei primi due comandi:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Il file [requirements.txt](esempi/requirements.txt) richiede `jsonschema>=4.18,<5`, con supporto al dialetto scelto. Dopo l'attivazione usa `python` per i comandi di questa guida. Per uscire dall'ambiente esegui `deactivate`.

## Validare e interpretare l'esito

```bash
python esempi/valida_catalogo.py esempi/catalogo.json
```

Output atteso:

```text
Catalogo valido: 3 prodotti.
```

Ora prova il documento intenzionalmente non conforme:

```bash
python esempi/valida_catalogo.py esempi/catalogo-non-conforme.json
```

Il documento ha sintassi corretta, ma il validatore segnala due errori: `/prodotti/0/prezzo_centesimi` è una stringa e `/prodotti/0/quantita` è negativo. Il testo esatto dei messaggi dipende dalla versione della libreria.

Lo script usa questi codici di uscita:

| Codice | Significato |
| --- | --- |
| `0` | Tutti i controlli sono superati |
| `1` | Documento non conforme allo schema o alle regole applicative |
| `2` | File illeggibile, JSON errato o schema non valido |

## Il controllo applicativo

`uniqueItems: true` confronta gli elementi interi di un array. Non basta a imporre che due prodotti con nomi o prezzi diversi abbiano `id` differenti.

Dopo la validazione dello schema, [valida_catalogo.py](esempi/valida_catalogo.py) raccoglie gli identificativi in un insieme e segnala quelli ripetuti. Prova a duplicare un prodotto cambiandone soltanto il nome: lo schema passa, il controllo applicativo fallisce.

Il validatore Python verifica inoltre chiavi JSON duplicate e letterali non standard prima di applicare lo schema. I relativi hook del parser sono spiegati nella guida 08.

## Validare con JavaScript e Ajv

Per usare il validatore JavaScript servono Node.js e le dipendenze elencate in [package.json](esempi/package.json). Dalla cartella `01-JSON`:

```bash
npm install --prefix esempi
node esempi/valida_catalogo.js esempi/catalogo.json
node esempi/valida_catalogo.js esempi/catalogo-non-conforme.json
```

La prima validazione stampa `Catalogo valido: 3 prodotti.`; la seconda segnala prezzo e quantità non conformi. [valida_catalogo.js](esempi/valida_catalogo.js) usa gli stessi codici `0`, `1` e `2` della versione Python e controlla anche gli ID duplicati.

Il passaggio centrale del programma è questo. Per provare lo snippet in Node.js, entra prima nella cartella `esempi`, dove sono installate le librerie:

```javascript
const { readFileSync } = require("node:fs");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const schema = JSON.parse(readFileSync("catalogo.schema.json", "utf8"));
const catalogo = JSON.parse(readFileSync("catalogo.json", "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const valida = ajv.compile(schema);
console.log(valida(catalogo)); // true
console.log(valida.errors);   // null
```

L'importazione `ajv/dist/2020` seleziona il dialetto del nostro schema. `ajv-formats` aggiunge il controllo del formato `date`; `allErrors` raccoglie più errori in una validazione. Non attiviamo conversioni automatiche: un prezzo stringa deve essere segnalato.

`JSON.parse` rifiuta già `NaN`, ma conserva solo l'ultimo valore di una chiave ripetuta. Il validatore JavaScript non rileva quindi queste ripetizioni nel testo originale; la guida 08 confronta questo comportamento con gli hook Python.

## Esercizio rapido

Su copie del catalogo originale, prova separatamente a rimuovere `promozione`, impostarla a `null` e impostarla a `""`.

**Verifica:** proprietà rimossa → errore; `null` → valido; stringa vuota → errore. Non confondere presenza della proprietà e valore ammesso.

## Riferimenti

Consulta [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12), la documentazione su [oggetti e proprietà](https://json-schema.org/understanding-json-schema/reference/object), [array](https://json-schema.org/understanding-json-schema/reference/array), [tipi numerici](https://json-schema.org/understanding-json-schema/reference/numeric), l'[API di `jsonschema`](https://python-jsonschema.readthedocs.io/en/stable/validate/), [Ajv per Draft 2020-12](https://ajv.js.org/json-schema.html#draft-2020-12) e [ajv-formats](https://ajv.js.org/packages/ajv-formats.html).

[Indice](README.md) · [Prosegui: JSON, HTTP e configurazioni](07-json-http-e-configurazioni.md)
