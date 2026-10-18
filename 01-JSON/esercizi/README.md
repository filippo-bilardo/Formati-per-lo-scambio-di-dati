# Esercizi guidati — JSON con Node.js e PHP

Questo percorso è pensato per attività di laboratorio da assegnare agli studenti. Comprende **otto esercizi Node.js e tre esercizi PHP**, con difficoltà progressiva, dati comuni e risultati verificabili.

Ogni cartella contiene una consegna e uno script iniziale con `TODO`. Gli script sono intenzionalmente incompleti: il messaggio «Da completare» è previsto fino allo svolgimento. I risultati attesi nelle schede si riferiscono al lavoro completato.

## Prerequisiti e preparazione

Servono le basi di JavaScript: funzioni, condizioni, cicli, oggetti, array e gestione delle eccezioni. Prima delle attività PHP occorre conoscere variabili, array e funzioni in PHP.

Usa Node.js 22 o successivo. Per gli esercizi 09–11 serve PHP 8 o successivo con interfaccia CLI. I comandi delle schede vanno eseguiti dalla cartella `01-JSON/esercizi`, salvo indicazioni diverse. Dalla radice del repository:

```bash
cd 01-JSON/esercizi
node --version
php --version
```

L'esercizio 06 richiede Ajv e ajv-formats; installali da questa cartella:

```bash
npm install
```

Gli altri esercizi Node.js usano soltanto le API integrate. Gli esercizi PHP non richiedono Composer. Per i comandi HTTP puoi usare curl; in PowerShell richiama `curl.exe` se `curl` è un alias.

## Percorso

I tempi sono indicativi e includono le verifiche richieste.

| N. | Attività | Linguaggio | Livello | Tempo | Guide di riferimento |
| --- | --- | --- | --- | --- | --- |
| [01](01-leggere-il-catalogo/README.md) | Leggere un catalogo e riconoscere i tipi | Node.js | Base | 30–40 min | 02–04 |
| [02](02-correggere-json/README.md) | Correggere un documento JSON | Node.js | Base | 30–40 min | 02, 05 |
| [03](03-filtri-e-report/README.md) | Filtrare, ordinare e calcolare un report | Node.js | Base | 45–60 min | 04–05 |
| [04](04-aggiornare-le-scorte/README.md) | Aggiornare scorte con parametri CLI | Node.js | Intermedio | 45–60 min | 05, 10 |
| [05](05-elaborare-ordini/README.md) | Elaborare ordini senza aggiornamenti parziali | Node.js | Avanzato | 90–120 min | 04–05 |
| [06](06-validare-il-catalogo/README.md) | Validare schema e regole applicative | Node.js + Ajv | Intermedio | 60 min | 06, 08 |
| [07](07-client-http/README.md) | Ricevere e controllare JSON via HTTP | Node.js | Intermedio | 60 min | 07 |
| [08](08-confrontare-cataloghi/README.md) | Confrontare due versioni di un catalogo | Node.js | Avanzato | 60–90 min | 04, 08 |
| [09](09-php-leggere-json/README.md) | Leggere JSON e gestire `null` | PHP | Base | 30–45 min | 03–05 |
| [10](10-php-esportare-json/README.md) | Filtrare ed esportare un array JSON | PHP | Intermedio | 45–60 min | 04–05 |
| [11](11-php-api-json/README.md) | Esporre JSON da PHP e leggerlo con Node.js | PHP + Node.js | Intermedio | 60–90 min | 07–08 |

Per un primo laboratorio puoi assegnare 01–03. Le attività 04–08 sviluppano elaborazione e integrazione; 09–11 costituiscono un percorso aggiuntivo PHP. Ogni esercizio riparte dai propri dati di ingresso: non richiede i file generati da quello precedente. L'11 può usare il client completato nel 07 oppure il client già disponibile tra gli esempi.

## Dati e convenzioni

- Il documento principale è [catalogo.json](../esempi/catalogo.json), con tre prodotti: `P001`, `P002`, `P003`.
- Lo schema è [catalogo.schema.json](../esempi/catalogo.schema.json).
- [dati](dati/README.md) contiene ordini, una seconda versione del catalogo e un testo intenzionalmente errato.
- I prezzi sono interi in centesimi di euro. Il magazzino iniziale vale `44870` centesimi e contiene `13` unità.
- `P002` ha quantità zero; `promozione` può essere `null`, ma la proprietà deve essere presente.
- Ogni attività deve conservare i file di partenza. Salva i risultati nella sottocartella `output/` dell'esercizio: è esclusa da Git, mentre gli script completati restano tracciabili.

I percorsi negli script iniziali usano `__dirname` in Node.js e `__DIR__` in PHP. Gli argomenti CLI che specifichi tu sono invece risolti rispetto alla cartella corrente: usa i percorsi mostrati nelle schede.

## Supporto HTTP

Il file [supporto/server-catalogo.js](supporto/server-catalogo.js) è completo e si può avviare senza modifiche:

```bash
node supporto/server-catalogo.js
```

Pubblica il catalogo su `http://127.0.0.1:8000/catalogo` e alcune risposte di prova descritte nell'esercizio 07. Per una porta diversa aggiungi il numero come argomento. Termina il server con `Ctrl+C`.

## Cosa consegnare

Per ogni esercizio consegna:

1. lo script completato e gli eventuali documenti JSON prodotti;
2. un file `verifica.md` nella cartella dell'esercizio con i comandi eseguiti e gli esiti;
3. almeno una prova positiva e una prova di errore, quando previste;
4. una breve spiegazione delle scelte e degli errori incontrati.

La directory `output/` è ignorata da Git: per consegnare tramite repository allega i risultati secondo le indicazioni del docente; in un archivio ZIP includili normalmente.

## Valutazione proposta

Ogni attività vale fino a 10 punti: 4 per il risultato, 2 per il rispetto di tipi e contratto, 2 per verifiche e gestione degli errori, 2 per chiarezza del codice e del resoconto. Il docente può scegliere le attività e normalizzare il punteggio sul numero assegnato.

Le schede contengono suggerimenti parziali e risultati attesi. Per il ripasso sono disponibili le [guide del capitolo](../README.md) e le [esercitazioni svolte della guida 09](../09-esercitazioni-e-soluzioni.md).

[Torna al capitolo JSON](../README.md)
