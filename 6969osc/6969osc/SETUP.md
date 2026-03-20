# 6969osc — Setup Guide

**Site & downloads:** [audiodevout.github.io/6969osc](https://audiodevout.github.io/6969osc/)

## One-Time Setup (do this once per machine)

1. **Install Node.js LTS** (v18 or newer) from [nodejs.org](https://nodejs.org/) (direct download link).
   - Test: open Command Prompt, type `node --version`.

2. If `config.json` is missing, copy `config.example.json` to `config.json` and edit as needed.

3. **(Optional)** Set TouchDesigner project path in `config.json`:
   ```json
   "tdProjectPath": "C:\\path\\to\\your\\project.toe"
   ```

4. **Double-click** `START.bat` — it handles everything else.

### OSC tuning (`config.json`)

| Key | Default | What it does |
|-----|---------|----------------|
| `oscRateLimit` | `60` | Max **messages per second per OSC address** (each scene index, master, etc. has its own address). Higher = smoother updates but more UDP packets. |
| `oscBundleWindow` | `16` | Milliseconds to **coalesce** each XY pad’s x/y into **one bundle** (two floats). Lower = lower latency; higher = fewer packets (better on busy WiFi). |
| `heartbeatInterval` | `5000` | How often the server checks the phone connection (ms). |
| `heartbeatTimeout` | `3` | Used with `heartbeatInterval` to compute the default wait after a server ping (unless `pongTimeoutMs` is set). |
| `pongTimeoutMs` | _(optional)_ | Override wait time (ms) for a phone response after a server ping. |

Do not commit a machine-specific `detectedIp` to git — `START.bat` overwrites it when you run.

TouchDesigner receives the same addresses either way; only timing and packet count change.

---

## TouchDesigner Setup (do this once per TD project)

- Add an **OSC In CHOP**
- **Port:** 6969
- **Protocol:** UDP
- **Network address:** localhost / 127.0.0.1
- **Active:** On

### OSC addresses that will arrive

| Address | Type | Range | UI |
|---------|------|-------|-----|
| `/button1` … `/button8` | float | 0.0 or 1.0 | Pads **01–08** (momentary) |
| `/toggle1` … `/toggle8` | float | 0.0 or 1.0 | Pads **09–16** (toggle on/off) |
| `/x1`, `/y1`, `/x2`, `/y2`, `/x3`, `/y3`, `/x4`, `/y4` | float | 0.0–1.0 | Four XY pads |
| `/master` | float | 0.0–1.0 | Opacity strip |

---

## At the Venue (every time)

1. Connect PC to venue WiFi.
2. Double-click `START.bat`.
3. Scan the QR code in the terminal with your phone.
4. **6969osc** loads in your phone browser — no app install needed.

---

## Troubleshooting

**Phone can't connect:**
- Check PC and phone are on the same WiFi network.
- Some venue routers block device-to-device traffic (AP isolation).
  - Ask venue for a network without client isolation, or
  - Use your phone's hotspot with the PC connected to it.

**TouchDesigner not receiving:**
- Verify OSC In CHOP is set to port **6969**, protocol UDP.
- Check TD is running before or shortly after START.bat.

**Controller page does not load on phone ("This site can't be reached"):**

1. **Test on PC first** — On the PC, open `http://[your-IP]:3000` in a browser (the IP is shown when you run START.bat). If it works on PC but not phone, it's a network/firewall issue.

2. **Run as Administrator** — Right-click START.bat → Run as administrator. The firewall rule must be added; without admin rights it will fail silently.

3. **Same WiFi network** — PC and phone must be on the same WiFi. If the PC is on Ethernet and phone on WiFi, they might be on different subnets.

4. **Manually allow the port** — Open Windows Defender Firewall → Advanced settings → Inbound Rules → New Rule → Port → TCP, 3000 → Allow → Apply to all profiles. Name it `6969osc` (or match your `wsPort`).

5. **AP isolation** — Some venue/cafe WiFi blocks device-to-device traffic. **Workaround:** Use your phone's hotspot — connect the PC to your phone's hotspot, then run START.bat. The QR will show the new IP; scan it and the controller will load.

6. **Temporarily disable firewall to test** — If disabling Windows Firewall makes it work, the firewall rule needs adjustment (try step 4).

**QR code shows wrong IP:**
- Run START.bat again to regenerate the terminal QR.
