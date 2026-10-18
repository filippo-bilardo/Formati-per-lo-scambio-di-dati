import json
from http.server import BaseHTTPRequestHandler, HTTPServer


class Gestore(BaseHTTPRequestHandler):
    def do_GET(self):
        dati = {"messaggio": "Ciao dal web service!", "corso": "JSON"}
        corpo = json.dumps(dati, ensure_ascii=False).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)


if __name__ == "__main__":
    with HTTPServer(("127.0.0.1", 3002), Gestore) as server:
        print("Web service su http://127.0.0.1:3002/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
