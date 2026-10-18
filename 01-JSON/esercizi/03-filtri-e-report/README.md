# 03 — Filtri, ordinamento e report

[Indice degli esercizi](../README.md) · Base · 45–60 minuti

## Obiettivo

Usare `filter`, `map`, `sort` e `reduce` per estrarre informazioni e produrre un nuovo documento JSON.

## Materiale iniziale

[main.js](main.js) carica il catalogo originale e salva il report restituito da `creaReport(catalogo, etichetta)`.

## Passi guidati

1. Seleziona i prodotti con quantità positiva.
2. Ordina la selezione per prezzo crescente, usando un comparatore numerico. Non cambiare l'ordine del catalogo originale.
3. Estrai gli ID dei prodotti disponibili ordinati.
4. Seleziona tutti i prodotti con l'etichetta ricevuta come argomento, anche se esauriti. Mantieni per questi l'ordine originale.
5. Calcola quantità totale e valore del magazzino usando tutti i prodotti. I prezzi sono già in centesimi: non moltiplicarli per cento.
6. Restituisci i cinque campi del report richiesto.

## Esecuzione e risultato atteso

```bash
node 03-filtri-e-report/main.js usb
```

Il programma stampa e salva in `output/report.json`:

```json
{
  "disponibili": ["P003", "P001"],
  "etichetta": "usb",
  "con_etichetta": ["P001", "P002"],
  "unita_totali": 13,
  "valore_magazzino_centesimi": 44870
}
```

## Suggerimenti

`filter` produce un nuovo array; `sort` modifica l'array su cui viene chiamato. Per l'ordinamento numerico confronta due prezzi con una sottrazione. Per la somma usa un valore iniziale `0` in `reduce`, così funziona anche con un array vuoto.

Un report ha una struttura diversa dal catalogo: non validarlo con lo schema del catalogo.

## Prove e consegna

```bash
node 03-filtri-e-report/main.js audio
node 03-filtri-e-report/main.js inesistente
```

La prima selezione per etichetta deve contenere solo `P003`; la seconda deve essere `[]`. Gli altri risultati non cambiano. Annota perché `P002` compare nel filtro `usb`, ma non tra i disponibili.

Consegna script, report della prova `usb` e resoconto. Verifica che il file di partenza sia rimasto invariato.

Riferimenti: [guida 04](../../04-oggetti-array-e-modellazione.md), [guida 05](../../05-parsing-e-serializzazione.md).
