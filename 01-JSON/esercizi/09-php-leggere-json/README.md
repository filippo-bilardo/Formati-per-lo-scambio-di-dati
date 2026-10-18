# 09 — Leggere JSON con PHP

[Indice degli esercizi](../README.md) · Base · 30–45 minuti

## Obiettivo

Leggere un documento JSON da PHP, lavorare con array associativi e distinguere proprietà assente e valore `null`.

## Materiale iniziale

In [main.php](main.php) sono già predisposti lettura del file, `json_decode` con `JSON_THROW_ON_ERROR` e gestione degli errori. Completa `creaRiepilogo`.

## Passi guidati

1. Osserva il secondo parametro `true` di `json_decode`: gli oggetti JSON vengono rappresentati come array associativi PHP.
2. Leggi il nome del negozio e conta gli elementi di `$catalogo['prodotti']`.
3. Con un ciclo calcola unità totali e valore del magazzino, mantenendo i prezzi in centesimi.
4. Sul primo prodotto confronta `array_key_exists('promozione', $prodotto)` con `isset($prodotto['promozione'])`.
5. Aggiungi un confronto esplicito con `null`. Se la chiave è assente, il campo `promozione_nulla` del riepilogo deve essere `false`, senza avvisi di chiave inesistente.
6. Restituisci l'array associativo con i sette campi richiesti. Il codice fornito lo serializza in JSON.

## Esecuzione e risultato atteso

```bash
php 09-php-leggere-json/main.php
```

```json
{
  "negozio": "Laboratorio TPSIT",
  "numero_prodotti": 3,
  "unita_totali": 13,
  "valore_magazzino_centesimi": 44870,
  "promozione_presente": true,
  "promozione_nulla": true,
  "isset_promozione": false
}
```

## Prove e suggerimenti

Su una copia del catalogo in `output/catalogo-senza-promozione.json` rimuovi la proprietà dal primo prodotto:

```bash
php 09-php-leggere-json/main.php 09-php-leggere-json/output/catalogo-senza-promozione.json
```

I tre campi finali devono ora essere `false`. La copia non è più conforme allo schema: serve a osservare il comportamento delle funzioni PHP.

Prova inoltre un file illeggibile e il testo errato dell'esercizio 02:

```bash
php 09-php-leggere-json/main.php file-inesistente.json
php 09-php-leggere-json/main.php dati/prodotto-da-correggere.txt
```

Il programma deve stampare l'errore su stderr e terminare con codice `1`. Un JSON valido il cui valore principale è `null` non è invece un errore di sintassi: non ha però la struttura di un catalogo.

## Consegna

Consegna script e resoconto. Spiega perché `isset` restituisce `false` anche quando la proprietà esiste e contiene `null`, e confronta il risultato con `Object.hasOwn` in JavaScript.

Riferimenti: [json_decode](https://www.php.net/manual/en/function.json-decode.php), [array_key_exists](https://www.php.net/manual/en/function.array-key-exists.php), [isset](https://www.php.net/manual/en/function.isset.php).
