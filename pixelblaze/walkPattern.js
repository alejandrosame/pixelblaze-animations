// Setup functions
function buildIndices(pixelCount, map) {
  width = 2
  var map = array(pixelCount)
  var traversalIndex = 0
  for (i = 0; i < pixelCount/width; i+=width) {
    for(j = 0; j < width; j++){
      map[i+j] = traversalIndex + j*pixelCount/width
    }
    traversalIndex+=1
  }
  return map
}


// Setup variables
export var timer
var delay = 1000 //Speed at which the currentPixel will move
var pixels = array(pixelCount)
export var indexList = buildIndices(pixelCount)
export var plainIndex = 0
export var previousPixel = indexList[pixelCount-1]
export var currentPixel = indexList[0]

export function beforeRender(delta) {
  timer += delta // accumulate all the deltas into a timer

  if (timer > delay) { // after delay, rewind the timer and switch modes
    timer = 0
    plainIndex = (plainIndex+1)%pixelCount
    previousPixel = currentPixel
    currentPixel = indexList[plainIndex]

  }

  pixels[previousPixel] = 0
  pixels[currentPixel] = 1

}

export function render(index) {
  v = pixels[index]
  hsv(0, 1, v)
}
