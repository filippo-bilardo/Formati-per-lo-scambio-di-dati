# 01 — Introduzione a JSON

[Indice del capitolo](README.md) · [Guida successiva](02-sintassi-e-struttura.md)

## Obiettivi

Comprendere a cosa serve JSON, leggere un primo documento e riconoscere quando il formato è adatto a uno scambio di dati.

## Che cos'è JSON

JSON significa *JavaScript Object Notation*. È un formato testuale: stabilisce come scrivere valori e strutture, così che applicazioni diverse possano scambiarseli. Non contiene istruzioni da eseguire.

Immagina un programma che gestisce il magazzino e una pagina web che mostra i prodotti. I due programmi possono concordare un documento come questo:

```json
{
  "id": "P001",
  "nome": "Tastiera USB",
  "prezzo_centesimi": 3990,
  "quantita": 8
}
```

Le quattro proprietà descrivono un prodotto. Il programma destinatario deve conoscere anche il significato dei campi: JSON, da solo, non stabilisce che `3990` significhi 39,90 euro.

## Origini e indipendenza dal linguaggio

La notazione deriva dai letterali di oggetto di JavaScript ed è stata divulgata da Douglas Crockford nei primi anni Duemila. Il formato è descritto dagli standard ECMA-404 e RFC 8259.

Il nome non impone di usare JavaScript: un'applicazione Python può produrre un documento che un programma Java legge. Per riuscirci, i due programmi devono concordare nomi, tipi, unità di misura e campi obbligatori.

## Testo e dati in memoria

Il documento JSON viaggia come testo, per esempio dentro un file o nel corpo di una risposta HTTP. Per lavorarci, un programma lo converte nelle strutture del proprio linguaggio.

```text
Testo JSON → parsing → strutture in memoria
Strutture in memoria → serializzazione → testo JSON
```

In Python un oggetto JSON diventa normalmente un dizionario; un array diventa una lista. Il file `.json` non è quindi un programma Python e un dizionario Python non è già un testo JSON.

## Primo esempio in JavaScript

Esegui il codice nella console di un browser oppure in Node.js:

```javascript
const testo = '{"id":"P001","nome":"Tastiera USB","prezzo_centesimi":3990,"quantita":8}';
const prodotto = JSON.parse(testo);

console.log(typeof testo);       // string
console.log(typeof prodotto);    // object
console.log(prodotto.nome);      // Tastiera USB
console.log(prodotto.quantita);  // 8
```

`testo` contiene la rappresentazione JSON; `prodotto` contiene l'oggetto ottenuto dal parsing. Per accedere al nome usiamo la proprietà dell'oggetto, non il testo originale. Questa distinzione ritornerà negli esempi di lettura e scrittura dei file.

## Impieghi comuni

- **Scambio tra applicazioni:** invio di prodotti, utenti, ordini o misurazioni.
- **API web:** rappresentazione dei dati nelle richieste e nelle risposte HTTP.
- **Configurazioni:** memorizzazione di impostazioni strutturate.
- **Esportazione e importazione:** trasferimento di dati tra strumenti diversi.

Un file JSON può essere utile per un piccolo catalogo didattico. Per aggiornamenti concorrenti, ricerche complesse o grandi volumi occorre valutare un sistema di archiviazione più adatto, come un database.

## Vantaggi e limiti

JSON combina una sintassi breve con strutture annidabili e supporto in molti linguaggi. I documenti piccoli si leggono facilmente e possono rappresentare gerarchie senza inventare delimitatori propri.

Ha però alcuni limiti: ripete i nomi dei campi, non include commenti nello standard e non offre tipi nativi per date o dati binari. Inoltre la leggibilità peggiora quando un documento diventa molto grande o profondamente annidato.

## Confronto orientativo

| Esigenza | Formato da valutare | Motivo |
| --- | --- | --- |
| Dati annidati tra applicazioni | JSON | Oggetti e array rappresentano strutture composte |
| Tabella semplice da aprire in un foglio di calcolo | CSV | Organizzazione in righe e colonne |
| Documento con testo e marcatura | XML | Elementi e attributi descrivono il documento |
| Configurazione scritta spesso a mano | TOML o YAML | Sintassi con commenti e convenzioni dedicate |

La scelta dipende anche dai sistemi coinvolti. Non esiste un formato sempre migliore: confronta requisiti, strumenti e accordi tra produttore e consumatore.

## Il caso di studio

Nelle guide useremo [catalogo.json](esempi/catalogo.json). Contiene il nome del negozio, la valuta, una data di aggiornamento e un array di prodotti. Le date e i prezzi saranno rappresentati secondo convenzioni esplicite, spiegate nella guida 03.

Apri il file in un editor e prova a individuare:

1. il nome del negozio;
2. quanti prodotti sono presenti;
3. il prodotto con quantità pari a zero.

**Verifica:** il negozio si chiama `Laboratorio TPSIT`, i prodotti sono tre e il prodotto esaurito ha identificativo `P002`.

## Riferimenti

Per la definizione del formato consulta [JSON.org](https://www.json.org/json-it.html); per le specifiche consulta [ECMA-404](https://ecma-international.org/publications-and-standards/standards/ecma-404/) e [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html).

[Indice del capitolo](README.md) · [Prosegui: sintassi e struttura](02-sintassi-e-struttura.md)
