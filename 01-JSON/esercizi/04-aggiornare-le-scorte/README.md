# 04 — Aggiornare le scorte con parametri CLI

[Indice degli esercizi](../README.md) · Intermedio · 45–60 minuti

## Obiettivo

Interpretare argomenti del terminale, controllare i valori prima di usarli e salvare una copia coerente del catalogo.

## Materiale iniziale

[main.js](main.js) carica sempre il catalogo originale. Completa `riassortisci(catalogo, id, incrementoTesto)`, che restituisce il catalogo aggiornato. Il codice di salvataggio è già predisposto.

## Passi guidati

1. Osserva gli argomenti `process.argv`: ID del prodotto e incremento arrivano come stringhe.
2. Rifiuta un incremento vuoto o composto solo da spazi. Convertilo poi in numero e richiedi un intero strettamente positivo.
3. Cerca il prodotto tramite `id`, senza supporre che sia il primo dell'array.
4. Se l'ID non esiste, lancia un errore. Non aggiungere un nuovo prodotto implicitamente.
5. Incrementa solo la quantità del prodotto trovato. Conserva gli altri dati, compresi i prodotti esauriti.
6. Restituisci il catalogo; solo allora il programma deve scrivere il risultato.

## Esecuzione e risultato atteso

```bash
node 04-aggiornare-le-scorte/main.js P001 1
```

In `output/catalogo-aggiornato.json` devono esserci tre prodotti, con quantità `P001 = 9`, `P002 = 0`, `P003 = 5`. Il valore totale diventa `48860` centesimi. Ripetere il comando produce ancora quantità `9`, perché l'ingresso è sempre l'originale.

Per controllare il risultato con il validatore già disponibile nel capitolo:

```bash
npm install --prefix ../esempi
node ../esempi/valida_catalogo.js 04-aggiornare-le-scorte/output/catalogo-aggiornato.json
```

L'installazione è necessaria solo se le dipendenze di `esempi` non sono già presenti.

## Prove di errore

```bash
node 04-aggiornare-le-scorte/main.js P999 1
node 04-aggiornare-le-scorte/main.js P001 -1
node 04-aggiornare-le-scorte/main.js P001 1.5
node 04-aggiornare-le-scorte/main.js P001 abc
node 04-aggiornare-le-scorte/main.js P001 ""
```

Ogni prova deve terminare con codice `1`, spiegare il problema e non creare o sovrascrivere il risultato. Se esiste già un output valido, deve rimanere quello precedente.

## Suggerimenti e consegna

Usa `find` per il prodotto e `Number.isInteger` per l'incremento. Non usare `parseInt` come unico controllo: troncherebbe ingressi come `1.5`.

Consegna script, catalogo aggiornato e resoconto con almeno tre errori provati. Spiega la differenza tra modificare l'oggetto in memoria e sovrascrivere il documento originale.

Riferimenti: [guida 05](../../05-parsing-e-serializzazione.md), [guida 10](../../10-strumenti-da-cli.md).
