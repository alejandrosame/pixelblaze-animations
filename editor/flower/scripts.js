const numStrips = 10;
const stripSize = 150;
const pixelCount = stripSize * numStrips;
const pixelSize = 4;
const canvasLong = stripSize * pixelSize;
const canvasShort = pixelSize;
const VERTICAL_UD = 0;
const VERTICAL_DU = 1;
const HORIZONTAL_LR = 2;
const HORIZONTAL_RL = 3;
const DELTA = 0.1;

let currentPixel;
let currentPixelIndex = pixelCount-1;
let currentStrip;
let stripMap = new Map();
let stripOrientations = [VERTICAL_DU, VERTICAL_UD,
                         VERTICAL_DU, VERTICAL_UD,
                         VERTICAL_DU, VERTICAL_UD,
                         VERTICAL_DU, VERTICAL_UD,
                         VERTICAL_DU, VERTICAL_UD];

let currentContext;

function hsv(h, s, v) {
  currentContext = currentStrip.ctx;
  currentContext.fillStyle = hsvToRgb(h, s, v);

  localPixel = (currentPixel%stripSize);
  if(currentStrip.stripOrientation == HORIZONTAL_RL || currentStrip.stripOrientation == VERTICAL_DU){
    localPixel = stripSize - localPixel;
  }

  x = pixelSize * localPixel;
  y = 0;

  if(currentStrip.stripOrientation == VERTICAL_UD || currentStrip.stripOrientation == VERTICAL_DU){
    tmp = y;
    y = x;
    x = tmp;
  }

  currentContext.fillRect(x, y, pixelSize, pixelSize);
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
  constructor(stripIndex, stripOrientation) {
    const strip = document.createElement("canvas");
    document.body.appendChild(strip);
    strip.className = "canvas";

    this.stripOrientation = stripOrientation;

    if(this.stripOrientation == VERTICAL_UD || this.stripOrientation == VERTICAL_DU){
      strip.setAttribute("width", canvasShort + "px");
      strip.setAttribute("height", canvasLong + "px");
    }else{
      strip.setAttribute("width", canvasLong + "px");
      strip.setAttribute("height", canvasShort + "px");
    }

    this.ctx = strip.getContext("2d");

    let startPixel = stripSize*stripIndex;
    let endPixel = stripSize*stripIndex + stripSize;
    this.range = [startPixel, endPixel];
  }
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
    currentPixelIndex = (currentPixelIndex+1)%pixelCount;
  }
}

function render(index){
  with(Math){
    if(index == currentPixelIndex){
      hsv(0,1,1);
    }else{
      hsv(0,0,0);
    }
  }
}

async function update(){
  beforeRender(delta);

  //Main rendering logic
  for (let i = 0; i < pixelCount; i++) {
    currentPixel = i;
    currentStrip = findCurrentStrip(stripMap, i);

    render(currentPixel);

    //await new Promise(resolve => setTimeout(resolve, 50));
    delta += DELTA;
  }

  requestAnimationFrame(update);
}

function init() {
  // Add strips
  for (let i = 0; i < numStrips; i++) {
    s = new Strip(i, stripOrientations[i]);
    stripMap.set(s.range, s);
  }

  // Init delta and start rendering loop
  delta = 0;
  update();
}

init();
