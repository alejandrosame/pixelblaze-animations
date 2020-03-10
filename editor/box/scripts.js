const numStrips = 3;
const stripSize = 150;
const pixelCount = stripSize * numStrips;
const pixelSize = 10
const canvasLong = stripSize * pixelSize;
const canvasShort = pixelSize;
const VERTICAL_UD = 0;
const VERTICAL_DU = 1;
const HORIZONTAL_LR = 2;
const HORIZONTAL_RL = 3;
const DELTA = 0.1;

let currentPixel;
let currentStrip;
let stripMap = new Map();
let stripBuildOrder = [1,0,2];
let stripOrientations = [HORIZONTAL_LR, VERTICAL_DU, VERTICAL_UD];

let currentContext;

function hsv(h, s, v) {
  localPixel = (currentPixel%stripSize);
  currentContext.fillStyle = hsvToRgb(h, s, v);
  currentContext.fillRect(
    pixelSize * localPixel,
    0,
    pixelSize,
    pixelSize
  );
}

function hsvToRgb(h, s, v) {
  h = h % 1;
  h = h * 6;
  let i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = [v, q, p, p, t, v][mod],
    g = [t, v, v, q, p, p][mod],
    b = [p, p, t, v, v, q][mod];

  return `rgb(${(r * 255) | 0}, ${(g * 255) | 0}, ${(b * 255) | 0})`;
}

class Strip {
  constructor(renderFn, stripIndex) {
    const strip = document.createElement("canvas");
    document.body.appendChild(strip);
    strip.className = "canvas";
    strip.setAttribute("width", canvasLong + "px");
    strip.setAttribute("height", canvasShort + "px");

    this.ctx = strip.getContext("2d");
    this.renderFn = renderFn;

    this.stripOrientation = stripOrientations[stripIndex];

    let startPixel = stripSize*stripIndex;
    let endPixel = stripSize*stripIndex + stripSize;
    this.range = [startPixel, endPixel];
  }
}

function time(interval) {
  return (performance.now() % (65536 * interval)) / (65536 * interval);
}

function wave(v) {
  return (1 + Math.sin(v * Math.PI * 2)) / 2;
}

function findCurrentStrip(stripMap, index){
  for(var [key, val] of stripMap){
    if(index >= key[0] && index < key[1]){
      return val;
    }
  }
  return -1;
}

function beforeRender(delta){
  with(Math){
    hl = pixelCount / 2;
    t = time(0.01);
    v = 0.01 + wave(time(0.07));
  }
}

function render(index){
  with(Math){
    c1 = 1 - abs(index - hl) / hl;
    hsv(c1 + t, 1, v);
  }
}

function update(){
  beforeRender(delta);

  //Main rendering logic
  for (let i = 0; i < pixelCount; i++) {
    currentPixel = i;
    currentStrip = findCurrentStrip(stripMap, i);
    currentContext = currentStrip.ctx;
    render(currentPixel);

    delta += DELTA;
  }

  requestAnimationFrame(update);
}

function init() {
  // Add strips
  for (let i = 0; i < numStrips; i++) {
    stripBuildIndex = stripBuildOrder[i];
    s = new Strip(render, stripBuildIndex);
    stripMap.set(s.range, s);
  }

  // Init delta and start rendering loop
  delta = 0;
  update();
}

init();
