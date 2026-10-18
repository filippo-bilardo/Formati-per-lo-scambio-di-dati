# 07 — Un client JSON via HTTP

[Indice degli esercizi](../README.md) · Intermedio · 60 minuti

## Obiettivo

Scaricare JSON, distinguere errori HTTP, formato del corpo e struttura dei dati e salvare soltanto risposte accettabili.

## Materiale iniziale

Completa `scaricaCatalogo(url)` in [main.js](main.js). La funzione deve restituire il catalogo dopo i controlli; stampa del riepilogo e salvataggio sono già presenti.

## Passi guidati

1. Avvia nel primo terminale il server di supporto, dalla cartella degli esercizi:

   ```bash
   node supporto/server-catalogo.js
   ```

2. Nella funzione usa `fetch` con intestazione `Accept: application/json` e timeout di cinque secondi tramite `AbortSignal.timeout(5000)`.
3. Controlla `risposta.ok`: `fetch` non segnala automaticamente un errore per lo stato `404`.
4. Verifica che il tipo di contenuto, separato da eventuali parametri dopo `;`, sia `application/json`.
5. Interpreta il corpo. Richiedi un oggetto diverso da `null` e da un array, un campo `negozio` stringa e un campo `prodotti` array.
6. Restituisci il catalogo solo dopo questi controlli. Un errore deve impedire la scrittura dell'output e produrre codice `1`.

Questi sono controlli minimi; la validazione completa richiede anche lo schema dell'esercizio 06.

## Esecuzione e risultato atteso

Nel secondo terminale:

```bash
node 07-client-http/main.js
```

```text
Negozio: Laboratorio TPSIT
Prodotti ricevuti: 3
```

Il documento completo viene salvato in `output/catalogo-http.json`. La prova positiva deve restituire codice `0`.

## Casi di errore

Il server pronto offre queste risorse:

| Percorso | Risposta | Comportamento richiesto al client |
| --- | --- | --- |
| `/catalogo` | `200`, JSON valido | Ricevere e salvare |
| `/assente` | `404`, corpo JSON | Rifiutare per stato HTTP |
| `/errore` | `500`, corpo JSON | Rifiutare per stato HTTP |
| `/non-json` | `200`, testo semplice | Rifiutare per tipo di contenuto |
| `/json-malformato` | `200`, JSON errato | Rifiutare durante il parsing |

Per provare un percorso diverso passalo come argomento:

```bash
node 07-client-http/main.js http://127.0.0.1:8000/non-json
```

Esegui tutte le prove; poi ferma il server con `Ctrl+C` e verifica l'errore di connessione. Se la porta è occupata, avvia il server con `node supporto/server-catalogo.js 8001` e adatta gli URL.

## Consegna

Consegna script, catalogo ricevuto e tabella delle prove, con stato HTTP quando disponibile e fase che fallisce. Spiega perché uno stato `200` non garantisce né la sintassi JSON né la conformità allo schema.

Estensione facoltativa: limita il corpo letto a 1 MiB, come nel [client completo della guida 07](../../esempi/client_catalogo.js).

Riferimento: [guida 07](../../07-json-http-e-configurazioni.md).
