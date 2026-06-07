# 6969osc

Phone-based control surface for live visuals. The browser UI talks to a **Node.js** server over **WebSocket**; the server sends **OSC (UDP)** to TouchDesigner (default **`127.0.0.1:6969`**).

**License:** [MIT](LICENSE)

---

## About

6969osc is a small server plus a static controller page. Run it on the same computer as your OSC receiver; open the UI on your phone via QR code on the LAN. No mobile app install.

---

## Features

- Momentary buttons, toggles, four XY pads, master fader
- Configurable OSC host, port, and timing via `config.json`
- QR pairing on venue Wi‑Fi; optional auto-launch TouchDesigner from config

---

## Requirements

- **Node.js** 18+ — [nodejs.org](https://nodejs.org/)
- **TouchDesigner** (or any OSC listener) — UDP, port from config (default `6969`), network `127.0.0.1`
- Phone and computer on the **same network** (see [SETUP.md](SETUP.md) if the phone cannot reach the server)

---

## Quick start

Application files live in this directory. On first launch, if `config.json` is missing, it is created from `config.example.json`.

### Windows

1. Install Node.js LTS.
2. Double-click **`START.bat`**. The first time, **Run as administrator** so Windows Firewall can allow inbound TCP on the web port (default `3000`, or your `wsPort`).
3. Scan the QR code with your phone.

### macOS

1. Install Node.js LTS (Apple Silicon or Intel).
2. In Terminal, `cd` here, then **`./start.sh`**. If needed, run `chmod +x start.sh` once.
3. Scan the QR code with your phone.

If the phone cannot connect, check **System Settings → Network → Firewall** and allow **Node** or the TCP port — details in [SETUP.md](SETUP.md).

### Manual / development

```bash
npm install
npm start
```

Ensure `config.json` exists. You may still need to allow the HTTP port in your OS firewall.

---

## Documentation

| Doc | Description |
|-----|-------------|
| [SETUP.md](SETUP.md) | TouchDesigner OSC addresses, `config.json`, firewall, troubleshooting |
| [RELEASE.md](RELEASE.md) | Building and attaching a release zip |

**Downloads & overview (GitHub Pages):** [audiodevout.github.io/6969osc](https://audiodevout.github.io/6969osc/)

---

## Contributing

Issues and pull requests: [audiodevout/audiodevout.github.io](https://github.com/audiodevout/audiodevout.github.io) (this app lives under `6969osc/6969osc`).
