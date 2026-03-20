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

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

WS_PORT=$(node -e "try{const c=require('./config.json');console.log(c.wsPort||3000)}catch(e){console.log(3000)}")
OSC_PORT=$(node -e "try{const c=require('./config.json');console.log(c.oscPort||6969)}catch(e){console.log(6969)}")
OSC_HOST=$(node -e "try{const c=require('./config.json');console.log(c.oscHost||'127.0.0.1')}catch(e){console.log('127.0.0.1')}")

DETECTED_IP=$(node server/ip-detect.js)
if [[ -z "$DETECTED_IP" || "$DETECTED_IP" == "ERROR" ]]; then
  echo "Could not detect a LAN IP. Connect to Wi‑Fi or Ethernet, then try again."
  exit 1
fi

node -e "const fs=require('fs');const p='./config.json';let c={};try{c=require(p)}catch(e){};c.detectedIp=process.argv[1];fs.writeFileSync(p,JSON.stringify(c,null,2))" "$DETECTED_IP"

if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i ":${WS_PORT}" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "${PIDS:-}" ]]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
    echo "Freed port ${WS_PORT}"
  fi
fi

TD_PATH=$(node -e "try{const c=require('./config.json');if(c.tdProjectPath)console.log(c.tdProjectPath)}catch(e){}" 2>/dev/null || true)
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
echo "  Controller: http://${DETECTED_IP}:${WS_PORT}"
echo "  OSC (UDP):  ${OSC_HOST}:${OSC_PORT}  → TouchDesigner OSC In CHOP"
echo ""
node server/qr-generate.js "$DETECTED_IP" "$WS_PORT"
echo "Scan the QR with your phone (same network as this computer)."
echo "Test on this machine first: open the URL above in a browser."
echo "Press Ctrl+C to stop."
echo ""

exec node server/index.js
