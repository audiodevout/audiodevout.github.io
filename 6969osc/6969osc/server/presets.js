"use strict";

const fs = require("fs");
const path = require("path");

const PRESETS_PATH = path.resolve(__dirname, "..", "presets.json");
const MAX_PRESETS = 32;

function cloneState(state) {
  return {
    scenes: [...state.scenes],
    activeScene: state.activeScene,
    xy1: { ...state.xy1 },
    xy2: { ...state.xy2 },
    xy3: { ...state.xy3 },
    xy4: { ...state.xy4 },
    master: state.master,
  };
}

function loadFile() {
  try {
    const raw = JSON.parse(fs.readFileSync(PRESETS_PATH, "utf8"));
    if (raw && Array.isArray(raw.presets)) return raw;
  } catch (_) {}
  return { presets: [] };
}

function saveFile(data) {
  fs.writeFileSync(PRESETS_PATH, JSON.stringify(data, null, 2));
}

function listPresets() {
  return loadFile().presets.map(({ id, name, createdAt }) => ({
    id,
    name,
    createdAt,
  }));
}

function getPreset(id) {
  return loadFile().presets.find((p) => p.id === id) || null;
}

function addPreset(stateSnapshot) {
  const file = loadFile();
  if (file.presets.length >= MAX_PRESETS) {
    const err = new Error("Preset limit reached (32 max)");
    err.code = "PRESET_LIMIT";
    throw err;
  }
  const preset = {
    id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
    name: `Preset ${file.presets.length + 1}`,
    createdAt: new Date().toISOString(),
    state: cloneState(stateSnapshot),
  };
  file.presets.push(preset);
  saveFile(file);
  return preset;
}

function deletePreset(id) {
  const file = loadFile();
  const idx = file.presets.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  file.presets.splice(idx, 1);
  saveFile(file);
  return true;
}

function randomFullState(sceneCount) {
  const scenes = Array.from({ length: sceneCount }, () => Math.random() < 0.5);
  let activeScene = null;
  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i]) activeScene = i;
  }
  return {
    scenes,
    activeScene,
    xy1: { x: Math.random(), y: Math.random() },
    xy2: { x: Math.random(), y: Math.random() },
    xy3: { x: Math.random(), y: Math.random() },
    xy4: { x: Math.random(), y: Math.random() },
    master: Math.random(),
  };
}

module.exports = {
  MAX_PRESETS,
  cloneState,
  listPresets,
  getPreset,
  addPreset,
  deletePreset,
  randomFullState,
};
