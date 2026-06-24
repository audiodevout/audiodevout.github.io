"use strict";

const LONG_PRESS_MS = 600;

function getHttpOrigin() {
  try {
    const u = new URL(window.VJC_SERVER || "ws://127.0.0.1:3000");
    return `http://${u.hostname}:${u.port || 3000}`;
  } catch (_) {
    return "http://127.0.0.1:3000";
  }
}

let toastTimer = null;
function showToast(message, durationMs = 4000) {
  const el = document.getElementById("vjc-toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("vjc-toast--visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("vjc-toast--visible");
    toastTimer = null;
  }, durationMs);
}

function hapticShort() {
  if (navigator.vibrate) navigator.vibrate(12);
}

async function fetchPresets() {
  const res = await fetch(`${getHttpOrigin()}/api/presets`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load presets");
  return res.json();
}

async function savePreset() {
  const res = await fetch(`${getHttpOrigin()}/api/presets`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not save preset");
  return data;
}

async function applyPreset(id) {
  const res = await fetch(`${getHttpOrigin()}/api/presets/${encodeURIComponent(id)}/apply`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not apply preset");
  return data;
}

async function deletePreset(id) {
  const res = await fetch(`${getHttpOrigin()}/api/presets/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not delete preset");
  return data;
}

function setupLongPress(el, onLongPress) {
  let timer = null;
  el._longPressFired = false;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el._longPressFired = false;
    clear();
    timer = setTimeout(() => {
      el._longPressFired = true;
      onLongPress();
    }, LONG_PRESS_MS);
  });

  el.addEventListener("pointerup", () => clear());
  el.addEventListener("pointercancel", () => clear());
  el.addEventListener("pointerleave", () => clear());
}

function renderPresets(presets) {
  const grid = document.getElementById("presets-grid");
  const empty = document.getElementById("presets-empty");
  if (!grid) return;

  grid.innerHTML = "";

  if (!presets.length) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  for (const preset of presets) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vjc-preset";
    btn.dataset.id = preset.id;
    btn.innerHTML = `<span class="vjc-preset__name">${preset.name}</span>`;

    setupLongPress(btn, async () => {
      hapticShort();
      if (!confirm(`Delete ${preset.name}?`)) return;
      try {
        await deletePreset(preset.id);
        showToast(`Deleted ${preset.name}`);
        await loadAndRender();
      } catch (err) {
        showToast(err.message || "Delete failed");
      }
    });

    btn.addEventListener("click", async () => {
      if (btn._longPressFired) {
        btn._longPressFired = false;
        return;
      }
      try {
        const data = await applyPreset(preset.id);
        showToast(`Applied ${data.preset?.name || preset.name}`);
        hapticShort();
        btn.classList.add("vjc-preset--flash");
        setTimeout(() => btn.classList.remove("vjc-preset--flash"), 200);
      } catch (err) {
        showToast(err.message || "Apply failed");
      }
    });

    grid.appendChild(btn);
  }
}

async function loadAndRender() {
  try {
    const data = await fetchPresets();
    renderPresets(data.presets || []);
  } catch (err) {
    showToast(err.message || "Load failed");
  }
}

function init() {
  const saveBtn = document.getElementById("btn-save-preset");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      try {
        const data = await savePreset();
        showToast(`Saved ${data.preset?.name || "preset"}`);
        hapticShort();
        await loadAndRender();
      } catch (err) {
        showToast(err.message || "Could not save preset");
      }
    });
  }

  loadAndRender();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
