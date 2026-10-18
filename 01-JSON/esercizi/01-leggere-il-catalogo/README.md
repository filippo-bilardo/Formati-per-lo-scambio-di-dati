# 01 — Leggere il catalogo con Node.js

[Indice degli esercizi](../README.md) · Base · 30–40 minuti

## Obiettivo

Distinguere testo JSON, oggetti JavaScript e array; accedere ai valori annidati senza confondere una proprietà assente con `null`.

## Materiale iniziale

Apri [main.js](main.js) e il [catalogo](../../esempi/catalogo.json). La lettura UTF-8 e il parsing sono già predisposti. Devi completare `creaRiepilogo(catalogo)`, che restituisce un oggetto.

## Passi guidati

1. Esegui lo script e individua il TODO che ne interrompe il funzionamento.
2. Identifica il tipo di `catalogo`, di `catalogo.prodotti` e di `quantita` del primo prodotto. Annota nel resoconto quale controllo usi per riconoscere un array.
3. Estrai nome del negozio, numero di prodotti, ID del primo prodotto e sua prima etichetta.
4. Controlla separatamente presenza di `promozione` e confronto del suo valore con `null`.
5. Restituisci l'oggetto richiesto e rimuovi il `throw` iniziale.

## Esecuzione e risultato atteso

Dalla cartella `01-JSON/esercizi`:

```bash
node 01-leggere-il-catalogo/main.js
```

```json
{
  "negozio": "Laboratorio TPSIT",
  "numero_prodotti": 3,
  "primo_prodotto": "P001",
  "prima_etichetta": "usb",
  "promozione_presente": true,
  "promozione_nulla": true
}
```

## Suggerimenti

Usa `.length` per il numero di elementi e `[0]` per il primo. Per la presenza consulta `Object.hasOwn`; per il valore usa `=== null`. `typeof null` non è un controllo adatto a riconoscere `null`.

## Prove e consegna

Crea una copia del catalogo in `output/catalogo-senza-promozione.json` e rimuovi solo `promozione` dal primo prodotto. Passa il file come argomento:

```bash
node 01-leggere-il-catalogo/main.js 01-leggere-il-catalogo/output/catalogo-senza-promozione.json
```

Ora i due controlli sulla promozione devono essere `false`. Il documento non rispetta più lo schema del capitolo: qui lo usiamo soltanto per osservare l'accesso alle proprietà.

Consegna script e `verifica.md`. Spiega perché `"8"` e `8` non sono intercambiabili e perché il primo `false` dell'ultima prova riguarda la presenza, il secondo il valore.

Riferimenti: [guida 03](../../03-tipi-di-dati.md), [guida 04](../../04-oggetti-array-e-modellazione.md).
