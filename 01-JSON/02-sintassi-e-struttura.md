# 02 — Sintassi e struttura

[Guida precedente](01-introduzione-a-json.md) · [Indice](README.md) · [Guida successiva](03-tipi-di-dati.md)

## Obiettivi

Scrivere documenti sintatticamente corretti, usare gli escape e distinguere le regole JSON dalle estensioni accettate da alcuni strumenti.

## Struttura di un documento

Un documento JSON contiene un solo valore principale. Può essere un oggetto, un array o anche un valore semplice: `42`, `"ciao"`, `true` e `null` sono documenti completi.

Un oggetto usa `{}`; ogni proprietà associa una chiave stringa a un valore con `:`. Le proprietà sono separate da virgole. Un array usa `[]` e separa i valori con virgole.

```json
{
  "negozio": "Laboratorio TPSIT",
  "categorie": ["informatica", "audio"],
  "aperto": true
}
```

Spazi, tabulazioni e ritorni a capo tra i token rendono il documento leggibile senza cambiare i dati. Dentro una stringa, invece, gli spazi fanno parte del valore. L'indentazione a due spazi è una convenzione adottata in queste guide.

## Regole da ricordare

| Regola | Esempio valido | Esempio non valido |
| --- | --- | --- |
| Stringhe e chiavi usano doppi apici | `{"nome": "Mouse"}` | `{'nome': 'Mouse'}` |
| Le chiavi sono stringhe | `{"id": 1}` | `{id: 1}` |
| Nessuna virgola dopo l'ultimo elemento | `[1, 2]` | `[1, 2,]` |
| I letterali sono minuscoli | `true`, `false`, `null` | `True`, `False`, `None` |
| Il separatore decimale è il punto | `14.9` | `14,9` come singolo numero |
| Nessuno zero iniziale nei numeri interi a più cifre | `12`, `0` | `012` |
| Un solo valore principale | `[{"id": 1}, {"id": 2}]` | `{"id": 1} {"id": 2}` |

Una virgola può separare due elementi di un array: `[14,9]` è valido, ma contiene due numeri, non il numero decimale 14,9.

Per identificativi con zeri iniziali usa una stringa, per esempio `"0012"`.

## Caratteri speciali ed escape

L'escape introduce con `\` una rappresentazione speciale all'interno di una stringa.

| Sequenza nel JSON | Carattere rappresentato |
| --- | --- |
| `\"` | Doppio apice |
| `\\` | Barra inversa |
| `\n` | Ritorno a capo |
| `\r` | Ritorno del carrello |
| `\t` | Tabulazione |
| `\u00e8` | Il carattere `è` |

```json
{
  "descrizione": "Tastiera \"Studio\"",
  "percorso": "C:\\cataloghi\\prodotti.json",
  "nota": "Prima riga\nSeconda riga",
  "categoria": "Accessori e novità"
}
```

Il testo JSON della nota contiene `\n`; dopo il parsing, il valore in memoria contiene un ritorno a capo. Un ritorno a capo letterale dentro le virgolette renderebbe il documento non valido. Anche gli altri caratteri di controllo U+0000–U+001F richiedono escape.

## Unicode e UTF-8

Unicode identifica i caratteri; UTF-8 è una codifica usata per trasformare il testo in byte. Nello scambio tra sistemi aperti lo standard richiede UTF-8. Salva quindi gli esempi come UTF-8 senza BOM.

Le stringhe `"caffè"` e `"caff\u00e8"` rappresentano lo stesso valore. Non è necessario sostituire tutte le lettere accentate con escape.

## Assenza di commenti nel JSON standard

I commenti `// ...` e `/* ... */` non fanno parte della grammatica JSON. Alcuni editor o strumenti leggono varianti come JSONC o JSON5: il loro supporto non rende quelle sintassi JSON standard.

Inserisci le spiegazioni nel README o nella documentazione dello schema. Una proprietà come `"nota"` è un dato del documento e deve essere prevista dall'accordo tra le applicazioni.

## Una prova al terminale

Dalla cartella `01-JSON`:

```bash
python3 -m json.tool esempi/catalogo.json
```

Il comando legge il file e stampa una versione indentata. Per gli errori ordinari, come un apice singolo o una virgola finale, restituisce un messaggio con la posizione del problema.

Questo comando non applica JSON Schema e il parser Python accetta alcune estensioni, tra cui `NaN`. La guida 08 spiega come controllare queste situazioni; un parser che accetta un testo non dimostra sempre la sua conformità allo standard.

## Verificare la sintassi con JavaScript

Nella console del browser o in Node.js, prova un documento valido e due testi non validi:

```javascript
const documenti = [
  '{"nome":"Mouse","quantita":0}',
  "{'nome':'Mouse'}",
  '{"nome":"Mouse",}',
];

for (const testo of documenti) {
  try {
    const dati = JSON.parse(testo);
    console.log("Valido:", dati.nome);
  } catch (errore) {
    console.log("JSON non valido:", errore.name);
  }
}

const nota = { testo: "Prima riga\nSeconda riga" };
console.log(JSON.stringify(nota)); // {"testo":"Prima riga\nSeconda riga"}
```

Il primo documento viene letto; gli altri causano `SyntaxError` per apici singoli e virgola finale. L'ultima istruzione mostra come il serializzatore rappresenta con un escape il ritorno a capo contenuto nella stringa JavaScript.

La virgola dopo l'ultima stringa nell'array JavaScript `documenti` è ammessa dal linguaggio. La stessa virgola finale dentro un testo JSON sarebbe un errore: i due contesti hanno regole diverse.

## Esercizio rapido

Il seguente testo è intenzionalmente errato:

```text
{
  nome: 'Mouse',
  "quantita": 00,
  "disponibile": True,
}
```

Correggilo mantenendo una quantità numerica pari a zero. Il risultato deve essere:

```json
{
  "nome": "Mouse",
  "quantita": 0,
  "disponibile": true
}
```

Il documento corretto è sintatticamente valido. Decidere se `disponibile: true` sia coerente con quantità zero è un problema di significato dei dati, affrontato nelle guide successive.

## Riferimenti

Le regole sono definite nella [grammatica di JSON.org](https://www.json.org/json-it.html) e nella [RFC 8259, sezioni 2–8](https://www.rfc-editor.org/rfc/rfc8259.html#section-2).

[Indice](README.md) · [Prosegui: tipi di dati](03-tipi-di-dati.md)
