"""Guida 06: controlla parsing, schema e unicità degli ID del catalogo."""

import argparse
import json
from pathlib import Path
import sys

try:
    from jsonschema import Draft202012Validator, FormatChecker
    from jsonschema.exceptions import SchemaError
except ImportError:
    print("Installa le dipendenze: python -m pip install -r esempi/requirements.txt", file=sys.stderr)
    raise SystemExit(2)


def rifiuta_costante(valore):
    """NaN e Infinity non appartengono al JSON standard."""
    raise ValueError(f"Costante non JSON: {valore}")


def oggetto_senza_duplicati(coppie):
    """Rifiuta le chiavi ripetute prima che il dizionario le sovrascriva."""
    risultato = {}
    for chiave, valore in coppie:
        if chiave in risultato:
            raise ValueError(f"Chiave duplicata: {chiave}")
        risultato[chiave] = valore
    return risultato


def leggi_json(percorso):
    with percorso.open(encoding="utf-8") as file:
        return json.load(
            file,
            parse_constant=rifiuta_costante,
            object_pairs_hook=oggetto_senza_duplicati,
        )


def posizione(errore):
    # La notazione /prodotti/0/quantita indica il percorso nel documento.
    parti = [str(p).replace("~", "~0").replace("/", "~1") for p in errore.absolute_path]
    return "/" + "/".join(parti) if parti else "(radice)"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "catalogo", nargs="?", type=Path,
        default=Path(__file__).with_name("catalogo.json"),
    )
    args = parser.parse_args()

    try:
        schema = leggi_json(Path(__file__).with_name("catalogo.schema.json"))
        catalogo = leggi_json(args.catalogo)
        Draft202012Validator.check_schema(schema)
    except (OSError, ValueError) as errore:
        print(f"Errore di lettura o parsing: {errore}", file=sys.stderr)
        return 2
    except SchemaError as errore:
        print(f"Schema non valido: {errore.message}", file=sys.stderr)
        return 2

    validatore = Draft202012Validator(schema, format_checker=FormatChecker())
    errori = sorted(validatore.iter_errors(catalogo), key=posizione)
    if errori:
        for errore in errori:
            print(f"Schema {posizione(errore)}: {errore.message}", file=sys.stderr)
        return 1

    # Eseguiamo la regola applicativa dopo aver verificato la struttura.
    identificativi = set()
    duplicati = set()
    for prodotto in catalogo["prodotti"]:
        if prodotto["id"] in identificativi:
            duplicati.add(prodotto["id"])
        identificativi.add(prodotto["id"])
    if duplicati:
        print("ID duplicati: " + ", ".join(sorted(duplicati)), file=sys.stderr)
        return 1

    print(f"Catalogo valido: {len(catalogo['prodotti'])} prodotti.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
