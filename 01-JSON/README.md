# Parte 1: JSON (JavaScript Object Notation)

JSON è un formato testuale per rappresentare e scambiare dati strutturati. Il percorso parte dalla lettura di un documento e arriva alla sua elaborazione, validazione e trasmissione via HTTP.

## Obiettivi

Al termine del percorso saprai:

- scrivere documenti JSON e riconoscere gli errori più comuni;
- scegliere tipi e strutture adatti ai dati da rappresentare;
- distinguere il testo JSON dagli oggetti presenti in memoria;
- leggere, modificare e salvare dati con Python e JavaScript;
- definire vincoli con JSON Schema e controllare regole applicative;
- ricevere JSON via HTTP e interpretare gli errori ai diversi livelli;
- usare strumenti da terminale per ispezionare, filtrare e trasformare documenti.

## Prerequisiti e ambiente

Servono conoscenze di variabili, condizioni, cicli, funzioni, liste e dizionari. La guida 07 introduce i concetti HTTP necessari al laboratorio.

Ogni guida contiene esempi **JavaScript**, affiancati al percorso **Python 3.10 o successivo**. Gli esempi JavaScript di base si possono eseguire nella console del browser; per i file e gli script completi usa **Node.js 22 o successivo**. Per le guide 01–05 non servono librerie esterne; la guida 06 spiega l'installazione di `jsonschema` per Python e di Ajv per Node.js. Java e PHP sono approfondimenti facoltativi.

I comandi delle guide, salvo indicazioni diverse, vanno eseguiti dalla cartella del capitolo. Dalla radice del repository:

```bash
cd 01-JSON
python3 --version
```

Su Windows il comando dell'interprete può essere `py` o `python` al posto di `python3`.

## Guide

| Guida | Contenuti | Risultato pratico |
| --- | --- | --- |
| [01 — Introduzione a JSON](01-introduzione-a-json.md) | Definizione, origini, impieghi e confronto con altri formati | Leggere un primo documento |
| [02 — Sintassi e struttura](02-sintassi-e-struttura.md) | Doppi apici, separatori, escape, UTF-8 ed errori comuni | Correggere un documento |
| [03 — Tipi di dati](03-tipi-di-dati.md) | Sei tipi JSON, `null`, date e corrispondenze con i linguaggi | Scegliere tipi coerenti |
| [04 — Oggetti, array e modellazione](04-oggetti-array-e-modellazione.md) | Annidamento, accesso ai dati e progettazione del catalogo | Modellare prodotti e metadati |
| [05 — Parsing e serializzazione](05-parsing-e-serializzazione.md) | Stringhe, file, trasformazioni e gestione degli errori | Aggiornare il catalogo con Python |
| [06 — Validazione con JSON Schema](06-validazione-con-json-schema.md) | Draft 2020-12, vincoli, errori e regole applicative | Verificare il catalogo |
| [07 — JSON, HTTP e configurazioni](07-json-http-e-configurazioni.md) | Richieste, risposte, API e file di configurazione | Leggere il catalogo via HTTP locale |
| [08 — Strumenti e interoperabilità](08-strumenti-e-interoperabilita.md) | Librerie, editor, numeri, chiavi duplicate e compatibilità | Confrontare strumenti e comportamenti |
| [09 — Esercitazioni e soluzioni](09-esercitazioni-e-soluzioni.md) | Consegne progressive, risultati attesi e soluzioni commentate | Completare un laboratorio integrato |
| [10 — Strumenti da CLI](10-strumenti-da-cli.md) | Python, Node.js, jq, curl e codici di uscita | Ispezionare e trasformare dati dal terminale |

## Caso di studio ed esempi

Per le attività da assegnare agli studenti consulta la cartella [esercizi](esercizi/README.md): contiene **8 esercizi guidati Node.js e 3 PHP**, con script da completare, dati di partenza, prove e criteri di consegna. Il percorso è distinto dalle soluzioni commentate della guida 09.

Il caso di studio è il catalogo di un piccolo negozio di materiale informatico. I prezzi sono espressi in centesimi di euro; la quantità rappresenta le unità a magazzino.

| File | Scopo |
| --- | --- |
| [catalogo.json](esempi/catalogo.json) | Documento di partenza con tre prodotti |
| [catalogo.schema.json](esempi/catalogo.schema.json) | Schema del documento |
| [catalogo-non-conforme.json](esempi/catalogo-non-conforme.json) | JSON sintatticamente valido che viola lo schema |
| [aggiorna_catalogo.py](esempi/aggiorna_catalogo.py) | Filtra i prodotti disponibili e aggiorna una copia del catalogo |
| [valida_catalogo.py](esempi/valida_catalogo.py) | Controlla sintassi, schema e unicità degli identificativi |
| [client_catalogo.py](esempi/client_catalogo.py) | Scarica un documento da un server HTTP locale |
| [aggiorna_catalogo.js](esempi/aggiorna_catalogo.js) | Esegue la trasformazione in JavaScript con Node.js |
| [valida_catalogo.js](esempi/valida_catalogo.js) | Valida schema e ID con Ajv; comportamento sui duplicati spiegato nella guida 08 |
| [client_catalogo.js](esempi/client_catalogo.js) | Riceve il catalogo con `fetch` in Node.js |

Per una prima prova, senza installare librerie:

```bash
python3 -m json.tool esempi/catalogo.json
python3 esempi/aggiorna_catalogo.py --output catalogo-aggiornato.json
```

Il secondo comando crea un file di lavoro; il catalogo iniziale resta disponibile per ripetere gli esercizi. I dati e i prezzi sono inventati.

La stessa prova in JavaScript non richiede dipendenze esterne:

```bash
node esempi/aggiorna_catalogo.js
```

## Risorse ufficiali

- [JSON.org, introduzione e diagrammi della sintassi](https://www.json.org/json-it.html).
- [RFC 8259, formato JSON e indicazioni di interoperabilità](https://www.rfc-editor.org/rfc/rfc8259.html).
- [ECMA-404, specifica della sintassi JSON](https://ecma-international.org/publications-and-standards/standards/ecma-404/).
- [Modulo `json` di Python](https://docs.python.org/3/library/json.html).
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12) e [percorso introduttivo](https://json-schema.org/learn/getting-started-step-by-step).
- [Specifica ECMAScript: oggetto `JSON`](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object).
- [Node.js](https://nodejs.org/en/download), [Ajv](https://ajv.js.org/), [jq](https://jqlang.org/manual/) e [curl](https://curl.se/docs/manpage.html).

[Torna all'indice del corso](../README.md) · [Inizia dalla guida 01](01-introduzione-a-json.md)
