# 05 — Elaborare ordini e scorte

[Indice degli esercizi](../README.md) · Avanzato · 90–120 minuti

## Obiettivo

Integrare due documenti JSON e aggiornare il magazzino soltanto quando un ordine è interamente accettabile.

## Materiale iniziale e contratto

[main.js](main.js) legge il catalogo originale e [ordini.json](../dati/ordini.json). Completa `elaboraOrdini(catalogo, ordini)`, che restituisce `{ catalogo, report }`.

Ogni ordine ha un `id` e un array non vuoto `righe`. Ogni riga indica `prodotto_id` e una quantità intera positiva. Nei dati di partenza un prodotto compare al massimo una volta per ordine. Gli ordini vanno elaborati nell'ordine dell'array, usando le scorte rimaste dopo gli ordini accettati.

## Passi guidati

1. Per ogni ordine cerca i prodotti delle righe tramite il loro ID.
2. Se un prodotto non esiste, rifiuta l'ordine con motivo `PRODOTTO_ASSENTE`.
3. Se una quantità non è intera positiva, rifiuta l'ordine con motivo `QUANTITA_NON_VALIDA`.
4. Se una scorta non basta, rifiuta l'ordine con motivo `SCORTE_INSUFFICIENTI`.
5. Controlla tutte le righe prima di cambiare le quantità. In questo esercizio il primo errore rilevato, seguendo l'ordine delle righe, determina il motivo del rifiuto.
6. Solo quando tutte le righe passano, sottrai le quantità e calcola il totale dell'ordine in centesimi.
7. Costruisci il report con conteggi e somma dei soli ordini accettati. Rifiutare un ordine non deve impedire di esaminare i successivi.

Ogni elemento di `report.esiti` deve avere `id` e `stato` (`accettato` o `rifiutato`); aggiungi `totale_centesimi` per gli accettati e `motivo` per i rifiutati.

## Esecuzione e risultati attesi

```bash
node 05-elaborare-ordini/main.js
```

| Ordine | Stato | Totale o motivo |
| --- | --- | --- |
| `O001` | accettato | `10570` centesimi |
| `O002` | rifiutato | `SCORTE_INSUFFICIENTI` |
| `O003` | rifiutato | `SCORTE_INSUFFICIENTI` |
| `O004` | rifiutato | `PRODOTTO_ASSENTE` |
| `O005` | rifiutato | `SCORTE_INSUFFICIENTI` |

Il report deve avere `accettati: 1`, `rifiutati: 4`, `totale_accettato_centesimi: 10570` e cinque elementi in `esiti`.

Il programma salva `output/report-ordini.json` e `output/catalogo-residuo.json`. Nel catalogo residuo le quantità devono essere `P001 = 6`, `P002 = 0`, `P003 = 4`, con valore totale `34300` centesimi.

## Prove e suggerimenti

`O005` è la prova essenziale: la prima riga sarebbe disponibile, la seconda no. La quantità di `P001` deve restare `6`, non diventare `5`.

Crea inoltre un file `output/ordini-vuoti.json` contenente `[]` e passalo al programma:

```bash
node 05-elaborare-ordini/main.js 05-elaborare-ordini/output/ordini-vuoti.json
```

Devono risultare zero accettati, zero rifiutati, totale zero e catalogo invariato. Su un'altra copia inserisci quantità `0` in un ordine e verifica il relativo motivo di rifiuto.

Separa una fase di controllo da una fase di aggiornamento. Modificare il catalogo in memoria è consentito; scrivere nel file originale no.

## Consegna

Consegna script, i due risultati sui cinque ordini originali e resoconto. Spiega come hai evitato un aggiornamento parziale. Come estensione facoltativa, supporta prodotti ripetuti nello stesso ordine, sommando prima le quantità richieste.

Riferimenti: [guida 04](../../04-oggetti-array-e-modellazione.md), [guida 05](../../05-parsing-e-serializzazione.md).
