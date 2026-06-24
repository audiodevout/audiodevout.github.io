# Changelog

## 1.1.0

### Features

- **Presets** — tap **+** on the control page or preset page to save the current full state (all 16 buttons, 4 XY pads, master fader) to `presets.json` on the show computer
- **Preset page** (`/presets.html`) — tap a preset to recall instantly; long-press to delete
- **Randomize** — **RND** button on the control page randomizes all levels and sends OSC in one burst

### Fixes

- Launchers wait until the server responds before showing the QR code (`server/wait-ready.js`)
- macOS/Linux launcher starts the server before printing the QR (was reversed in v1.0)
- Removed Google Fonts `@import` so the controller loads offline on LAN-only phones
- Faster first WebSocket connect retries and visible **CONNECTING…** status
- Momentary buttons (01–08) use pointer capture so they cannot stick ON when the finger slides off
- Momentary scene messages are not queued while disconnected (prevents stale OSC on reconnect)
- WebSocket reconnect cleanup (no duplicate sockets)
- Server errors shown as toasts on the phone
- Launcher config merge preserves all `config.json` keys (no wipe on bad JSON)
- Smarter port conflict handling — only stops 6969osc processes, warns on foreign port use
- IP detection retries 3× at boot

## 1.0.0

- Initial release: phone WebSocket controller, OSC UDP to TouchDesigner, QR launcher, 16 buttons, 4 XY pads, master fader
