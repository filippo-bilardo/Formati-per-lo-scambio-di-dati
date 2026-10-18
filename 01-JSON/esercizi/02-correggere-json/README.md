# 02 — Correggere un documento JSON

[Indice degli esercizi](../README.md) · Base · 30–40 minuti

## Obiettivo

Correggere errori di sintassi e verificare alcuni tipi dopo il parsing. Il documento descrive un singolo prodotto, non un catalogo completo.

## Materiale iniziale

[main.js](main.js) legge per impostazione predefinita [prodotto-da-correggere.txt](../dati/prodotto-da-correggere.txt). Il testo contiene errori intenzionali; la gestione dell'eccezione del parser è già presente.

## Passi guidati

1. Esegui lo script sul testo iniziale e annota il primo errore segnalato.
2. Crea la sottocartella `output/` e copia il contenuto del testo in `output/prodotto.json`, usando l'editor.
3. Correggi una categoria di errore alla volta: chiave non quotata, apici singoli, zero iniziale, virgola finale e letterale di assenza del valore.
4. Passa il nuovo file al programma. Il parsing deve riuscire prima di completare la funzione `controllaProdotto`.
5. Nella funzione richiedi `id` stringa non vuota, prezzo e quantità interi non negativi, `etichette` array di stringhe. Richiedi anche `promozione`, con valore stringa non vuota oppure `null`. Lancia un errore quando un controllo fallisce.
6. Quando i controlli passano, la parte già scritta salva `output/prodotto-normalizzato.json` con indentazione.

## Esecuzione e risultati attesi

```bash
node 02-correggere-json/main.js
node 02-correggere-json/main.js 02-correggere-json/output/prodotto.json
```

Il primo comando deve fallire con codice `1`. Dopo lo svolgimento, il secondo deve terminare con codice `0` e stampare `Prodotto valido: P004`.

Nel file salvato devono comparire ID `P004`, nome `Cavo USB`, prezzo numerico `990`, quantità numerica `2`, una sola etichetta `usb` e promozione `null`.

## Suggerimenti

Non correggere il testo sostituendo caratteri in modo automatico. Usa il messaggio di `JSON.parse` per localizzare il problema. Per distinguere un intero da una stringa consulta `Number.isInteger`.

La funzione di controllo deve semplicemente terminare senza errori sui dati validi: rimuovi il `throw` segnaposto quando hai implementato i controlli.

## Prove e consegna

Su una copia del prodotto corretto imposta il prezzo a `"990"`: il parsing deve ancora riuscire, mentre il tuo controllo deve fallire. Prova poi quantità `-1` e promozione assente, separatamente.

Consegna i documenti corretti, lo script e il resoconto delle cinque correzioni. Spiega la differenza tra errore del parser e errore della tua funzione. Non usare lo schema del catalogo per validare direttamente questo singolo prodotto.

Riferimenti: [guida 02](../../02-sintassi-e-struttura.md), [guida 05](../../05-parsing-e-serializzazione.md).
