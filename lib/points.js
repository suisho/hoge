// math helper...
var angleToPoint = function(length, angle, scale){
  var x     = 0,
      y     = length
      cos   = Math.cos(angle),
      sin   = Math.sin(angle),
      tx    = x * cos - y * sin * scale,
      ty    = x * sin + y * cos * scale
  return {
    x: tx,
    y: ty 
  }
}

var toPoint = function(stats, scale){
  var rad = Math.PI * 2 / stats.length
  scale = (scale !== undefined) ? scale : 1
  
  return stats.map(function (stat, i) {
    var angle = rad * (i + stat.angle/100)
    
    var point = angleToPoint(stat.length, angle, scale)
    return point
  })
}

module.exports = toPoint