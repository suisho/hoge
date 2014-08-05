function _gaucianRandom(m, s) {
  //return Math.random() 
  var u = 1 - Math.random()
  var v = 1 - Math.random()
  
  var rand1 =  Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v)
  var rand2 =  Math.sqrt(-2*Math.log(u)) * Math.sin(2*Math.PI*v)
  return  Math.max(Math.ceil(rand1)) 
}

module.exports = function gaucianRandom(m,s){
  var val = 0
  do{
    val = _gaucianRandom() * s + m
    //console.log(val)
  }while( val < 0 || 100 < val )
  return val
}