# 04 — Oggetti, array e modellazione

[Guida precedente](03-tipi-di-dati.md) · [Indice](README.md) · [Guida successiva](05-parsing-e-serializzazione.md)

## Obiettivi

Progettare strutture annidate, accedere ai valori e motivare le scelte del modello dati del catalogo.

## Oggetti per descrivere, array per raccogliere

Un oggetto associa nomi a valori; un array contiene una sequenza di valori. Nel nostro caso un prodotto è un oggetto e l'elenco dei prodotti è un array.

```json
{
  "negozio": "Laboratorio TPSIT",
  "valuta": "EUR",
  "aggiornato_il": "2026-10-18",
  "prodotti": [
    {
      "id": "P001",
      "nome": "Tastiera USB",
      "prezzo_centesimi": 3990,
      "quantita": 8,
      "etichette": ["usb", "informatica"],
      "promozione": null
    }
  ]
}
```

Questa è una versione ridotta del [catalogo completo](esempi/catalogo.json), che contiene tre prodotti.

Gli oggetti possono contenere array e gli array possono contenere oggetti. Puoi ripetere questo annidamento, ma ogni livello dovrebbe rappresentare un rapporto comprensibile tra i dati.

## Contratto del catalogo

| Campo | Significato e vincoli scelti |
| --- | --- |
| `negozio` | Stringa non vuota con il nome del negozio |
| `valuta` | Stringa `EUR`, valida per tutti i prezzi del documento |
| `aggiornato_il` | Stringa che rappresenta una data `AAAA-MM-GG` |
| `prodotti` | Array, anche vuoto, di prodotti |
| `id` | Codice come `P001`, univoco nel catalogo |
| `nome` | Stringa non vuota |
| `prezzo_centesimi` | Intero maggiore o uguale a zero |
| `quantita` | Intero maggiore o uguale a zero |
| `etichette` | Array di stringhe non vuote, senza ripetizioni |
| `promozione` | Stringa non vuota oppure `null` |

Tutti questi campi sono obbligatori nel modello; non accettiamo proprietà ulteriori. Sono scelte del laboratorio, non regole universali di JSON. Per esempio, altri cataloghi potrebbero prevedere più valute o promozioni strutturate come oggetti.

## Accesso ai dati

Dopo il parsing, in Python:

```python
import json
from pathlib import Path

catalogo = json.loads(Path("esempi/catalogo.json").read_text(encoding="utf-8"))
primo = catalogo["prodotti"][0]

print(primo["nome"])                # Tastiera USB
print(primo["etichette"][0])        # usb
print(primo["promozione"] is None)  # True

for prodotto in catalogo["prodotti"]:
    print(prodotto["id"], prodotto["quantita"])
```

Gli indici degli array partono da zero. Un indice fuori intervallo causa `IndexError`; una chiave mancante, acceduta con `[...]`, causa `KeyError`.

Per distinguere proprietà assente e `null`, verifica prima la presenza della chiave con `"promozione" in primo`. `primo.get("promozione")` restituisce `None` in entrambi i casi, se non specifichi un valore predefinito diverso.

## Lo stesso esempio in JavaScript

Avvia Node.js con il comando `node` dalla cartella `01-JSON` e incolla questo codice. `readFileSync` legge il testo UTF-8; `JSON.parse` lo converte in un oggetto JavaScript:

```javascript
const { readFileSync } = require("node:fs");

const testo = readFileSync("esempi/catalogo.json", "utf8");
const catalogo = JSON.parse(testo);
const primo = catalogo.prodotti[0];

console.log(primo.nome);                // Tastiera USB
console.log(primo.etichette[0]);        // usb
console.log(primo.promozione === null); // true

for (const prodotto of catalogo.prodotti) {
  console.log(prodotto.id, prodotto.quantita);
}

const disponibili = catalogo.prodotti.filter(prodotto => prodotto.quantita > 0);
console.log(disponibili.map(prodotto => prodotto.id)); // [ 'P001', 'P003' ]

const unita = disponibili.reduce((totale, prodotto) => totale + prodotto.quantita, 0);
console.log(unita); // 13
```

La notazione `catalogo.prodotti` equivale a `catalogo["prodotti"]`; le parentesi quadre servono anche quando il nome della proprietà è contenuto in una variabile. Come in Python, gli indici degli array partono da zero.

`filter` costruisce un array con i prodotti selezionati, `map` ne estrae gli identificativi e `reduce` somma le quantità partendo da zero. Gli oggetti nell'array filtrato sono condivisi con il catalogo: modificarne una proprietà modifica anche il prodotto originale in memoria.

Per distinguere proprietà assente e valore `null`, usa `Object.hasOwn(primo, "promozione")` per la presenza e `primo.promozione === null` per il valore. Leggere una proprietà inesistente restituisce `undefined`. Se invece un accesso intermedio, come `catalogo.prodotti[99]`, restituisce `undefined`, tentare di leggerne `.nome` causa un `TypeError`.

`readFileSync` e `require` in questo esempio appartengono a Node.js. Nella console di un browser la parte di accesso e trasformazione funziona una volta ottenuto l'oggetto `catalogo`, ma il file va caricato con gli strumenti del browser, per esempio tramite una richiesta HTTP.

## Ordine e identificativi

L'ordine degli elementi di un array è significativo. L'ordine delle proprietà di un oggetto non dovrebbe determinare il significato dello scambio, anche se un linguaggio lo conserva.

Non usare quindi «la prima proprietà dell'oggetto» per trovare il prezzo. Usa il nome `prezzo_centesimi`. Analogamente, la posizione di un prodotto nell'array può cambiare: per riconoscerlo nel tempo usa `id`.

Evita chiavi duplicate nello stesso oggetto. Un testo come `{"quantita": 8, "quantita": 2}` può essere interpretato diversamente da strumenti diversi; non è un modo affidabile di rappresentare due quantità. La guida 08 mostra un controllo esplicito.

## Ridurre le incoerenze

La disponibilità si ricava da `quantita > 0`: non aggiungiamo un campo `disponibile` che potrebbe contraddirla. La valuta è dichiarata una sola volta perché vale per tutto il catalogo.

Questa scelta semplifica il nostro esempio. Se in futuro un prodotto avesse una valuta diversa, occorrerebbe cambiare il contratto e aggiornare insieme dati, schema e programmi.

Per strutture più articolate, valuta se annidare un oggetto o riferirlo con un identificativo. Un indirizzo specifico del negozio può stare in un oggetto annidato; una categoria condivisa da migliaia di prodotti può essere gestita separatamente e richiamata con un codice.

## Esercizio rapido

Partendo dal catalogo completo, trova i codici dei prodotti con quantità positiva e somma le relative quantità.

**Verifica:** i codici sono `P001` e `P003`; le unità disponibili sono `13`. Nella guida 05 realizzeremo questa selezione con un programma.

## Riferimenti

Per le proprietà di oggetti e array consulta [RFC 8259, sezioni 4 e 5](https://www.rfc-editor.org/rfc/rfc8259.html#section-4). Per il codice JavaScript consulta la [documentazione di `readFileSync` in Node.js](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) e la [specifica ECMAScript degli array](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-objects). Le regole del catalogo sono definite in questo corso e formalizzate nella guida 06.

[Indice](README.md) · [Prosegui: parsing e serializzazione](05-parsing-e-serializzazione.md)
