// math helper...
var angleToPoint = function(length, angle){
  return {
    x: length * Math.cos(angle),
    y: length * Math.sin(angle)
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