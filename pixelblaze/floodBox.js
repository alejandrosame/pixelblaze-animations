/*----------------------------------------------------------------------------
 For pixelCount=10, this code assumes the following strip arrangement
------------------------------------------------------------------------------
  3 4 5 6
2         7
1         8
0         9
-------------------------------------------------------------------------------*/

export var floodLevel = 0
var sideLength = 30
var delay = 1000

// Setup box bars
export var leftBar = array(2)
export var rightBar = array(2)

leftBar[0] = 0
leftBar[1] = sideLength-1

rightBar [0] = pixelCount-sideLength
rightBar [1] = pixelCount-1

export var timer = 0
export var d

export function beforeRender(delta) {
  d = delta
  if(timer < 0){
    timer = delay
    floodLevel += 0.2
  }

  if(floodLevel > 1.19){
    floodLevel=0
  }

  timer -= delta
}

export function render(index) {
  if(index>=leftBar[0] && index<=leftBar[1]){
    // Only paint if the index is under floodLevel
    if((floodLevel*sideLength) > index){
      rgb(.25, .043, 0.028)
    } else{
      rgb(0,0,0)
    }
  }
  else if (index>=rightBar[0] && index<=rightBar[1]){
    if((floodLevel*sideLength) > pixelCount-index-1){
      rgb(.25, .043, 0.028)
    } else{
      rgb(0,0,0)
    }
  }
  else {
    if(floodLevel >= 0.99){
      rgb(.25, .043, 0.028)
    }else{
      rgb(0,0,0)
    }
  }
}
