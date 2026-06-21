#!/usr/bin/env bash
# 6969osc — macOS / Linux launcher (install deps, show QR, run server).
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install LTS (v18+) from https://nodejs.org"
  exit 1
fi

if [[ ! -f config.json ]]; then
  cp config.example.json config.json
  echo "Created config.json from config.example.json (edit if needed)."
fi

if [[ ! -f presets.json ]]; then
  cp presets.example.json presets.json
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

WS_PORT=$(node server/launcher-config.js read-port)
OSC_PORT=$(node server/launcher-config.js read-osc | head -n 1)
OSC_HOST=$(node server/launcher-config.js read-osc | tail -n 1)

DETECTED_IP=$(node server/detect-ip-retry.js 3 2000)
if [[ -z "$DETECTED_IP" || "$DETECTED_IP" == "ERROR" ]]; then
  echo "Could not detect a LAN IP. Connect to Wi‑Fi or Ethernet, then try again."
  exit 1
fi

node server/launcher-config.js merge-ip "$DETECTED_IP"

node server/check-port.js "$WS_PORT"

TD_PATH=$(node server/launcher-config.js read-td 2>/dev/null || true)
if [[ -n "${TD_PATH:-}" && -f "$TD_PATH" ]]; then
  if [[ "$(uname -s)" == "Darwin" ]]; then
    if ! pgrep -i touchdesigner >/dev/null 2>&1; then
      open -a TouchDesigner "$TD_PATH" 2>/dev/null || open "$TD_PATH"
    fi
  elif command -v pgrep >/dev/null 2>&1 && ! pgrep -i touchdesigner >/dev/null 2>&1; then
    xdg-open "$TD_PATH" 2>/dev/null || true
  fi
fi

echo ""
echo "  Starting server on port ${WS_PORT}..."
node server/index.js >> server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

if ! node server/wait-ready.js "$WS_PORT" 30000; then
  echo "Server did not start — check server.log"
  exit 1
fi

echo "  Controller: http://${DETECTED_IP}:${WS_PORT}"
echo "  Presets:    http://${DETECTED_IP}:${WS_PORT}/presets.html"
echo "  OSC (UDP):  ${OSC_HOST}:${OSC_PORT}  → TouchDesigner OSC In CHOP"
echo ""
node server/qr-generate.js "$DETECTED_IP" "$WS_PORT"
echo "Scan the QR with your phone (same network as this computer)."
echo "Press Ctrl+C to stop."
echo ""

wait "$SERVER_PID"
