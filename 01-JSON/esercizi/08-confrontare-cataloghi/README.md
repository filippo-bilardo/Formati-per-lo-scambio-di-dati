# 08 — Confrontare due versioni del catalogo

[Indice degli esercizi](../README.md) · Avanzato · 60–90 minuti

## Obiettivo

Riconoscere prodotti aggiunti, rimossi e modificati confrontando i dati tramite ID, senza dipendere dall'ordine delle proprietà o dei prodotti.

## Materiale iniziale

[main.js](main.js) legge il catalogo originale e [catalogo-successivo.json](../dati/catalogo-successivo.json). Completa `confronta(prima, dopo)`, che restituisce il report.

## Passi guidati

1. Costruisci una mappa ID → prodotto per ogni versione. Puoi usare `Map`.
2. Cerca gli ID presenti solo nella versione successiva: sono aggiunti.
3. Cerca quelli presenti solo nella precedente: sono rimossi.
4. Per gli ID comuni confronta, in questo ordine, `nome`, `prezzo_centesimi`, `quantita`, `etichette`, `promozione`.
5. Se cambia almeno un campo, registra ID e lista dei campi cambiati; altrimenti registra l'ID tra gli invariati.
6. Ordina ogni lista per ID per rendere il report ripetibile.

Il confronto riguarda i prodotti: ignora la diversa data nei metadati. Per le etichette l'ordine dell'array è significativo in questo esercizio.

## Esecuzione e risultato atteso

```bash
node 08-confrontare-cataloghi/main.js
```

Il programma stampa e salva `output/confronto.json`:

```json
{
  "aggiunti": ["P004"],
  "rimossi": ["P002"],
  "modificati": [{"id": "P001", "campi": ["quantita"]}],
  "invariati": ["P003"]
}
```

## Prove e suggerimenti

Il secondo file ha già i prodotti in ordine diverso: questo riordinamento non deve produrre falsi cambiamenti. Confrontare due oggetti con `===` confronta la loro identità in memoria e non risolve il problema.

Su una copia della seconda versione cambia anche il nome di `P001`: il report deve elencare `nome` e `quantita`, in quest'ordine. Riordina poi soltanto le proprietà di `P003`: deve restare invariato.

Passa la copia come argomento:

```bash
node 08-confrontare-cataloghi/main.js 08-confrontare-cataloghi/output/catalogo-di-prova.json
```

Per confrontare le etichette puoi confrontare lunghezza ed elementi alla stessa posizione. Evita di usare come unico criterio la serializzazione dell'intero oggetto: l'ordine delle proprietà può differire.

## Consegna

Consegna script, report sui dati originali e resoconto delle varianti. Spiega perché un indice nell'array non è un identificativo stabile.

Riferimenti: [guida 04](../../04-oggetti-array-e-modellazione.md), [guida 08](../../08-strumenti-e-interoperabilita.md).
