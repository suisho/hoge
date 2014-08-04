var Vue = require('vue')
var oneColor = require("onecolor")

function gaucianRandom() {
  //return Math.random() 
  var u = 1 - Math.random()
  var v = 1 - Math.random()
  return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v)
}

var defaultStat = function(){
  return { 
    length: gaucianRandom() * 10 + 50,
    angle:  gaucianRandom() * 30 + 50,
    sat:    gaucianRandom() * 35 + 50
  }
}
var stats = []
for(var i=0; i < 8; i++){
  stats.push( defaultStat())
}

Vue.component('triangle', {
  computed : {
    style : function(){
      return "fill:" + this.color
    },
    color : function(){
      return oneColor(this.baseColor).saturation(this.sat).hex()
    },
    points : function(){
      return this.triangle.map(function(point,i){
        return point.x + ',' + point.y
      }).join(' ')
    },
    d : function(){
      return "M"+this.points+"z"
    }
  }
})

// A resusable polygon graph component
Vue.component('polygraph', {
  template: '#polygraph-template',
  computed: {
    style : function(){
      return "fill:" + this.color
    },
    points: function () {
      var total = this.stats.length
      var rad = Math.PI * 2 / total
      
      return this.stats.map(function (stat, i) {
        var angle = rad * (i + stat.angle/100)
        
        var point = angleToPoint(stat.length, angle)
        return point
      })
    },
    basePoints : function(){
      return this.points.map(function(stat){
        return stat.x + "," + stat.y
      }).join(" ")
    },
    trianglePoints : function(){
      return this.points.map(function(point, i, points){
        //if(i == 2 || i == 4 || i ==7) return // 超暫定
        var next = (i + 1) % points.length
        return [
          {x:0, y:0},
          points[i],
          points[next]
        ]
      }).filter(function(item){
        return item === undefined ? false : true
      })
    },
    triangles : function(){
      var tri = this.trianglePoints
      var clr = this.color
      return this.stats.map(function(st, i){
        return {
          baseColor: clr,
          sat : st.sat/100,
          triangle : tri[i]
        }
      })
    }
  },
})

// math helper...
function angleToPoint (length, angle) {
  var x     = 0,
      y     = length
      cos   = Math.cos(angle),
      sin   = Math.sin(angle),
      tx    = x * cos - y * sin ,
      ty    = x * sin + y * cos 
  return {
    x: tx,
    y: ty 
  }
}

// bootstrap the demo
window.app = new Vue({
  el: '#demo',
  data: {
    newLabel: '',
    stats: stats,
    color : "#8ed7f1"
  }
})