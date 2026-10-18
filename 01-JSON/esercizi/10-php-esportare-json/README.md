# 10 — Filtrare ed esportare JSON con PHP

[Indice degli esercizi](../README.md) · Intermedio · 45–60 minuti

## Obiettivo

Esportare una lista di prodotti, mantenendo tipi e caratteri Unicode e riconoscendo la differenza tra un array PHP con indici consecutivi e uno con indici discontinui.

## Materiale iniziale

[main.php](main.php) carica il catalogo e salva l'elenco restituito da `selezionaProdotti`. Non devi produrre un catalogo completo: il risultato è un array JSON di prodotti.

## Passi guidati

1. Seleziona soltanto i prodotti con quantità positiva.
2. Se l'argomento etichetta non è vuoto, mantieni anche solo i prodotti che contengono quell'etichetta. Usa un confronto stretto con `in_array(..., true)`.
3. Usa `array_filter` oppure un ciclo per la selezione.
4. Ricostruisci gli indici da zero prima di serializzare: `array_filter` conserva le chiavi originali, che potrebbero essere `0` e `2`.
5. Restituisci l'array selezionato, mantenendo l'ordine del catalogo. Il salvataggio usa `JSON_PRETTY_PRINT`, `JSON_UNESCAPED_UNICODE` e `JSON_THROW_ON_ERROR`.

## Esecuzione e risultati attesi

```bash
php 10-php-esportare-json/main.php
```

Il programma deve stampare `Prodotti esportati: 2` e salvare `output/prodotti-disponibili.json`. Il valore principale deve essere un array JSON contenente `P001` e `P003`, in quest'ordine. Il nome di `P003` deve mantenere leggibile la parola `attività`.

```bash
php 10-php-esportare-json/main.php audio
php 10-php-esportare-json/main.php inesistente
```

La prima prova esporta solo `P003`; la seconda deve produrre `[]`, non `{}`. Ogni esecuzione sostituisce il risultato precedente nella propria cartella di output.

## Una verifica con Node.js

Ripeti la prova senza etichetta e controlla l'output dalla console Node.js avviata nella cartella degli esercizi:

```javascript
const { readFileSync } = require("node:fs");
const prodotti = JSON.parse(readFileSync("10-php-esportare-json/output/prodotti-disponibili.json", "utf8"));
console.log(Array.isArray(prodotti)); // true
console.log(prodotti.map(prodotto => prodotto.id)); // [ 'P001', 'P003' ]
console.log(typeof prodotti[0].prezzo_centesimi); // number
```

## Suggerimenti e consegna

Consulta `array_values` per ricostruire gli indici. Per capire il problema, prova su dati di lavoro a serializzare l'array filtrato prima e dopo la reindicizzazione e confronta i due testi.

Non convertire tutti i valori in stringhe e non usare `JSON_FORCE_OBJECT`: cambierebbero il contratto richiesto. Il campo `promozione` deve conservare i suoi valori `null`.

Consegna script, output della prova senza etichetta e resoconto delle tre selezioni. Spiega perché un array PHP con indici `0` e `2` può diventare un oggetto JSON, anziché una lista.

Riferimenti: [array_filter](https://www.php.net/manual/en/function.array-filter.php), [array_values](https://www.php.net/manual/en/function.array-values.php), [json_encode](https://www.php.net/manual/en/function.json-encode.php).
