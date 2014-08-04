var Vue = require('vue')
var oneColor = require("onecolor")
var calcPoints = require("./lib/points")
var generateRandomStat = require("./lib/dummy")

Vue.component('triangle', {
  computed : {
    style : function(){
      return "fill:" + this.color
    },
    frameStyle : function(){
      return "fill:transparent; stroke:white"
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
  replace: true,
  computed: {
    style : function(){
      return "fill:" + this.color
    },
    points: function () {
      return this.scalePoints(0.8)
      //return calcPoints(this.stats, 1)
    },
    basePoints : function(){
      return this.points.map(function(stat){
        return stat.x + "," + stat.y
      }).join(" ")
    },
    frameTriangles : function(){
      var pts = this.scalePoints(1)
      return this.generateTriangles(this.trianglePoints(pts), this.stats)
    },
    triangles : function(){
      return this.generateTriangles(this.trianglePoints(this.points), this.stats)
    },
  },
  methods : {
    scalePoints : function(scale){
      return calcPoints(this.stats, scale)
    },
    generateTriangles : function(tri, stats){
      var clr = this.color
      return stats.map(function(st, i){
        return {
          baseColor: clr,
          sat : st.sat/100,
          triangle : tri[i]
        }
      })
    },
    trianglePoints : function(points){
      return points.map(function(point, i, points){
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
    
  },
})

// bootstrap the demo
window.app = new Vue({
  el: '#demo',
  replace:true,
  data: {
    newLabel: '',
    stats: generateRandomStat(),
    color : "#8ed7f1"
  }
})