var gaucianRandom = require("./rand")

var defaultStat = function(){
  var stat =  { 
    length: gaucianRandom(50,20),
    angle:  Math.random(), //gaucianRandom(50,10),
    sat:    gaucianRandom(50,35)
  }
  return stat
}

module.exports = function(){
  var stats = []
  for(var i=0; i < 8; i++){
    stats.push( defaultStat())
  }
  stats = stats.sort(function(a, b){
    return a.sat > b.sat
  })


  var sortedStat = []
  for(var i=0; i < 8; i++){
    //var j = (i * 3) % 8 
    var j = (i * 3) % 8 
    sortedStat.push(stats[j])
  }
  return sortedStat
}
