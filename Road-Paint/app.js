import * as THREE from 'three';


const WORLD = {
  groundY: 0.02,
  roadY: 0.08,
  mapHalfSize: 100,
};

const ROAD = {
  minPointDistance: 0.5,
  minLength: 3,
  sampleSpacing: 0.25,
  splineAlpha: 0.5,
  defaultWidth: 2.5,
  minWidth: 1,
  maxWidth: 6,
};

const TRAFFIC = {
  targetSpeed: 8,
  minGap: 2.5,
  lookAhead: 4,
  spawnInterval: 1.5,
  maxPerLane: 10,
  accelRate: 4,
  vehicleLength: 1.0,
  vehicleWidth: 0.6,
  vehicleHeight: 0.35,
};

const CAMERA = {
  birdEyeHeight: 100,
  birdEyeViewSize: 200,
};

const COLORS = {
  sky: 0x008080,
  ground: 0x808080,
  preview: 0xff00ff,
  vehicles: [0x0000ff, 0xffff00],
};

const PAINT_SWATCHES = [
  { name: 'Black', color: 0x000000 },
  { name: 'Gray', color: 0x808080 },
  { name: 'Maroon', color: 0x800000 },
  { name: 'Red', color: 0xff0000 },
  { name: 'Green', color: 0x008000 },
  { name: 'Lime', color: 0x00ff00 },
  { name: 'Olive', color: 0x808000 },
  { name: 'Yellow', color: 0xffff00 },
  { name: 'Navy', color: 0x000080 },
  { name: 'Blue', color: 0x0000ff },
  { name: 'Teal', color: 0x008080 },
  { name: 'Cyan', color: 0x00ffff },
  { name: 'Purple', color: 0x800080 },
  { name: 'Magenta', color: 0xff00ff },
  { name: 'Silver', color: 0xc0c0c0 },
  { name: 'White', color: 0xffffff },
];

function laneOffsetForWidth(width) {
  return width * 0.4;
}

function complementaryColor(hex) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta < 20) {
    return ((255 - r) << 16) | ((255 - g) << 8) | (255 - b);
  }

  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  let h = 0;
  if (max === r) h = ((gn - bn) / (delta / 255)) % 6;
  else if (max === g) h = (bn - rn) / (delta / 255) + 2;
  else h = (rn - gn) / (delta / 255) + 4;
  h = (h * 60 + 360) % 360;

  const ln = (max + min) / (2 * 255);
  const sn = delta / 255 / (1 - Math.abs(2 * ln - 1));

  const compH = (h + 180) % 360;
  const compS = Math.min(1, Math.max(0.55, sn));
  const compL = Math.min(0.62, Math.max(0.45, ln));

  return hslToHex(compH, compS, compL);
}

function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const rr = Math.round((r + m) * 255);
  const gg = Math.round((g + m) * 255);
  const bb = Math.round((b + m) * 255);
  return (rr << 16) | (gg << 8) | bb;
}


function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distance2D(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.hypot(dx, dz);
}

function polylineLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += distance2D(points[i - 1], points[i]);
  }
  return length;
}

function normalize2D(x, z) {
  const length = Math.hypot(x, z);
  if (length < 1e-6) {
    return { x: 0, z: 1 };
  }
  return { x: x / length, z: z / length };
}



const DENSE_STEP = 0.05;

function getControlPoint(points, index) {
  if (index < 0) return points[0];
  if (index >= points.length) return points[index - 1];
  return points[index];
}

function knotInterval(a, b, alpha) {
  return Math.pow(Math.max(distance2D(a, b), 0.0001), alpha);
}

function lerpAtKnot(a, b, ta, tb, t) {
  const range = tb - ta;
  const f = range < 1e-6 ? 0 : (t - ta) / range;
  return {
    x: lerp(a.x, b.x, f),
    z: lerp(a.z, b.z, f),
  };
}

function evaluateCentripetalSegment(p0, p1, p2, p3, u, alpha) {
  const t0 = 0;
  const t1 = t0 + knotInterval(p0, p1, alpha);
  const t2 = t1 + knotInterval(p1, p2, alpha);
  const t3 = t2 + knotInterval(p2, p3, alpha);
  const t = t1 + u * (t2 - t1);

  const a1 = lerpAtKnot(p0, p1, t0, t1, t);
  const a2 = lerpAtKnot(p1, p2, t1, t2, t);
  const a3 = lerpAtKnot(p2, p3, t2, t3, t);
  const b1 = lerpAtKnot(a1, a2, t0, t2, t);
  const b2 = lerpAtKnot(a2, a3, t1, t3, t);

  return lerpAtKnot(b1, b2, t1, t2, t);
}

function evaluateTangent(p0, p1, p2, p3, u, alpha) {
  const prev = evaluateCentripetalSegment(p0, p1, p2, p3, Math.max(0, u - 0.01), alpha);
  const next = evaluateCentripetalSegment(p0, p1, p2, p3, Math.min(1, u + 0.01), alpha);
  return normalize2D(next.x - prev.x, next.z - prev.z);
}

function buildDenseSamples(points, alpha) {
  if (points.length < 2) return [];

  const dense = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = getControlPoint(points, i - 1);
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = getControlPoint(points, i + 2);
    const segmentLength = distance2D(p1, p2);
    const steps = Math.max(2, Math.ceil(segmentLength / DENSE_STEP));

    for (let s = 0; s <= steps; s++) {
      if (i > 0 && s === 0) continue;

      const u = s / steps;
      const position = evaluateCentripetalSegment(p0, p1, p2, p3, u, alpha);
      const tangent = evaluateTangent(p0, p1, p2, p3, u, alpha);
      const normal = { x: -tangent.z, z: tangent.x };

      dense.push({
        x: position.x,
        z: position.z,
        tx: tangent.x,
        tz: tangent.z,
        nx: normal.x,
        nz: normal.z,
      });
    }
  }

  return dense;
}

function resampleByArcLength(dense, spacing) {
  if (dense.length < 2) return [];

  const samples = [{ ...dense[0] }];
  let accumulated = 0;
  let target = spacing;

  for (let i = 1; i < dense.length; i++) {
    const segmentLength = distance2D(dense[i - 1], dense[i]);

    while (accumulated + segmentLength >= target) {
      const remain = target - accumulated;
      const t = segmentLength < 1e-6 ? 0 : remain / segmentLength;
      const a = dense[i - 1];
      const b = dense[i];
      const tangent = normalize2D(
        lerp(a.tx, b.tx, t),
        lerp(a.tz, b.tz, t)
      );

      samples.push({
        x: lerp(a.x, b.x, t),
        z: lerp(a.z, b.z, t),
        tx: tangent.x,
        tz: tangent.z,
        nx: -tangent.z,
        nz: tangent.x,
      });

      target += spacing;
    }

    accumulated += segmentLength;
  }

  const lastDense = dense[dense.length - 1];
  const lastSample = samples[samples.length - 1];
  if (distance2D(lastSample, lastDense) > spacing * 0.25) {
    samples.push({ ...lastDense });
  }

  return { samples };
}

function buildCumulativeLengths(samples) {
  const cumulativeLengths = new Float32Array(samples.length);
  for (let i = 1; i < samples.length; i++) {
    cumulativeLengths[i] = cumulativeLengths[i - 1] + distance2D(samples[i - 1], samples[i]);
  }
  return cumulativeLengths;
}

function offsetSamples(samples, offset) {
  return samples.map((sample) => ({
    x: sample.x + sample.nx * offset,
    z: sample.z + sample.nz * offset,
    tx: sample.tx,
    tz: sample.tz,
    nx: sample.nx,
    nz: sample.nz,
    angle: Math.atan2(sample.tx, sample.tz),
  }));
}

function reverseSamples(samples) {
  const reversed = new Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[samples.length - 1 - i];
    reversed[i] = {
      x: sample.x,
      z: sample.z,
      tx: -sample.tx,
      tz: -sample.tz,
      nx: -sample.nx,
      nz: -sample.nz,
      angle: Math.atan2(-sample.tx, -sample.tz),
    };
  }
  return reversed;
}

function buildRoadSamples(points, spacing = ROAD.sampleSpacing) {
  if (points.length < 2) {
    return { samples: [], length: 0, cumulativeLengths: new Float32Array(0) };
  }

  const dense = buildDenseSamples(points, ROAD.splineAlpha);
  const { samples } = resampleByArcLength(dense, spacing);
  const cumulativeLengths = buildCumulativeLengths(samples);
  const length = samples.length > 0
    ? cumulativeLengths[cumulativeLengths.length - 1]
    : 0;

  return { samples, length, cumulativeLengths };
}

function getPointAtDistance(samples, cumulativeLengths, distance, out) {
  if (samples.length === 0) return null;

  const target = out ?? {};

  if (distance <= 0) {
    const first = samples[0];
    target.x = first.x;
    target.z = first.z;
    target.tx = first.tx;
    target.tz = first.tz;
    target.nx = first.nx;
    target.nz = first.nz;
    target.angle = first.angle ?? Math.atan2(first.tx, first.tz);
    target.distance = 0;
    return target;
  }

  const totalLength = cumulativeLengths[cumulativeLengths.length - 1];
  if (distance >= totalLength) {
    const last = samples[samples.length - 1];
    target.x = last.x;
    target.z = last.z;
    target.tx = last.tx;
    target.tz = last.tz;
    target.nx = last.nx;
    target.nz = last.nz;
    target.angle = last.angle ?? Math.atan2(last.tx, last.tz);
    target.distance = totalLength;
    return target;
  }

  let low = 0;
  let high = cumulativeLengths.length - 1;

  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (cumulativeLengths[mid] <= distance) low = mid;
    else high = mid;
  }

  const a = samples[low];
  const b = samples[high];
  const span = cumulativeLengths[high] - cumulativeLengths[low];
  const t = span < 1e-6 ? 0 : (distance - cumulativeLengths[low]) / span;
  const tangent = normalize2D(lerp(a.tx, b.tx, t), lerp(a.tz, b.tz, t));

  target.x = lerp(a.x, b.x, t);
  target.z = lerp(a.z, b.z, t);
  target.tx = tangent.x;
  target.tz = tangent.z;
  target.nx = -tangent.z;
  target.nz = tangent.x;
  target.angle = Math.atan2(tangent.x, tangent.z);
  target.distance = distance;
  return target;
}



let nextRoadId = 1;

function buildLane(roadId, name, samples) {
  const cumulativeLengths = new Float32Array(samples.length);
  for (let i = 1; i < samples.length; i++) {
    const dx = samples[i].x - samples[i - 1].x;
    const dz = samples[i].z - samples[i - 1].z;
    cumulativeLengths[i] = cumulativeLengths[i - 1] + Math.hypot(dx, dz);
  }

  const length = samples.length > 0 ? cumulativeLengths[cumulativeLengths.length - 1] : 0;

  return {
    id: `${roadId}-${name}`,
    roadId,
    name,
    samples,
    cumulativeLengths,
    length,
  };
}

function buildLanes(roadId, centerSamples, width) {
  const offset = laneOffsetForWidth(width);
  const laneASamples = offsetSamples(centerSamples, offset);
  const laneBSamples = reverseSamples(offsetSamples(centerSamples, -offset));

  return {
    laneA: buildLane(roadId, 'A', laneASamples),
    laneB: buildLane(roadId, 'B', laneBSamples),
  };
}

function makeRoad(points, { width = ROAD.defaultWidth, color, opacity = 1 } = {}) {
  const cleanPoints = points.map((point) => ({ x: point.x, z: point.z }));
  const { samples, length, cumulativeLengths } = buildRoadSamples(cleanPoints);
  const roadId = nextRoadId++;
  const lanes = buildLanes(roadId, samples, width);

  return {
    id: roadId,
    points: cleanPoints,
    width,
    color,
    opacity,
    length,
    samples,
    cumulativeLengths,
    laneA: lanes.laneA,
    laneB: lanes.laneB,
  };
}



function createRoadMaterial(color, opacity = 1) {
  const transparent = opacity < 1;
  return new THREE.MeshLambertMaterial({
    color,
    transparent,
    opacity,
    side: THREE.FrontSide,
    depthWrite: !transparent,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

function createPreviewMaterial(color, opacity = 1) {
  return new THREE.MeshLambertMaterial({
    color,
    transparent: true,
    opacity: 0.65 * opacity,
    side: THREE.FrontSide,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });
}

function fillRibbonBuffers(samples, halfWidth, positions, normals) {
  const count = samples.length;

  for (let i = 0; i < count; i++) {
    const sample = samples[i];
    const leftIndex = i * 2;
    const rightIndex = i * 2 + 1;

    positions[leftIndex * 3] = sample.x + sample.nx * halfWidth;
    positions[leftIndex * 3 + 1] = WORLD.roadY;
    positions[leftIndex * 3 + 2] = sample.z + sample.nz * halfWidth;

    positions[rightIndex * 3] = sample.x - sample.nx * halfWidth;
    positions[rightIndex * 3 + 1] = WORLD.roadY;
    positions[rightIndex * 3 + 2] = sample.z - sample.nz * halfWidth;

    normals[leftIndex * 3] = 0;
    normals[leftIndex * 3 + 1] = 1;
    normals[leftIndex * 3 + 2] = 0;

    normals[rightIndex * 3] = 0;
    normals[rightIndex * 3 + 1] = 1;
    normals[rightIndex * 3 + 2] = 0;
  }
}

function buildRibbonIndices(count) {
  const indices = new Uint16Array(Math.max(0, (count - 1) * 6));
  let offset = 0;

  for (let i = 0; i < count - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices[offset++] = a;
    indices[offset++] = c;
    indices[offset++] = b;
    indices[offset++] = b;
    indices[offset++] = c;
    indices[offset++] = d;
  }

  return indices;
}

function buildRibbonGeometry(samples, halfWidth) {
  const count = samples.length;
  const positions = new Float32Array(count * 2 * 3);
  const normals = new Float32Array(count * 2 * 3);
  fillRibbonBuffers(samples, halfWidth, positions, normals);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setIndex(new THREE.BufferAttribute(buildRibbonIndices(count), 1));
  geometry.computeBoundingSphere();

  return geometry;
}

function updateRibbonGeometry(geometry, samples, halfWidth) {
  const count = samples.length;
  const vertexCount = count * 2;

  let positions = geometry.getAttribute('position');
  let normals = geometry.getAttribute('normal');

  if (!positions || positions.count !== vertexCount) {
    positions = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    geometry.setAttribute('position', positions);
    geometry.setAttribute('normal', normals);
    geometry.setIndex(new THREE.BufferAttribute(buildRibbonIndices(count), 1));
  }

  fillRibbonBuffers(samples, halfWidth, positions.array, normals.array);
  positions.needsUpdate = true;
  normals.needsUpdate = true;
  geometry.computeBoundingSphere();
}

function buildRoadMesh(road) {
  const geometry = buildRibbonGeometry(road.samples, road.width * 0.5);
  const mesh = new THREE.Mesh(geometry, createRoadMaterial(road.color, road.opacity));
  mesh.receiveShadow = true;
  mesh.userData.roadId = road.id;
  return mesh;
}

function buildPreviewMesh(points, brush) {
  if (points.length < 2) return null;

  const { samples } = buildRoadSamples(points);
  const geometry = buildRibbonGeometry(samples, brush.width * 0.45);
  return new THREE.Mesh(geometry, createPreviewMaterial(brush.color, brush.opacity));
}

function updatePreviewMesh(mesh, points, brush) {
  if (!mesh || points.length < 2) return false;

  const { samples } = buildRoadSamples(points);
  updateRibbonGeometry(mesh.geometry, samples, brush.width * 0.45);

  const material = mesh.material;
  material.color.setHex(brush.color);
  material.opacity = 0.65 * brush.opacity;
  mesh.visible = true;
  return true;
}

function disposeMesh(mesh) {
  if (!mesh) return;
  mesh.geometry.dispose();
  mesh.material.dispose();
}



const CROSS_THRESHOLD = 1.2;
const MIN_JUNCTION_SPACING = 3;
const GRID_CELL = 2;

function gridKey(x, z) {
  return `${Math.floor(x / GRID_CELL)},${Math.floor(z / GRID_CELL)}`;
}

function buildSampleGrid(samples) {
  const grid = new Map();

  for (let j = 0; j < samples.length; j++) {
    const sample = samples[j];
    const key = gridKey(sample.x, sample.z);
    let cell = grid.get(key);
    if (!cell) {
      cell = [];
      grid.set(key, cell);
    }
    cell.push(j);
  }

  return grid;
}

function findClosestSample(a, laneB, grid) {
  const cx = Math.floor(a.x / GRID_CELL);
  const cz = Math.floor(a.z / GRID_CELL);

  let bestJ = -1;
  let bestDist = Infinity;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const indices = grid.get(`${cx + dx},${cz + dz}`);
      if (!indices) continue;

      for (const j of indices) {
        const d = distance2D(a, laneB.samples[j]);
        if (d < bestDist) {
          bestDist = d;
          bestJ = j;
        }
      }
    }
  }

  if (bestJ < 0 || bestDist > CROSS_THRESHOLD) return null;

  return { index: bestJ, dist: bestDist };
}

function findLaneCrossings(laneA, laneB) {
  const grid = buildSampleGrid(laneB.samples);
  const crossings = [];
  let lastDistA = -Infinity;

  for (let i = 0; i < laneA.samples.length; i++) {
    const match = findClosestSample(laneA.samples[i], laneB, grid);
    if (!match) continue;

    const distA = laneA.cumulativeLengths[i];
    if (distA - lastDistA < MIN_JUNCTION_SPACING) continue;

    crossings.push({
      distanceA: distA,
      distanceB: laneB.cumulativeLengths[match.index],
      gap: match.dist,
    });
    lastDistA = distA;
  }

  return crossings;
}

function connectLane(newLane, existingLanes, junctionsByLane) {
  for (const other of existingLanes) {
    if (other.roadId === newLane.roadId) continue;

    const crossings = findLaneCrossings(newLane, other);
    for (const c of crossings) {
      addJunction(junctionsByLane, newLane.id, {
        atDistance: c.distanceA,
        toLaneId: other.id,
        toDistance: c.distanceB,
      });
      addJunction(junctionsByLane, other.id, {
        atDistance: c.distanceB,
        toLaneId: newLane.id,
        toDistance: c.distanceA,
      });
    }
  }
}

function addJunction(junctionsByLane, laneId, junction) {
  let list = junctionsByLane.get(laneId);
  if (!list) {
    list = [];
    junctionsByLane.set(laneId, list);
  }
  list.push(junction);
  list.sort((a, b) => a.atDistance - b.atDistance);
}

function disconnectLanes(laneIds, junctionsByLane) {
  const removed = new Set(laneIds);
  for (const laneId of laneIds) {
    junctionsByLane.delete(laneId);
  }
  for (const [laneId, list] of junctionsByLane) {
    const filtered = list.filter((j) => !removed.has(j.toLaneId));
    if (filtered.length === 0) {
      junctionsByLane.delete(laneId);
    } else {
      junctionsByLane.set(laneId, filtered);
    }
  }
}

function findCrossedJunction(junctions, prevDistance, currDistance, laneLength) {
  if (!junctions || junctions.length === 0) return null;

  const wrapped = currDistance < prevDistance;

  for (const j of junctions) {
    if (!wrapped) {
      if (j.atDistance > prevDistance && j.atDistance <= currDistance) return j;
    } else {
      if (j.atDistance > prevDistance && j.atDistance <= laneLength) return j;
      if (j.atDistance >= 0 && j.atDistance <= currDistance) return j;
    }
  }

  return null;
}

const JUNCTION_COOLDOWN = 0.6;
const TRANSFER_CHANCE = 0.7;
const MAX_DT = 0.033;

const _sampleOut = {};

let nextVehicleId = 1;

function makeVehicle() {
  return {
    id: 0,
    laneId: '',
    roadId: 0,
    distance: 0,
    speed: 0,
    targetSpeed: 0,
    color: COLORS.vehicles[0],
    junctionCooldown: 0,
    active: false,
  };
}

function startVehicle(state, lane, color, startDistance = 0) {
  state.id = nextVehicleId++;
  state.laneId = lane.id;
  state.roadId = lane.roadId;
  state.distance = startDistance;
  state.speed = 0;
  state.targetSpeed = 0;
  state.color = color;
  state.junctionCooldown = 0;
  state.active = true;
}

function makePool(createFn, initialSize = 64, growSize = 32) {
  const free = [];
  const active = new Set();

  function grow(count) {
    for (let i = 0; i < count; i++) {
      free.push(createFn());
    }
  }

  grow(initialSize);

  return {
    acquire() {
      if (free.length === 0) {
        grow(growSize);
      }

      const item = free.pop();
      active.add(item);
      return item;
    },

    release(item) {
      if (!active.has(item)) return;
      active.delete(item);
      free.push(item);
    },

    releaseAll() {
      for (const item of active) {
        free.push(item);
      }
      active.clear();
    },

    forEachActive(callback) {
      for (const item of active) {
        callback(item);
      }
    },

    get activeCount() {
      return active.size;
    },
  };
}

function forwardGap(from, to, laneLength) {
  let gap = to - from;
  if (gap <= 0) gap += laneLength;
  return gap;
}

function arcDistance(a, b, laneLength) {
  const d = Math.abs(a - b);
  return Math.min(d, laneLength - d);
}

function getGapAhead(distance, lane, vehicles, selfId) {
  if (vehicles.length === 0) return Infinity;

  let minGap = Infinity;

  for (const entry of vehicles) {
    if (entry.state.id === selfId) continue;

    const gap = forwardGap(distance, entry.state.distance, lane.length);
    if (gap < minGap) minGap = gap;
  }

  return minGap;
}

function hasRoomAt(lane, distance, vehicles, selfId) {
  for (const entry of vehicles) {
    if (entry.state.id === selfId) continue;
    if (arcDistance(distance, entry.state.distance, lane.length) < TRAFFIC.minGap) {
      return false;
    }
  }
  return true;
}

function canSpawn(lane, vehicles) {
  if (vehicles.length >= TRAFFIC.maxPerLane) return false;
  if (lane.length < TRAFFIC.minGap * 2) return false;

  const minSpawnGap = TRAFFIC.minGap * 1.5;

  for (const entry of vehicles) {
    const distance = entry.state.distance;
    const gap = Math.min(distance, lane.length - distance);
    if (gap < minSpawnGap) return false;
  }

  return true;
}

function initTraffic(scene) {
  const lanes = new Map();
  const laneVehicles = new Map();
  const spawnTimers = new Map();
  const roadColors = new Map();
  const junctionsByLane = new Map();

  function getVehicleColor(roadId) {
    const base = roadColors.get(roadId) ?? 0x0000ff;
    return complementaryColor(base);
  }

  const sharedGeometry = new THREE.BoxGeometry(
    TRAFFIC.vehicleWidth,
    TRAFFIC.vehicleHeight,
    TRAFFIC.vehicleLength
  );

  const pool = makePool(() => {
    const state = makeVehicle();
    const material = new THREE.MeshLambertMaterial({ color: state.color });
    const mesh = new THREE.Mesh(sharedGeometry, material);
    mesh.visible = false;
    scene.add(mesh);
    return { state, mesh };
  }, 128, 64);

  function getLaneList(laneId) {
    let vehicles = laneVehicles.get(laneId);
    if (!vehicles) {
      vehicles = [];
      laneVehicles.set(laneId, vehicles);
    }
    return vehicles;
  }

  function registerLane(lane) {
    lanes.set(lane.id, lane);
    laneVehicles.set(lane.id, []);
    spawnTimers.set(lane.id, Math.random() * TRAFFIC.spawnInterval);
  }

  function addRoad(road) {
    roadColors.set(road.id, road.color ?? 0x0000ff);

    const existing = Array.from(lanes.values());
    connectLane(road.laneA, existing, junctionsByLane);
    connectLane(road.laneB, [...existing, road.laneA], junctionsByLane);

    registerLane(road.laneA);
    registerLane(road.laneB);
  }

  function removeLane(laneId) {
    const vehicles = laneVehicles.get(laneId);
    if (vehicles) {
      for (const entry of vehicles) {
        entry.mesh.visible = false;
        pool.release(entry);
      }
    }
    lanes.delete(laneId);
    laneVehicles.delete(laneId);
    spawnTimers.delete(laneId);
  }

  function removeRoad(road) {
    disconnectLanes([road.laneA.id, road.laneB.id], junctionsByLane);
    removeLane(road.laneA.id);
    removeLane(road.laneB.id);
    roadColors.delete(road.id);
  }

  function clear() {
    for (const laneId of Array.from(lanes.keys())) {
      removeLane(laneId);
    }
    roadColors.clear();
    junctionsByLane.clear();
  }

  function spawnVehicle(lane) {
    const vehicles = getLaneList(lane.id);
    if (!canSpawn(lane, vehicles)) return;

    const color = getVehicleColor(lane.roadId);

    const entry = pool.acquire();
    startVehicle(entry.state, lane, color, 0);
    entry.mesh.material.color.setHex(entry.state.color);
    entry.mesh.visible = true;
    vehicles.push(entry);
  }

  function maybeTransfer(entry, lane, prevDistance) {
    const { state } = entry;
    if (state.junctionCooldown > 0) return null;

    const junctions = junctionsByLane.get(lane.id);
    const crossed = findCrossedJunction(
      junctions,
      prevDistance,
      state.distance,
      lane.length
    );
    if (!crossed) return null;

    const target = lanes.get(crossed.toLaneId);
    if (!target) return null;

    const targetVehicles = getLaneList(target.id);
    if (!hasRoomAt(target, crossed.toDistance, targetVehicles, state.id)) {
      return null;
    }

    if (Math.random() > TRANSFER_CHANCE) return null;

    return { entry, fromLaneId: lane.id, target, toDistance: crossed.toDistance };
  }

  function applyTransfer(transfer) {
    const { entry, fromLaneId, target, toDistance } = transfer;
    const { state, mesh } = entry;

    const fromList = getLaneList(fromLaneId);
    const index = fromList.indexOf(entry);
    if (index !== -1) fromList.splice(index, 1);

    state.laneId = target.id;
    state.roadId = target.roadId;
    state.distance = clamp(toDistance, 0, target.length);
    state.junctionCooldown = JUNCTION_COOLDOWN;

    const newColor = getVehicleColor(target.roadId);
    state.color = newColor;
    mesh.material.color.setHex(newColor);

    getLaneList(target.id).push(entry);
  }

  function updateVehicle(entry, lane, vehicles, dt) {
    const { state, mesh } = entry;

    if (state.junctionCooldown > 0) {
      state.junctionCooldown = Math.max(0, state.junctionCooldown - dt);
    }

    const gapAhead = getGapAhead(state.distance, lane, vehicles, state.id);

    let desiredSpeed = TRAFFIC.targetSpeed;
    if (gapAhead < TRAFFIC.lookAhead) {
      const ratio = clamp(
        (gapAhead - TRAFFIC.minGap) / (TRAFFIC.lookAhead - TRAFFIC.minGap),
        0,
        1
      );
      desiredSpeed = TRAFFIC.targetSpeed * ratio;
    }

    state.targetSpeed = desiredSpeed;
    state.speed = lerp(state.speed, state.targetSpeed, clamp(dt * TRAFFIC.accelRate, 0, 1));

    const prevDistance = state.distance;
    state.distance += state.speed * dt;

    if (state.distance >= lane.length) {
      state.distance -= lane.length;
    }

    const transfer = maybeTransfer(entry, lane, prevDistance);

    const activeLane = transfer ? transfer.target : lane;
    const activeDistance = transfer
      ? clamp(transfer.toDistance, 0, transfer.target.length)
      : state.distance;

    const sample = getPointAtDistance(
      activeLane.samples,
      activeLane.cumulativeLengths,
      activeDistance,
      _sampleOut
    );
    if (sample) {
      mesh.position.set(
        sample.x,
        WORLD.roadY + TRAFFIC.vehicleHeight * 0.5 + 0.02,
        sample.z
      );
      mesh.rotation.y = sample.angle ?? Math.atan2(sample.tx, sample.tz);
    }

    return transfer;
  }

  function update(dt) {
    const step = Math.min(dt, MAX_DT);

    for (const lane of lanes.values()) {
      let timer = spawnTimers.get(lane.id) ?? 0;
      timer -= step;

      if (timer <= 0) {
        spawnVehicle(lane);
        timer = TRAFFIC.spawnInterval;
      }

      spawnTimers.set(lane.id, timer);

      const vehicles = getLaneList(lane.id);
      for (const entry of vehicles.slice()) {
        const transfer = updateVehicle(entry, lane, vehicles, step);
        if (transfer) {
          applyTransfer(transfer);
        }
      }
    }
  }

  function dispose() {
    pool.forEachActive((entry) => {
      scene.remove(entry.mesh);
      entry.mesh.material.dispose();
    });
    pool.releaseAll();
    sharedGeometry.dispose();
  }

  return {
    addRoad,
    removeRoad,
    clear,
    update,
    dispose,
    get vehicleCount() {
      return pool.activeCount;
    },
  };
}



function mixTowardWhite(color, opacity) {
  const c = new THREE.Color(color);
  const t = 1 - Math.max(0, Math.min(1, opacity));
  c.lerp(new THREE.Color(0xffffff), t);
  return c;
}

function updateCameraSize(camera, width, height) {
  if (width === 0 || height === 0) return;

  const half = camera.userData.viewSize * 0.5;
  const aspect = width / height;
  camera.left = -half * aspect;
  camera.right = half * aspect;
  camera.top = half;
  camera.bottom = -half;
  camera.updateProjectionMatrix();
}

function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky);
  scene.fog = new THREE.Fog(COLORS.sky, 220, 420);

  const hemiLight = new THREE.HemisphereLight(0xe8f0f8, 0xb8c8a8, 0.55);
  scene.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.4);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff8f0, 0.9);
  sunLight.position.set(-50, 70, 40);
  sunLight.castShadow = true;

  const shadowSize = 110;
  sunLight.shadow.camera.left = -shadowSize;
  sunLight.shadow.camera.right = shadowSize;
  sunLight.shadow.camera.top = shadowSize;
  sunLight.shadow.camera.bottom = -shadowSize;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 220;
  sunLight.shadow.mapSize.set(512, 512);
  sunLight.shadow.bias = -0.0005;

  scene.add(sunLight);

  const mapSize = WORLD.mapHalfSize * 2;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(mapSize, mapSize),
    new THREE.MeshLambertMaterial({ color: COLORS.ground })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = WORLD.groundY;
  ground.receiveShadow = true;
  ground.name = 'ground';
  ground.userData.drawSurface = true;
  scene.add(ground);

  function setBackground({ color, opacity = 1 } = {}) {
    const resolved = mixTowardWhite(color, opacity);
    ground.material.color.copy(resolved);
    scene.background.copy(resolved);
    if (scene.fog) scene.fog.color.copy(resolved);
  }

  const aspect = window.innerWidth / window.innerHeight;
  const half = CAMERA.birdEyeViewSize * 0.5;

  const camera = new THREE.OrthographicCamera(
    -half * aspect,
    half * aspect,
    half,
    -half,
    0.1,
    500
  );

  camera.position.set(0, CAMERA.birdEyeHeight, 0);
  camera.lookAt(0, 0, 0);
  camera.userData.viewSize = CAMERA.birdEyeViewSize;

  return { scene, ground, camera, setBackground };
}

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.touchAction = 'none';

  document.body.appendChild(renderer.domElement);
  return renderer;
}

function onResize(renderer, camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width === 0 || height === 0) return;

  updateCameraSize(camera, width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
}



function bindMouse({
  domElement,
  camera,
  ground,
  onDrawUpdate,
  onDrawEnd,
  getMode,
  onErase,
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let isDrawing = false;
  let isErasing = false;
  let activePointerId = null;
  let points = [];

  function setPointerFromEvent(event) {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function getGroundPoint(event) {
    if (event.target !== domElement) return null;

    setPointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObject(ground, false);

    if (intersections.length === 0) {
      return null;
    }

    const hit = intersections[0].point;
    return { x: hit.x, z: hit.z };
  }

  function emitPreview(cursor) {
    if (points.length === 0) {
      onDrawUpdate(null);
      return;
    }
    onDrawUpdate(cursor ? points.concat([cursor]) : points);
  }

  function appendPoint(point) {
    if (!point) return false;

    const lastPoint = points[points.length - 1];
    if (lastPoint && distance2D(point, lastPoint) < ROAD.minPointDistance) {
      return false;
    }

    points.push(point);
    return true;
  }

  function finishDrawing(event) {
    if (!isDrawing) return;

    const releasePoint = event ? getGroundPoint(event) : null;
    if (releasePoint) {
      appendPoint(releasePoint);
    }

    const drawPoints = points;
    isDrawing = false;
    activePointerId = null;
    points = [];

    if (polylineLength(drawPoints) >= ROAD.minLength) {
      onDrawEnd(drawPoints);
    } else {
      onDrawEnd(null);
    }
  }

  function eraseAt(event) {
    const groundPoint = getGroundPoint(event);
    if (!groundPoint) return;
    onErase?.(groundPoint);
  }

  function onPointerDown(event) {
    if (event.button !== 0 || isDrawing || isErasing) return;

    if (getMode?.() === 'erase') {
      event.preventDefault();
      domElement.setPointerCapture(event.pointerId);
      isErasing = true;
      activePointerId = event.pointerId;
      eraseAt(event);
      return;
    }

    const groundPoint = getGroundPoint(event);
    if (!groundPoint) return;

    event.preventDefault();
    domElement.setPointerCapture(event.pointerId);

    isDrawing = true;
    activePointerId = event.pointerId;
    points = [groundPoint];
    emitPreview(groundPoint);
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointerId) return;

    if (isErasing) {
      eraseAt(event);
      return;
    }

    if (!isDrawing) return;

    const groundPoint = getGroundPoint(event);
    if (!groundPoint) return;

    appendPoint(groundPoint);
    emitPreview(groundPoint);
  }

  function onPointerUp(event) {
    if (event.pointerId !== activePointerId) return;

    if (domElement.hasPointerCapture(event.pointerId)) {
      domElement.releasePointerCapture(event.pointerId);
    }

    if (isErasing) {
      isErasing = false;
      activePointerId = null;
      return;
    }

    finishDrawing(event);
  }

  function onPointerCancel(event) {
    if (event.pointerId !== activePointerId) return;
    if (isErasing) {
      isErasing = false;
      activePointerId = null;
      return;
    }
    if (!isDrawing) return;
    finishDrawing(null);
    onDrawUpdate(null);
  }

  function onContextMenu(event) {
    event.preventDefault();
  }

  domElement.addEventListener('pointerdown', onPointerDown);
  domElement.addEventListener('pointermove', onPointerMove);
  domElement.addEventListener('pointerup', onPointerUp);
  domElement.addEventListener('pointercancel', onPointerCancel);
  domElement.addEventListener('contextmenu', onContextMenu);

  return {
    isDrawing: () => isDrawing,
  };
}



function toHex(color) {
  return `#${color.toString(16).padStart(6, '0')}`;
}

function makeDraggable(panel, handle) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  function anchorPanel() {
    const rect = panel.getBoundingClientRect();
    panel.style.right = 'auto';
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    return { left: rect.left, top: rect.top };
  }

  function clampPosition(left, top) {
    const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
    return {
      left: Math.max(0, Math.min(left, maxLeft)),
      top: Math.max(0, Math.min(top, maxTop)),
    };
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest('.win-titlebar-buttons')) return;
    if (panel.classList.contains('paint-panel-minimized')) return;

    event.preventDefault();
    const pos = anchorPanel();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = pos.left;
    startTop = pos.top;
    panel.classList.add('paint-panel-dragging');
    handle.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const { left, top } = clampPosition(startLeft + dx, startTop + dy);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove('paint-panel-dragging');
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  }

  handle.addEventListener('pointerdown', onPointerDown);
  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

function buildToolbar({ onChange, onBackgroundChange, onReset, onToolChange }) {
  const roadColorHex = toHex(PAINT_SWATCHES[0].color);
  const skyHex = toHex(COLORS.sky);

  const panel = document.createElement('div');
  panel.id = 'paint-panel';
  panel.innerHTML = `
    <div class="win-titlebar">
      <span class="win-titlebar-icon"></span>
      <span class="win-titlebar-text">Paint</span>
      <span class="win-titlebar-buttons">
        <button type="button" class="win-tb-btn" id="minimize-btn" tabindex="-1">_</button>
      </span>
    </div>

    <div class="win-body">
      <fieldset class="win-group">
        <legend>Tool</legend>
        <div class="tool-buttons" id="tool-buttons">
          <button type="button" class="tool-btn active" data-tool="draw">
            <span class="tool-btn-icon">&#9998;</span> Pencil
          </button>
          <button type="button" class="tool-btn" data-tool="erase">
            <span class="tool-btn-icon">&#9647;</span> Eraser
          </button>
        </div>
      </fieldset>

      <fieldset class="win-group">
        <legend>Size</legend>
        <div class="field-row">
          <input type="range" id="brush-width" min="${ROAD.minWidth}" max="${ROAD.maxWidth}" step="0.25" value="${ROAD.defaultWidth}">
          <span class="win-readout" id="width-value">${ROAD.defaultWidth}</span>
        </div>
      </fieldset>

      <fieldset class="win-group">
        <legend>Colors</legend>
        <div class="active-color-row">
          <label class="win-inline-label">Road</label>
          <input type="color" id="road-color" class="color-input color-input-sm" value="${roadColorHex}" title="Road color">
        </div>
        <div id="color-swatches" class="swatches"></div>
        <div class="field-row">
          <label class="win-inline-label">Opacity</label>
          <input type="range" id="road-opacity" min="0" max="1" step="0.01" value="1">
          <span class="win-readout" id="road-opacity-value">100%</span>
        </div>
      </fieldset>

      <fieldset class="win-group">
        <legend>Background</legend>
        <div class="active-color-row">
          <label class="win-inline-label">Fill</label>
          <input type="color" id="bg-color" class="color-input color-input-sm" value="${skyHex}" title="Background color">
        </div>
        <div class="field-row">
          <label class="win-inline-label">Opacity</label>
          <input type="range" id="bg-opacity" min="0" max="1" step="0.01" value="1">
          <span class="win-readout" id="bg-opacity-value">100%</span>
        </div>
      </fieldset>

      <button type="button" id="reset-btn" class="win-btn reset-btn">Clear All</button>
    </div>
  `;
  document.body.appendChild(panel);

  const titlebar = panel.querySelector('.win-titlebar');
  const minimizeBtn = panel.querySelector('#minimize-btn');
  let savedPosition = null;

  function minimize() {
    if (panel.classList.contains('paint-panel-minimized')) return;

    const rect = panel.getBoundingClientRect();
    savedPosition = { left: rect.left, top: rect.top };

    panel.style.right = 'auto';
    const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
    panel.style.left = `${Math.max(8, Math.min(savedPosition.left, maxLeft))}px`;
    panel.style.top = 'auto';
    panel.classList.add('paint-panel-minimized');
  }

  function restore() {
    if (!panel.classList.contains('paint-panel-minimized')) return;

    panel.classList.remove('paint-panel-minimized');
    if (savedPosition) {
      panel.style.left = `${savedPosition.left}px`;
      panel.style.top = `${savedPosition.top}px`;
      panel.style.right = 'auto';
    }
  }

  minimizeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    minimize();
  });

  titlebar.addEventListener('click', (event) => {
    if (!panel.classList.contains('paint-panel-minimized')) return;
    if (event.target.closest('.win-titlebar-buttons')) return;
    restore();
  });

  makeDraggable(panel, titlebar);

  const widthInput = panel.querySelector('#brush-width');
  const widthValue = panel.querySelector('#width-value');
  const swatchContainer = panel.querySelector('#color-swatches');
  const roadColorInput = panel.querySelector('#road-color');
  const roadOpacityInput = panel.querySelector('#road-opacity');
  const roadOpacityValue = panel.querySelector('#road-opacity-value');
  const bgColorInput = panel.querySelector('#bg-color');
  const bgOpacityInput = panel.querySelector('#bg-opacity');
  const bgOpacityValue = panel.querySelector('#bg-opacity-value');
  const toolButtons = panel.querySelector('#tool-buttons');
  const resetBtn = panel.querySelector('#reset-btn');

  const brush = {
    width: ROAD.defaultWidth,
    color: PAINT_SWATCHES[0].color,
    opacity: 1,
  };

  const background = {
    color: COLORS.sky,
    opacity: 1,
  };

  let tool = 'draw';

  function notify() {
    onChange?.(brush);
  }

  function notifyBackground() {
    onBackgroundChange?.(background);
  }

  function syncSwatchSelection() {
    for (const el of swatchContainer.querySelectorAll('.swatch')) {
      el.classList.toggle('active', Number(el.dataset.color) === brush.color);
    }
  }

  for (const swatch of PAINT_SWATCHES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'swatch';
    button.title = swatch.name;
    button.style.background = toHex(swatch.color);
    button.dataset.color = swatch.color;
    button.addEventListener('click', () => {
      brush.color = swatch.color;
      roadColorInput.value = toHex(swatch.color);
      syncSwatchSelection();
      notify();
    });
    swatchContainer.appendChild(button);
  }

  syncSwatchSelection();

  widthInput.addEventListener('input', () => {
    brush.width = Number(widthInput.value);
    widthValue.textContent = brush.width.toFixed(2).replace(/\.00$/, '');
    notify();
  });

  roadColorInput.addEventListener('input', () => {
    brush.color = parseInt(roadColorInput.value.slice(1), 16);
    syncSwatchSelection();
    notify();
  });

  roadOpacityInput.addEventListener('input', () => {
    brush.opacity = Number(roadOpacityInput.value);
    roadOpacityValue.textContent = `${Math.round(brush.opacity * 100)}%`;
    notify();
  });

  bgColorInput.addEventListener('input', () => {
    background.color = parseInt(bgColorInput.value.slice(1), 16);
    notifyBackground();
  });

  bgOpacityInput.addEventListener('input', () => {
    background.opacity = Number(bgOpacityInput.value);
    bgOpacityValue.textContent = `${Math.round(background.opacity * 100)}%`;
    notifyBackground();
  });

  function setTool(next) {
    tool = next;
    const erasing = tool === 'erase';
    for (const el of toolButtons.querySelectorAll('.tool-btn')) {
      el.classList.toggle('active', el.dataset.tool === tool);
    }
    panel.classList.toggle('erasing', erasing);
    onToolChange?.(tool);
  }

  toolButtons.addEventListener('click', (event) => {
    const btn = event.target.closest('.tool-btn');
    if (!btn) return;
    setTool(btn.dataset.tool);
  });

  resetBtn.addEventListener('click', () => {
    onReset?.();
  });

  return {
    getBrush: () => brush,
    getBackground: () => background,
    getTool: () => tool,
  };
}


const MAX_FRAME_DT = 0.033;

let lastFrameTime = performance.now();
let isVisible = !document.hidden;

const renderer = setupRenderer();
const { scene, ground, camera, setBackground } = setupScene();
const traffic = initTraffic(scene);

const roads = [];
let previewMesh = null;
let previewPoints = null;

const paintToolbar = buildToolbar({
  onChange() {
    if (previewPoints) {
      updatePreview(previewPoints);
    }
  },
  onBackgroundChange(background) {
    setBackground(background);
  },
  onToolChange(tool) {
    renderer.domElement.style.cursor = tool === 'erase' ? 'crosshair' : 'default';
    if (tool === 'erase') removePreview();
  },
  onReset() {
    resetAll();
  },
});

function showError(message) {
  const el = document.getElementById('error');
  if (el) {
    el.textContent = message;
    el.hidden = false;
  }
}

function clearPreview() {
  if (!previewMesh) return;
  previewMesh.visible = false;
}

function removePreview() {
  if (!previewMesh) return;
  scene.remove(previewMesh);
  disposeMesh(previewMesh);
  previewMesh = null;
  previewPoints = null;
}

function updatePreview(points) {
  previewPoints = points;

  if (!points || points.length < 2) {
    clearPreview();
    return;
  }

  const brush = paintToolbar.getBrush();

  if (!previewMesh) {
    previewMesh = buildPreviewMesh(points, brush);
    if (previewMesh) {
      scene.add(previewMesh);
    }
    return;
  }

  updatePreviewMesh(previewMesh, points, brush);
}

function spawnRoad(points, options) {
  const road = makeRoad(points, options);
  const mesh = buildRoadMesh(road);
  scene.add(mesh);
  roads.push({ road, mesh });
  traffic.addRoad(road);
  return road;
}

function addRoad(points) {
  const brush = paintToolbar.getBrush();
  spawnRoad(points, {
    width: brush.width,
    color: brush.color,
    opacity: brush.opacity,
  });
}

function addRoadFrom(points, sourceRoad) {
  spawnRoad(points, {
    width: sourceRoad.width,
    color: sourceRoad.color,
    opacity: sourceRoad.opacity,
  });
}

function removeRoadEntry(entry) {
  const index = roads.indexOf(entry);
  if (index === -1) return;
  roads.splice(index, 1);
  traffic.removeRoad(entry.road);
  scene.remove(entry.mesh);
  disposeMesh(entry.mesh);
}

function eraserRadius() {
  return paintToolbar.getBrush().width * 0.75 + 0.6;
}

function splitSurvivingRuns(samples, center, radius) {
  const runs = [];
  let current = [];

  for (const sample of samples) {
    const inside = distance2D(sample, center) <= radius;
    if (inside) {
      if (current.length > 0) {
        runs.push(current);
        current = [];
      }
    } else {
      current.push({ x: sample.x, z: sample.z });
    }
  }

  if (current.length > 0) runs.push(current);
  return runs;
}

function eraseEntry(entry, center, radius) {
  const runs = splitSurvivingRuns(entry.road.samples, center, radius);

  const survivesWhole =
    runs.length === 1 && runs[0].length === entry.road.samples.length;
  if (survivesWhole) return false;

  removeRoadEntry(entry);

  for (const run of runs) {
    if (run.length < 2) continue;
    if (polylineLength(run) < ROAD.minLength) continue;
    addRoadFrom(run, entry.road);
  }

  return true;
}

function eraseAtPoint(center) {
  if (roads.length === 0) return;
  const radius = eraserRadius();
  for (const entry of roads.slice()) {
    eraseEntry(entry, center, radius);
  }
}

function resetAll() {
  removePreview();
  for (const entry of roads.slice()) {
    scene.remove(entry.mesh);
    disposeMesh(entry.mesh);
  }
  roads.length = 0;
  traffic.clear();
}

try {
  bindMouse({
    domElement: renderer.domElement,
    camera,
    ground,
    getMode: () => paintToolbar.getTool(),
    onErase: eraseAtPoint,
    onDrawUpdate: updatePreview,
    onDrawEnd(points) {
      removePreview();
      if (points) {
        addRoad(points);
      }
    },
  });
} catch (error) {
  showError(`Failed to start drawing: ${error.message}`);
}

function handleResize() {
  onResize(renderer, camera);
}

onResize(renderer, camera);
window.addEventListener('resize', handleResize, { passive: true });

document.addEventListener('visibilitychange', () => {
  isVisible = !document.hidden;
  if (isVisible) {
    lastFrameTime = performance.now();
  }
});

function frame() {
  if (!isVisible) return;

  const now = performance.now();
  const dt = Math.min((now - lastFrameTime) / 1000, MAX_FRAME_DT);
  lastFrameTime = now;

  traffic.update(dt);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(frame);

function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const AUTO_DISMISS_MS = 1000;
  let dismissed = false;
  let autoTimer = null;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(autoTimer);
    splash.classList.add('splash-hide');
    lastFrameTime = performance.now();
    window.removeEventListener('keydown', dismiss);
    setTimeout(() => splash.remove(), 400);
  }

  autoTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
  splash.addEventListener('click', dismiss);
  window.addEventListener('keydown', dismiss);
}

initSplash();

window.addEventListener('beforeunload', () => {
  renderer.setAnimationLoop(null);
  window.removeEventListener('resize', handleResize);
  traffic.dispose();
  resetAll();
  renderer.dispose();
});
