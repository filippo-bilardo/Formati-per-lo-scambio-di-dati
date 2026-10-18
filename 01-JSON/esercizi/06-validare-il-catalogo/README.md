# 06 — Validare schema e regole applicative

[Indice degli esercizi](../README.md) · Intermedio · 60 minuti

## Obiettivo

Applicare JSON Schema Draft 2020-12 con Ajv e aggiungere il controllo dell'unicità degli ID.

## Materiale iniziale

[main.js](main.js) legge documento e schema. Completa `trovaErrori(catalogo, schema)`, che restituisce un array di messaggi: vuoto se il catalogo è valido.

Dalla cartella `01-JSON/esercizi`, installa le dipendenze dichiarate in `package.json` con `npm install`, se non lo hai già fatto.

## Passi guidati

1. Crea il validatore con la classe importata da `ajv/dist/2020` e l'opzione `allErrors: true`.
2. Aggiungi i formati con `ajv-formats`, poi compila lo schema ricevuto.
3. Valida il documento. Se fallisce, restituisci messaggi con il percorso `instancePath` e la descrizione dell'errore.
4. Solo se lo schema è superato, raccogli gli ID in un `Set` e segnala quelli ripetuti.
5. Non correggere i dati e non abilitare conversioni automatiche dei tipi.

## Esecuzione

```bash
node 06-validare-il-catalogo/main.js
node 06-validare-il-catalogo/main.js ../esempi/catalogo-non-conforme.json
```

Il primo comando deve stampare `Catalogo valido: 3 prodotti.` e restituire `0`. Il secondo deve segnalare prezzo stringa e quantità negativa, restituendo `1`.

## Prove da preparare

Crea copie separate del catalogo in `output/` e applica una modifica per file:

| Modifica | Esito dopo lo svolgimento |
| --- | --- |
| Rimuovi `promozione` da un prodotto | Errore di schema |
| Lascia `promozione: null` | Valido |
| Imposta `quantita` a `true` | Errore di schema |
| Imposta la data a `2026-02-30` | Errore di formato |
| Duplica `P001`, cambiando soltanto il nome | Errore applicativo sugli ID |
| Inserisci una virgola finale nel testo | Errore di parsing, codice `2` |

Nel resoconto indica perché il controllo sugli ID deve seguire lo schema: solo dopo puoi supporre che `prodotti` sia un array di oggetti con ID stringa.

## Suggerimenti e consegna

La parte CLI è già predisposta: usa `0` per un catalogo valido, `1` per violazioni dei dati e `2` per lettura, parsing o preparazione dello schema non riusciti. La funzione deve restituire i messaggi, non terminare il processo.

`JSON.parse` conserva l'ultimo valore di una chiave ripetuta: questa attività non implementa il controllo delle chiavi duplicate nel testo. Non confonderlo con gli ID ripetuti tra prodotti.

Consegna script, almeno tre copie di prova e una tabella dei sei esiti. Riferimenti: [guida 06](../../06-validazione-con-json-schema.md), [Ajv per Draft 2020-12](https://ajv.js.org/json-schema.html#draft-2020-12), [ajv-formats](https://ajv.js.org/packages/ajv-formats.html).
