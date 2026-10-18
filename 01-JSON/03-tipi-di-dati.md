# 03 — Tipi di dati

[Guida precedente](02-sintassi-e-struttura.md) · [Indice](README.md) · [Guida successiva](04-oggetti-array-e-modellazione.md)

## Obiettivi

Riconoscere i sei tipi JSON e scegliere rappresentazioni che mantengano il significato dei dati tra linguaggi diversi.

## I sei tipi

| Tipo JSON | Esempio | Uso nel catalogo |
| --- | --- | --- |
| Stringa | `"Tastiera USB"` | Nome e identificativo del prodotto |
| Numero | `3990`, `14.9`, `1.2e3` | Prezzo in centesimi e quantità |
| Booleano | `true`, `false` | Eventuali opzioni attive o disattive |
| Null | `null` | Valore esplicitamente assente |
| Oggetto | `{"id": "P001"}` | Insieme di proprietà di un prodotto |
| Array | `["usb", "audio"]` | Collezione di etichette o prodotti |

Una stringa può essere vuota (`""`). Anche oggetti e array possono essere vuoti (`{}` e `[]`). Una stringa numerica come `"3990"` non è il numero `3990`.

## Numeri e unità di misura

La sintassi JSON usa un unico tipo numero: non dichiara separatamente `int` e `float`. Sono consentite parte decimale e notazione esponenziale. Non sono ammessi `NaN`, `Infinity`, numeri esadecimali o il segno `+` iniziale.

I linguaggi scelgono come memorizzare i numeri e possono avere limiti differenti. Per gli importi del laboratorio usiamo **interi in centesimi**:

```json
{
  "valuta": "EUR",
  "prezzo_centesimi": 3990
}
```

Il significato è 39,90 euro. Questa convenzione permette somme e moltiplicazioni intere senza usare frazioni binarie per i prezzi. Il nome del campo e la valuta rendono esplicita l'unità.

Non usare un numero per un codice su cui non esegui calcoli: `"00123"` conserva gli zeri iniziali ed è un buon candidato per una stringa. Per i limiti degli interi tra linguaggi consulta la guida 08.

## Booleani e stringhe

```json
{"attivo": false, "testo": "false"}
```

Il primo valore è un booleano; il secondo è una stringa di cinque caratteri. Un programma non deve considerarli intercambiabili. In Python, per esempio, una stringa non vuota risulta vera in un controllo di verità, anche se contiene la parola `false`.

## `null`, proprietà assente e stringa vuota

Considera questi tre documenti distinti:

```json
{"promozione": null}
```

```json
{}
```

```json
{"promozione": ""}
```

Nel primo la proprietà esiste e vale `null`; nel secondo non esiste; nel terzo contiene una stringa vuota. Il loro significato applicativo va concordato.

Nel nostro catalogo ogni prodotto deve avere `promozione`: `null` significa «nessun messaggio promozionale», mentre una stringa contiene il messaggio. La guida 06 renderà obbligatoria la proprietà pur consentendo `null`.

## Date e altri valori senza tipo nativo

JSON non ha tipi nativi per data, ora, dati binari o funzioni. Una data può essere rappresentata come stringa con una convenzione documentata:

```json
{"aggiornato_il": "2026-10-18"}
```

Nel laboratorio il campo indica una data di calendario nel formato `AAAA-MM-GG`. Il parser JSON la lascia come stringa: non la trasforma automaticamente in un oggetto data.

Per un istante temporale servirebbe anche una convenzione su ora e fuso, per esempio `2026-10-18T10:30:00Z`. Il suffisso `Z` indica UTC. Il destinatario deve interpretare e verificare la convenzione scelta.

## Corrispondenze con Python e JavaScript

| JSON | Python dopo il parsing | JavaScript dopo il parsing |
| --- | --- | --- |
| Oggetto | `dict` | Oggetto |
| Array | `list` | `Array` |
| Stringa | `str` | `string` |
| Numero | `int` o `float`, normalmente | `number` |
| `true` / `false` | `True` / `False` | `true` / `false` |
| `null` | `None` | `null` |

`undefined` appartiene a JavaScript e non è un valore JSON. Allo stesso modo, scrivere `None` in un file JSON sarebbe un errore: la traduzione avviene con il parser o il serializzatore.

## Riconoscere i tipi in JavaScript

Esegui il codice nella console del browser o in Node.js:

```javascript
const dati = JSON.parse(`{
  "cap": "00100",
  "quantita": 8,
  "attivo": false,
  "promozione": null,
  "etichette": ["usb", "audio"],
  "aggiornato_il": "2026-10-18"
}`);

console.log(typeof dati.cap);            // string
console.log(typeof dati.quantita);       // number
console.log(typeof dati.attivo);         // boolean
console.log(dati.promozione === null);   // true
console.log(Array.isArray(dati.etichette)); // true
console.log(typeof dati.aggiornato_il);  // string
console.log(Object.hasOwn(dati, "promozione")); // true
console.log(Object.hasOwn(dati, "sconto"));     // false
```

`Array.isArray` riconosce gli array. Per `null` usa un confronto esplicito: per ragioni storiche `typeof null` restituisce `"object"`. La data resta una stringa e il CAP mantiene gli zeri iniziali.

I backtick delimitano una stringa JavaScript su più righe; il suo contenuto usa comunque la sintassi JSON con doppi apici.

## Esercizio rapido

Scegli un tipo per: CAP `00100`, quantità `8`, prezzo `3990` centesimi, nessuna promozione e due etichette `usb` e `audio`.

**Verifica:** stringa, numero intero, numero intero, `null`, array di stringhe. Un array JSON può anche mescolare tipi diversi; mantenere tutte le etichette come stringhe è una scelta del nostro modello.

## Riferimenti

Per i tipi consulta [JSON.org](https://www.json.org/json-it.html). Per le conversioni consulta la [tabella JSON–Python](https://docs.python.org/3/library/json.html#encoders-and-decoders) e la [specifica di `JSON.parse`](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.parse).

[Indice](README.md) · [Prosegui: oggetti, array e modellazione](04-oggetti-array-e-modellazione.md)
