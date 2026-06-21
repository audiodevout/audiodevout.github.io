# 6969osc — Setup Guide

**Site & downloads:** [audiodevout.github.io/6969osc](https://audiodevout.github.io/6969osc/)

---

## What you need

- **Node.js LTS** (v18 or newer) — [nodejs.org](https://nodejs.org/)  
  Check: `node --version`
- **Same Wi‑Fi** for computer and phone at the venue (or phone hotspot → computer joins it)
- **TouchDesigner** with an **OSC In CHOP** on UDP **6969** (see below)

---

## First run (pick your system)

### Windows

1. Install Node.js LTS from [nodejs.org](https://nodejs.org/).
2. **Double‑click `START.bat`.**  
   - The first time, **Run as administrator** (right‑click → *Run as administrator*) so Windows Firewall can allow port **3000** (or whatever you set as `wsPort` in `config.json`).  
   - If `config.json` is missing, `START.bat` creates it from `config.example.json`.
3. When the QR code appears (after the server is ready), scan it with your phone.

### macOS

1. Install Node.js LTS from [nodejs.org](https://nodejs.org/) (Apple Silicon and Intel installers are both fine).
2. Open **Terminal**, go to the `6969osc` folder, then run:

   ```bash
   chmod +x start.sh    # only needed once
   ./start.sh
   ```

   - If `config.json` is missing, `start.sh` creates it from `config.example.json`.
   - Dependencies install automatically the first time (`npm install`).
3. When the QR code appears (after the server is ready), scan it with your phone.

**macOS firewall:** If the controller opens on this Mac but not on the phone, open **System Settings → Network → Firewall**. Either allow **Node** / **incoming connections** for the terminal app you used, or add a rule to allow **TCP** port **3000** (or your `wsPort`). If macOS asks whether to allow incoming connections for `node`, choose **Allow**.

**Optional (any OS):** From the project folder, after `npm install`, you can run `npm start` instead of the launcher scripts. You still need a correct `config.json` and to allow the HTTP port through the firewall.

---

## Config (`config.json`)

Created automatically on first launch from `config.example.json`, or copy the example file yourself.

**(Optional)** Point TouchDesigner at your `.toe` so the launcher can open it:

- **Windows:** `"tdProjectPath": "C:\\Users\\you\\project.toe"`
- **macOS:** `"tdProjectPath": "/Users/you/Documents/project.toe"`

Do not commit a machine-specific `detectedIp` to git — the launchers refresh it when you run.

### OSC tuning

| Key | Default | What it does |
|-----|---------|----------------|
| `oscRateLimit` | `60` | Max **messages per second per OSC address** (each scene index, master, etc. has its own address). Higher = smoother updates but more UDP packets. |
| `oscBundleWindow` | `16` | Milliseconds to **coalesce** each XY pad’s x/y into **one bundle** (two floats). Lower = lower latency; higher = fewer packets (better on busy Wi‑Fi). |
| `heartbeatInterval` | `5000` | How often the server checks the phone connection (ms). |
| `heartbeatTimeout` | `3` | Used with `heartbeatInterval` to compute the default wait after a server ping (unless `pongTimeoutMs` is set). |
| `pongTimeoutMs` | _(optional)_ | Override wait time (ms) for a phone response after a server ping. |

TouchDesigner receives the same addresses either way; only timing and packet count change.

---

## TouchDesigner (once per project)

- Add an **OSC In CHOP**
- **Port:** `6969` (or your `oscPort` in `config.json`)
- **Protocol:** UDP
- **Network address:** `127.0.0.1` / localhost
- **Active:** On

### OSC addresses

| Address | Type | Range | UI |
|---------|------|-------|-----|
| `/button1` … `/button8` | float | 0.0 or 1.0 | Pads **01–08** (momentary) |
| `/toggle1` … `/toggle8` | float | 0.0 or 1.0 | Pads **09–16** (toggle on/off) |
| `/x1`, `/y1`, `/x2`, `/y2`, `/x3`, `/y3`, `/x4`, `/y4` | float | 0.0–1.0 | Four XY pads |
| `/master` | float | 0.0–1.0 | Opacity strip |

---

## Presets (v1.1+)

- **Save:** tap **+** on the control page or on `/presets.html` to store the current look (all buttons, XY pads, master).
- **Recall:** open **PRESETS** in the status bar, tap a preset — OSC fires immediately.
- **Delete:** long-press a preset on the preset page.
- **Randomize:** tap **RND** on the control page.
- Presets live in `presets.json` on the show computer (created from `presets.example.json` on first run). Up to **32** presets.

---

## At the venue (every time)

1. Join the venue Wi‑Fi (or use **phone hotspot** and connect the computer to it if the network blocks device‑to‑device traffic).
2. **Windows:** double‑click `START.bat` (admin if the firewall rule is missing).  
   **Mac:** `./start.sh` from Terminal in the project folder.
3. Scan the QR code with the phone. The controller runs in the browser — **no app install**.

---

## Troubleshooting

### Phone can’t connect / page won’t load

- Computer and phone must be on the **same network** (same SSID is not enough if the router uses **AP / client isolation** — try a **phone hotspot** with the computer connected to it).
- **On the computer first**, open `http://<IP>:<port>` shown in the terminal (same URL as the QR). If it works there but not on the phone, it’s Wi‑Fi / firewall / isolation — not the app.

### Windows: firewall

- Run **`START.bat` as Administrator** once so it can add the firewall rule.
- Or manually: **Windows Defender Firewall → Advanced settings → Inbound Rules → New Rule → Port → TCP →** your `wsPort` (default **3000**) **→ Allow**.
- If turning the firewall off briefly fixes it, adjust the rule rather than leaving the firewall off.

### macOS: firewall / “can’t be reached” from phone

- **System Settings → Network → Firewall** — allow **Node** or your terminal, or allow **TCP** port **3000** (or `wsPort`).
- Confirm the Mac isn’t on **iPhone USB tethering only** while the phone uses **Wi‑Fi** to a different network — they must reach each other at Layer 3.

### TouchDesigner not receiving OSC

- OSC In CHOP: port **6969**, UDP, **127.0.0.1**.
- Start TouchDesigner before or right after starting 6969osc.

### QR shows a wrong IP

- Run the launcher again so the IP is re-detected.
- If you use VPN, try disconnecting it for the show, or set a static `detectedIp` in `config.json` only for testing (the server overwrites it on some paths — prefer fixing network/VPN).

---

## Files to use

| Platform | Start with |
|----------|------------|
| Windows | `START.bat` |
| macOS / Linux | `./start.sh` (after `chmod +x start.sh` once) |

Both scripts install dependencies if needed, detect the LAN IP, update `detectedIp`, show a QR code, and start the server (Windows minimizes the server window; Mac/Linux run in the foreground — **Ctrl+C** to stop).
