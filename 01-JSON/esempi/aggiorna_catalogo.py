"""Guida 05: legge un catalogo, incrementa P001 e salva una copia."""

import argparse
import json
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "catalogo", nargs="?", type=Path,
        default=Path(__file__).with_name("catalogo.json"),
    )
    parser.add_argument("--output", type=Path, default=Path("catalogo-aggiornato.json"))
    args = parser.parse_args()

    try:
        if args.catalogo.resolve() == args.output.resolve():
            raise ValueError("Scegli un file di output diverso dall'originale")

        with args.catalogo.open(encoding="utf-8") as file:
            catalogo = json.load(file)

        # Questo esempio presuppone dati che rispettano il modello del catalogo.
        disponibili = [p["id"] for p in catalogo["prodotti"] if p["quantita"] > 0]
        prodotto = next((p for p in catalogo["prodotti"] if p["id"] == "P001"), None)
        if prodotto is None:
            raise ValueError("Il catalogo non contiene il prodotto P001")
        prodotto["quantita"] += 1

        # Serializziamo prima di aprire l'output, così un errore di conversione
        # non tronca un eventuale file di lavoro già presente.
        testo = json.dumps(catalogo, ensure_ascii=False, indent=2, allow_nan=False)
        args.output.write_text(testo + "\n", encoding="utf-8")
    except (OSError, ValueError, KeyError, TypeError) as errore:
        print(f"Errore: {errore}", file=sys.stderr)
        return 1

    print("Disponibili: " + ", ".join(disponibili))
    print(f"Quantita P001 aggiornata: {prodotto['quantita']}")
    print(f"Salvato: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
