/************************************
 * Oblique Strategies Word Grid
 * Optimized for mobile and performance
 ************************************/

// Configuration constants
const CONFIG = {
  FONT_MIN: 24,
  FONT_MAX: 48,
  BG_COLOR: 0,
  HUE_OFFSET: 0,
  SATURATION: 85,
  BRIGHTNESS: 95,
  GRID_COLS: 5,
  GRID_ROWS: 1,
  SPEED: 0.002,
  WAVE_AMP_RATIO: 0.08,
  WAVE_FREQ: 0.004,
  MARGIN_RATIO: 0.1,
  TITLE_Y_RATIO: 0.15
};

// Device detection
const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
  || window.innerWidth <= 768;

// Expanded monospace font list (20+ fonts)
const fonts = [
  "Orbitron", "Roboto Mono", "Space Mono", "Fira Code", "IBM Plex Mono",
  "VT323", "Share Tech Mono", "Press Start 2P", "Major Mono Display", "Nova Mono",
  "Cousine", "Cutive Mono", "Inconsolata", "Anonymous Pro", "PT Mono",
  "Overpass Mono", "Red Hat Mono", "Ubuntu Mono", "Source Code Pro", "JetBrains Mono",
  "Noto Sans Mono", "Liberation Mono", "Droid Sans Mono", "DejaVu Sans Mono"
];

// Enhanced word pool with more Oblique Strategies-inspired prompts
const wordPool = [
  "shift", "open", "listen", "wait", "invert", "repeat", "break", "connect", "drift", "reduce",
  "expand", "slowly", "erase", "rotate", "trust", "interrupt", "combine", "scatter", "accept", "doubt",
  "mirror", "retrace", "fragment", "hold", "exchange", "reverse", "ignore", "focus", "disperse", "rebuild",
  "delay", "move", "question", "stretch", "compress", "emerge", "fade", "adapt", "risk", "pause",
  "distort", "reflect", "transform", "follow", "translate", "rearrange", "begin", "end", "continue",
  "observe", "explore", "wander", "notice", "simplify", "layer", "collapse", "shuffle", "trace", "hover",
  "contract", "seek", "linger", "measure", "tilt", "capture", "discard", "play", "sample", "mask",
  "reveal", "push", "pull", "float", "anchor", "blur", "sharpen", "twist", "tremble", "spark",
  "grow", "erode", "cycle", "jump", "weave", "mark", "fold", "unfold", "spill", "merge",
  "align", "focus", "breathe", "release", "embrace", "abandon", "surface", "submerge", "spiral", "linear",
  "organic", "mechanical", "fluid", "solid", "transparent", "opaque", "rough", "smooth", "loud", "silent"
];

// Global variables
let words = [];
let lastWords = [];
let titleFont = "";
let isInitialized = false;
let lastInteraction = 0;
let animationStartTime = 0;

// Performance optimization
let frameCount = 0;
let skipFrames = isMobile() ? 2 : 1; // Reduce frame rate on mobile

const TITLE = "What to do when you're stuck";

function preload() {
  // Font loading is handled by CSS, no need to preload in p5.js
}

function setup() {
  // Hide loading screen and start immediately
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
  
  startSketch();
}

function startSketch() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  noStroke();
  
  // Optimize for mobile - use vertical layout
  if (isMobile()) {
    CONFIG.FONT_MIN = 20;
    CONFIG.FONT_MAX = 32;
    CONFIG.GRID_COLS = 1;
    // Dynamic rows based on available height with better spacing
    const topPad = height * 0.2;
    const bottomPad = height * 0.1;
    const availH = height - topPad - bottomPad;
    const avgLine = ((CONFIG.FONT_MIN + CONFIG.FONT_MAX) / 2) * 1.8;
    CONFIG.GRID_ROWS = max(4, min(8, floor(availH / avgLine)));
    CONFIG.WAVE_AMP_RATIO = 0.02; // Smaller amplitude on mobile
    CONFIG.MARGIN_RATIO = 0.05; // Smaller margins on mobile
  }
  
  pickWords();
  animationStartTime = millis();
  isInitialized = true;
}

function pickWords() {
  words = [];
  const needed = CONFIG.GRID_COLS * CONFIG.GRID_ROWS;
  let availableWords = wordPool.slice();
  
  // Remove previous words to avoid immediate repeats
  for (let w of lastWords) {
    let index = availableWords.indexOf(w);
    if (index !== -1) availableWords.splice(index, 1);
  }
  
  // Ensure we have enough words
  if (availableWords.length < needed) {
    availableWords = wordPool.slice();
  }
  
  const chosen = shuffle(availableWords).slice(0, needed);
  
  for (let i = 0; i < chosen.length; i++) {
    words.push({
      text: chosen[i],
      font: random(fonts), // Each word gets a random font
      size: random(CONFIG.FONT_MIN, CONFIG.FONT_MAX),
      hue: random(360)
    });
  }
  
  lastWords = chosen.slice();
  titleFont = random(fonts); // Title gets a new random font each time
  lastInteraction = millis();
}

function draw() {
  if (!isInitialized) return;
  
  // Performance optimization: skip frames on mobile
  frameCount++;
  if (frameCount % skipFrames !== 0) return;
  
  background(CONFIG.BG_COLOR);
  
  // Calculate responsive sizing with better mobile scaling
  const titleSize = isMobile() ? min(24, width * 0.055, height * 0.04) : min(42, width * 0.05);
  const marginX = width * CONFIG.MARGIN_RATIO;
  const titleY = isMobile() ? height * 0.06 : height * 0.1;
  const marginY = isMobile() ? height * 0.2 : height * CONFIG.TITLE_Y_RATIO;
  
  // Draw title with responsive sizing
  textSize(titleSize);
  textFont(titleFont);
  fill(200, CONFIG.SATURATION, CONFIG.BRIGHTNESS);
  text(TITLE, width / 2, titleY);
  
  // Calculate grid layout with better spacing
  const contentHeight = height - marginY - (isMobile() ? height * 0.1 : height * 0.05);
  const spacingX = CONFIG.GRID_COLS > 1 ? (width - 2 * marginX) / (CONFIG.GRID_COLS - 1) : 0;
  const spacingY = CONFIG.GRID_ROWS > 1 ? contentHeight / CONFIG.GRID_ROWS : contentHeight / 2;
  
  // Constrain wave amplitude based on spacing and available space
  const waveAmp = min(height * CONFIG.WAVE_AMP_RATIO, spacingY * 0.25);
  const t = (millis() - animationStartTime) * CONFIG.SPEED;
  
  // Draw words with animation
  for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      const idx = row * CONFIG.GRID_COLS + col;
      if (idx >= words.length) continue;
      
      const x = CONFIG.GRID_COLS > 1 ? marginX + col * spacingX : width / 2;
      const baseY = marginY + (row + 0.5) * spacingY;
      
      const rowPhase = row * 0.3;
      let y = baseY + sin(t + x * CONFIG.WAVE_FREQ + rowPhase) * waveAmp;
      
      const w = words[idx];
      const size = constrain(w.size, CONFIG.FONT_MIN, CONFIG.FONT_MAX);
      
      // Apply font with fallback
      textFont(w.font + ", monospace");
      textSize(size);
      
      // Better text positioning with proper bounds checking
      const tw = textWidth(w.text);
      const padding = isMobile() ? 10 : 20;
      const xSafe = constrain(x, tw / 2 + padding, width - tw / 2 - padding);
      const minY = titleY + titleSize + 20;
      const maxY = height - (isMobile() ? 40 : 60);
      y = constrain(y, max(minY, marginY + size / 2), maxY - size / 2);
      
      // Use pre-calculated hue for better performance
      fill(w.hue, CONFIG.SATURATION, CONFIG.BRIGHTNESS);
      text(w.text, xSafe, y);
    }
  }
  
  // Show tap instruction periodically
  if (millis() - lastInteraction > 10000 && !isMobile()) {
    textSize(16);
    textFont("Arial");
    fill(0, 0, 50);
    text("Click or press space for new words", width / 2, height - 30);
  }
}

function windowResized() {
  if (!isInitialized) return;
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate grid for new size
  if (isMobile()) {
    CONFIG.GRID_COLS = 1;
    CONFIG.MARGIN_RATIO = 0.05;
    // Recalculate rows for new height with better spacing
    const topPad = height * 0.2;
    const bottomPad = height * 0.1;
    const availH = height - topPad - bottomPad;
    const avgLine = ((CONFIG.FONT_MIN + CONFIG.FONT_MAX) / 2) * 1.8;
    CONFIG.GRID_ROWS = max(4, min(8, floor(availH / avgLine)));
  } else {
    CONFIG.MARGIN_RATIO = 0.1;
  }
}

// Mouse/touch interaction
function mousePressed() {
  if (!isInitialized) return false;
  pickWords();
  return false; // Prevent default
}

function touchStarted() {
  if (!isInitialized) return false;
  pickWords();
  return false; // Prevent default scrolling
}

// Keyboard interaction
function keyPressed() {
  if (!isInitialized) return;
  if (key === ' ' || key === 'Enter') {
    pickWords();
  }
}

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// Prevent zoom on double tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    noLoop();
  } else {
    loop();
  }
});