# 11 — Una risorsa JSON in PHP, un client in Node.js

[Indice degli esercizi](../README.md) · Intermedio · 60–90 minuti

## Obiettivo

Restituire dati JSON da PHP e verificarne l'interoperabilità con un client JavaScript. Questa attività usa richieste di sola lettura.

## Materiale iniziale

[catalogo.php](catalogo.php) carica il catalogo e predispone la risposta HTTP. Completa `gestisciRichiesta($metodo, $parametri, $catalogo)`, che restituisce una coppia `[statoHTTP, datiRisposta]`.

Finché non completi il TODO, lo scheletro restituisce intenzionalmente `501` e un messaggio «Da completare». La gestione dell'intestazione JSON e delle eccezioni di lettura è già presente.

## Passi guidati

1. Accetta soltanto `GET`; per un metodo diverso restituisci `405` e `['errore' => 'Metodo non consentito']`. Il codice fornito aggiunge `Allow: GET`.
2. Se manca `etichetta` nella query, restituisci `200` con il catalogo completo, compresi i prodotti esauriti.
3. Se `etichetta` è presente, richiedi una stringa non vuota dopo `trim`. Per un valore vuoto o per un array restituisci `400` con un oggetto contenente `errore` stringa.
4. Filtra tutti i prodotti per appartenenza all'etichetta, mantenendo i metadati del catalogo. Ricostruisci gli indici dell'array `prodotti`.
5. Per un'etichetta senza corrispondenze restituisci `200` con `prodotti: []`.
6. Rimuovi il `throw` segnaposto. La funzione deve restituire i dati, senza stamparli: la serializzazione è già gestita all'esterno.

## Avvio e prove

Nel primo terminale, dalla cartella degli esercizi:

```bash
php -S 127.0.0.1:8080 -t 11-php-api-json
```

Nel secondo terminale:

```bash
curl -i http://127.0.0.1:8080/catalogo.php
curl -i 'http://127.0.0.1:8080/catalogo.php?etichetta=audio'
curl -i 'http://127.0.0.1:8080/catalogo.php?etichetta=inesistente'
curl -i 'http://127.0.0.1:8080/catalogo.php?etichetta='
curl --globoff -i 'http://127.0.0.1:8080/catalogo.php?etichetta[]=usb'
curl -i -X POST http://127.0.0.1:8080/catalogo.php
```

`--globoff` impedisce a curl di interpretare le parentesi quadre dell'URL. Il server integrato PHP serve per questo laboratorio locale. Interrompilo con `Ctrl+C`.

| Richiesta | Stato atteso | Corpo dopo lo svolgimento |
| --- | --- | --- |
| `GET` senza filtro | `200` | Catalogo con tre prodotti |
| `GET`, etichetta `audio` | `200` | Un prodotto: `P003` |
| `GET`, etichetta inesistente | `200` | Catalogo con array prodotti vuoto |
| `GET`, etichetta vuota | `400` | Oggetto con messaggio di errore |
| `GET`, etichetta come array | `400` | Oggetto con messaggio di errore |
| `POST` | `405` | Oggetto di errore e intestazione `Allow: GET` |

Tutte le risposte devono dichiarare `Content-Type: application/json`, senza testo HTML o messaggi di debug aggiunti al corpo.

## Verifica con Node.js

Puoi usare il client completato nell'esercizio 07:

```bash
node 07-client-http/main.js 'http://127.0.0.1:8080/catalogo.php?etichetta=audio'
```

Deve mostrare `Prodotti ricevuti: 1`. In alternativa usa il client completo già fornito nel capitolo, senza dover svolgere prima il 07:

```bash
node ../esempi/client_catalogo.js 'http://127.0.0.1:8080/catalogo.php?etichetta=audio'
```

Nella prova `audio`, Node.js deve riconoscere `prodotti` come array con un elemento, anche se il prodotto aveva indice `2` nel catalogo originale: questa prova rileva la mancata reindicizzazione PHP. Ripeti con un'etichetta inesistente per controllare anche l'array vuoto.

## Consegna

Consegna `catalogo.php` e resoconto delle sei prove, riportando stato, tipo di contenuto e numero di prodotti quando applicabile. Spiega perché un errore deve essere accompagnato dallo stato HTTP corretto, oltre che da un corpo JSON.

Riferimenti: [guida 07](../../07-json-http-e-configurazioni.md), [server integrato PHP](https://www.php.net/manual/en/features.commandline.webserver.php), [json_encode](https://www.php.net/manual/en/function.json-encode.php).
