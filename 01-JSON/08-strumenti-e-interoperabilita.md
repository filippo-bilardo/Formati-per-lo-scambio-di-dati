# 08 — Strumenti e interoperabilità

[Guida precedente](07-json-http-e-configurazioni.md) · [Indice](README.md) · [Guida successiva](09-esercitazioni-e-soluzioni.md)

## Obiettivi

Scegliere strumenti adatti al lavoro e riconoscere le differenze che possono alterare i dati durante lo scambio tra linguaggi.

## Scegliere lo strumento in base al controllo

| Attività | Strumento | Cosa verifica o produce |
| --- | --- | --- |
| Leggere e formattare un documento | Editor con supporto JSON | Evidenziazione e segnalazioni di sintassi |
| Ispezionare un file al terminale | `python3 -m json.tool file.json` | Parsing e stampa indentata, con le estensioni del modulo Python |
| Elaborare dati con Python | Modulo `json` | Conversione tra testo, dizionari, liste e valori |
| Elaborare dati con JavaScript | `JSON.parse` e `JSON.stringify` | Conversione tra testo e valori JavaScript |
| Applicare il contratto del catalogo | `valida_catalogo.py` | Parsing controllato, schema e regola sugli ID |
| Applicare il contratto in JavaScript | `valida_catalogo.js` con Ajv | Schema e regola sugli ID dopo `JSON.parse` |
| Usare Java | Jackson o Gson | Conversione di JSON e oggetti Java |
| Usare PHP | `json_decode` e `json_encode` | Conversione di JSON e valori PHP |

Il supporto JSON Schema di un editor va configurato e verificato: non assumere che ogni file `.json` venga controllato con lo schema del catalogo. Lo schema contiene `$schema`; il documento dei dati non deve ricevere una proprietà aggiuntiva omonima, vietata dal nostro contratto.

Un validatore online può essere utile per prove su dati inventati. Per il laboratorio, gli strumenti locali permettono di ripetere il controllo con lo stesso schema e gli stessi file.

## Precisione dei numeri

Un numero scritto correttamente in JSON può perdere precisione nel linguaggio destinatario. JavaScript usa normalmente numeri IEEE 754 a doppia precisione: tutti gli interi nell'intervallo da `-(2**53 - 1)` a `2**53 - 1` sono rappresentabili esattamente, mentre oltre quel limite non tutti lo sono.

Prova nella console JavaScript:

```javascript
const dati = JSON.parse('{"id":9007199254740993}');
console.log(dati.id);               // 9007199254740992
console.log(Number.isSafeInteger(dati.id)); // false
```

Per un identificativo lungo preferisci una stringa, per esempio `"9007199254740993"`. Per gli importi abbiamo scelto centesimi interi; occorre comunque concordare un intervallo supportato dai sistemi coinvolti. Il nostro piccolo catalogo usa valori ben lontani dal limite.

## Valori non rappresentabili e trasformazioni

Non tutti i valori del linguaggio possono diventare direttamente JSON:

- in Python un `set` non è serializzabile dal modulo `json` senza una conversione esplicita;
- date e oggetti personalizzati richiedono una rappresentazione concordata;
- in JavaScript `undefined` in una proprietà di oggetto viene omesso durante `JSON.stringify`;
- in un array JavaScript, `undefined` viene invece serializzato come `null`;
- `NaN` e `Infinity` diventano `null` con `JSON.stringify`, mentre il serializzatore Python predefinito può emetterli come letterali non standard.

```javascript
console.log(JSON.stringify({ promozione: undefined })); // {}
console.log(JSON.stringify([undefined, NaN]));          // [null,null]
```

Un passaggio di serializzazione e parsing può quindi cambiare o perdere informazioni. Per il catalogo usa valori semplici e conformi al contratto.

## Controllare le estensioni del parser Python

La scelta `allow_nan=False` riguarda la serializzazione, non il parsing. Per rifiutare i letterali `NaN`, `Infinity` e `-Infinity` durante la lettura usa `parse_constant`:

```python
import json

def rifiuta_costante(valore):
    raise ValueError(f"Costante non JSON: {valore}")

try:
    json.loads('{"quantita": NaN}', parse_constant=rifiuta_costante)
except ValueError as errore:
    print(errore)  # Costante non JSON: NaN
```

Questo controllo rifiuta quei letterali, ma non stabilisce da solo tutti i vincoli numerici del contratto. Un numero come `1e400` ha sintassi JSON valida, anche se può superare la capacità numerica del destinatario.

## Chiavi duplicate negli oggetti

Il modulo Python mantiene normalmente l'ultimo valore di una chiave ripetuta. Dopo aver costruito il dizionario non puoi più sapere che il testo conteneva il duplicato.

Usa `object_pairs_hook` per controllare le coppie prima della costruzione dell'oggetto:

```python
import json

def oggetto_senza_duplicati(coppie):
    risultato = {}
    for chiave, valore in coppie:
        if chiave in risultato:
            raise ValueError(f"Chiave duplicata: {chiave}")
        risultato[chiave] = valore
    return risultato

try:
    json.loads(
        '{"quantita": 8, "quantita": 2}',
        object_pairs_hook=oggetto_senza_duplicati,
    )
except ValueError as errore:
    print(errore)  # Chiave duplicata: quantita
```

Il controllo si applica anche agli oggetti annidati. Il programma [valida_catalogo.py](esempi/valida_catalogo.py) combina entrambi gli hook con JSON Schema.

Le chiavi duplicate nello stesso oggetto e gli ID duplicati tra prodotti sono due problemi diversi: il primo si rileva durante il parsing, il secondo dopo aver interpretato e validato il documento.

### Confronto con il parser JavaScript

```javascript
const prodotto = JSON.parse('{"quantita":8,"quantita":2}');
console.log(prodotto.quantita); // 2

try {
  JSON.parse('{"quantita":NaN}');
} catch (errore) {
  console.log(errore.name); // SyntaxError
}
```

JavaScript conserva l'ultimo valore della chiave ripetuta e rifiuta il letterale `NaN`. La funzione `reviver` opzionale di `JSON.parse` riceve valori già interpretati: non permette di recuperare le proprietà duplicate che sono state sovrascritte. Il nostro validatore Ajv lavora su quell'oggetto già costruito, mentre gli hook Python del laboratorio controllano le coppie originali.

## Un confronto tra documenti in JavaScript

```javascript
const prima = JSON.parse('{"id":"P001","quantita":8}');
const seconda = JSON.parse('{"quantita":8,"id":"P001"}');

console.log(prima === seconda); // false: sono due oggetti distinti in memoria
console.log(prima.id === seconda.id && prima.quantita === seconda.quantita); // true
```

Il secondo confronto verifica i campi del nostro piccolo esempio. Non è un confronto profondo generico: per strutture complesse occorre considerare anche proprietà annidate, proprietà mancanti e ordine degli array.

## Equivalenza dei dati e identità del testo

Due documenti possono descrivere gli stessi dati pur avendo indentazione o ordine delle proprietà differenti. Un semplice confronto tra stringhe li considererebbe diversi.

Quando il compito riguarda il contenuto, confronta le strutture ottenute dopo il parsing. L'ordine degli array resta significativo. `sort_keys=True` in Python può rendere l'output più stabile, ma non costituisce da solo una procedura universale di canonicalizzazione per firme digitali.

Un ritorno da Python a JSON può inoltre trasformare una tupla in array e una chiave numerica di dizionario in stringa. Nel nostro modello le chiavi sono sempre stringhe fin dall'inizio.

## Esercizio rapido

Esegui separatamente le prove su interi lunghi, `undefined`, `NaN` e chiavi duplicate. Annota per ciascuna se il valore viene conservato, convertito, omesso oppure rifiutato.

**Verifica:** l'intero JavaScript dell'esempio perde precisione; `undefined` viene omesso nell'oggetto e diventa `null` nell'array; i due hook Python rifiutano i rispettivi ingressi problematici.

## Riferimenti

- [RFC 8259, interoperabilità numerica](https://www.rfc-editor.org/rfc/rfc8259.html#section-6).
- [Python: conformità e interoperabilità del modulo `json`](https://docs.python.org/3/library/json.html#standard-compliance-and-interoperability).
- [Specifica ECMAScript: serializzazione JSON](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.stringify).
- [Jackson Databind, repository ufficiale](https://github.com/FasterXML/jackson-databind).
- [Gson, documentazione del progetto](https://google.github.io/gson/).
- [PHP, estensione JSON](https://www.php.net/manual/en/book.json.php).

[Indice](README.md) · [Prosegui: esercitazioni e soluzioni](09-esercitazioni-e-soluzioni.md)
