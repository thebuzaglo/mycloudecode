"""TradingView integration.

Inbound: a tiny HTTP server that receives TradingView alert webhooks with bar
data. Create one alert per (symbol, timeframe) on your personal TradingView
chart with "Once Per Bar Close" and this message body:

    {
      "secret": "YOUR_SECRET",
      "symbol": "{{ticker}}",
      "timeframe": "{{interval}}",
      "time": {{timenow}},
      "open": {{open}}, "high": {{high}}, "low": {{low}},
      "close": {{close}}, "volume": {{volume}}
    }

and point the alert's Webhook URL at  http://<bot-host>:<port>/webhook .

GET /status returns live bot state (rules, weights, performance stats).
"""

from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Callable, Optional

# payload dict -> handled ok?
AlertCallback = Callable[[dict], bool]
StatusProvider = Callable[[], dict]


def normalize_symbol(raw: str) -> str:
    """'CME_MINI:NQ1!' -> 'NQ', 'NQM2026' -> 'NQ' (best effort)."""
    sym = raw.split(":")[-1].upper()
    for marker in ("1!", "2!"):
        sym = sym.replace(marker, "")
    # strip futures month codes like NQM2026 / NQH26
    while sym and sym[-1].isdigit():
        sym = sym[:-1]
    if len(sym) > 2 and sym[-1] in "FGHJKMNQUVXZ":
        sym = sym[:-1]
    return sym


class WebhookServer:
    def __init__(self, host: str, port: int, secret: str,
                 on_alert: AlertCallback,
                 status_provider: Optional[StatusProvider] = None) -> None:
        self.secret = secret
        self.on_alert = on_alert
        self.status_provider = status_provider or (lambda: {})
        outer = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, fmt, *args):  # quiet default logging
                pass

            def _reply(self, code: int, body: dict) -> None:
                data = json.dumps(body).encode()
                self.send_response(code)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

            def do_GET(self):
                if self.path == "/status":
                    self._reply(200, outer.status_provider())
                else:
                    self._reply(404, {"error": "not found"})

            def do_POST(self):
                if self.path != "/webhook":
                    self._reply(404, {"error": "not found"})
                    return
                try:
                    length = int(self.headers.get("Content-Length", "0"))
                    payload = json.loads(self.rfile.read(length) or b"{}")
                except (ValueError, json.JSONDecodeError):
                    self._reply(400, {"error": "invalid json"})
                    return
                if outer.secret and payload.get("secret") != outer.secret:
                    self._reply(403, {"error": "bad secret"})
                    return
                payload.pop("secret", None)
                try:
                    ok = outer.on_alert(payload)
                except Exception as exc:
                    self._reply(500, {"error": str(exc)})
                    return
                self._reply(200 if ok else 422,
                            {"ok": ok} if ok else {"error": "unhandled"})

        self._server = ThreadingHTTPServer((host, port), Handler)
        self._thread = threading.Thread(target=self._server.serve_forever,
                                        daemon=True)

    def start(self) -> None:
        self._thread.start()

    def stop(self) -> None:
        self._server.shutdown()
