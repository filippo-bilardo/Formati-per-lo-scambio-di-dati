"""Guida 07: legge un catalogo JSON via HTTP e ne mostra un riepilogo."""

import argparse
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


LIMITE_BYTE = 1024 * 1024


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:8000/catalogo.json")
    args = parser.parse_args()

    try:
        richiesta = Request(args.url, headers={"Accept": "application/json"})
        with urlopen(richiesta, timeout=5) as risposta:
            stato = risposta.status
            tipo = risposta.headers.get_content_type()
            if stato != 200:
                raise ValueError(f"Stato HTTP inatteso: {stato}")
            if tipo != "application/json":
                raise ValueError(f"Tipo di contenuto inatteso: {tipo}")
            contenuto = risposta.read(LIMITE_BYTE + 1)
            if len(contenuto) > LIMITE_BYTE:
                raise ValueError("Il documento supera il limite di 1 MiB")

        catalogo = json.loads(contenuto.decode("utf-8"))
        if not isinstance(catalogo, dict):
            raise ValueError("Il catalogo deve essere un oggetto")
        if not isinstance(catalogo.get("negozio"), str):
            raise ValueError("Manca il nome del negozio o il tipo è errato")
        if not isinstance(catalogo.get("prodotti"), list):
            raise ValueError("Manca l'array dei prodotti o il tipo è errato")
    except HTTPError as errore:
        print(f"Errore HTTP: {errore.code}", file=sys.stderr)
        return 1
    except (URLError, OSError) as errore:
        print(f"Errore di connessione o lettura: {errore}", file=sys.stderr)
        return 1
    except ValueError as errore:
        print(f"Errore nei dati o nella richiesta: {errore}", file=sys.stderr)
        return 1

    print(f"HTTP {stato} | {tipo}")
    print(f"Negozio: {catalogo['negozio']}")
    print(f"Prodotti ricevuti: {len(catalogo['prodotti'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
