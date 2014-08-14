(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/suisho/github/vue-halite/index.js":[function(require,module,exports){
var Vue = require('vue')
var oneColor = require("onecolor")
var calcPoints = require("./lib/points")
var generateRandomStat = require("./lib/dummy")
var extend = require("extend")
Vue.component('triangle', {
  data : {
    z : true
  },
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
      var z = this.z ? "z" : ""
      return "M"+this.points + z
    }
  }
})

// A resusable polygon graph component
Vue.component('polygraph', {
  template: '#polygraph-template',
  replace: true,
  data : {
    frameCount : 1
  },
  ready: function(){
    this.animationStartTime = new Date()
    this.animate()
  },
  computed: {
    style : function(){
      return "fill:" + this.color
    },
    vStats : function(){
      return this.stats.map(function(st){
        return {
          length: st.length - 16,
          angle:  st.angle,
          sat:    st.sat, 
        }
      })
    },
    points: function () {
      return calcPoints(this.vStats)
    },
    basePoints : function(){
      return this.points.map(function(stat){
        return stat.x + "," + stat.y
      }).join(" ")
    },
    frameTriangles : function(){
      var pts = calcPoints(this.stats)
      return this.generateTriangles(this.trianglePoints(pts), this.stats, {
        z : false
      })
    },
    triangles : function(){
      return this.generateTriangles(this.trianglePoints(this.points), this.vStats)
    },
  },
  methods : {
    generateTriangles : function(tri, stats, opt ){
      var clr = this.color
      return stats.map(function(st, i){
        return extend({
          baseColor: clr,
          sat : st.sat/100,
          triangle : tri[i]
        }, opt)
      })
    },
    trianglePoints : function(points){
      return points.map(function(point, i, points){
        return [
          {x:0, y:0},
          points[i],
          points[(i + 1) % points.length]
        ]
      })
    },
    generateAnimateIncrement : function(){
      return {
        length : Math.random() * 10 - 5,
        angle : Math.random() * 10 - 5,
        sat   : Math.random() * 10 - 5,
      }
    
    },
    animate :function(time){
      var self = this
      var frameStep = 50
      if((this.frameCount % frameStep) == 1){
        this.incrementationSet = generateAnimateIncrement
      }      
      
      this.stats.forEach(function(st){
        st.length += self.incrementationSet.length / frameStep
        st.angle +=  self.incrementationSet.angle / frameStep
        st.sat +=    self.incrementationSet.sat / frameStep
      })
      this.frameCount++
      Vue.nextTick(function(e){
        self.animate(e)
      })
    },
    
  },
})

// bootstrap the demo
var app = new Vue({
  el: '#demo',
  replace:true,
  data: {
    newLabel: '',
    stats: generateRandomStat(),
    color : "#8ed7f1"
  }
})


},{"./lib/dummy":"/Users/suisho/github/vue-halite/lib/dummy.js","./lib/points":"/Users/suisho/github/vue-halite/lib/points.js","extend":"/Users/suisho/github/vue-halite/node_modules/extend/index.js","onecolor":"/Users/suisho/github/vue-halite/node_modules/onecolor/one-color-all-debug.js","vue":"/Users/suisho/github/vue-halite/node_modules/vue/src/main.js"}],"/Users/suisho/github/vue-halite/lib/dummy.js":[function(require,module,exports){
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

},{"./rand":"/Users/suisho/github/vue-halite/lib/rand.js"}],"/Users/suisho/github/vue-halite/lib/points.js":[function(require,module,exports){
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
},{}],"/Users/suisho/github/vue-halite/lib/rand.js":[function(require,module,exports){
function _gaucianRandom(m, s) {
  //return Math.random() 
  var u = 1 - Math.random()
  var v = 1 - Math.random()
  
  var rand1 =  Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v)
  var rand2 =  Math.sqrt(-2*Math.log(u)) * Math.sin(2*Math.PI*v)
  return  Math.max(Math.ceil(rand1)) 
}

module.exports = function gaucianRandom(m,s){
  return Math.random() * 70 + 30
  var val = 0
  /*do{
    val = _gaucianRandom() * s + m
    //console.log(val)
  }while( val < 0 || 100 < val )*/
  return val
}
},{}],"/Users/suisho/github/vue-halite/node_modules/extend/index.js":[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],"/Users/suisho/github/vue-halite/node_modules/onecolor/one-color-all-debug.js":[function(require,module,exports){
/*jshint evil:true, onevar:false*/
/*global define*/
var installedColorSpaces = [],
    namedColors = {},
    undef = function (obj) {
        return typeof obj === 'undefined';
    },
    channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
    alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
    cssColorRegExp = new RegExp(
                         "^(rgb|hsl|hsv)a?" +
                         "\\(" +
                             channelRegExp.source + "," +
                             channelRegExp.source + "," +
                             channelRegExp.source +
                             "(?:," + alphaChannelRegExp.source + ")?" +
                         "\\)$", "i");

function ONECOLOR(obj) {
    if (Object.prototype.toString.apply(obj) === '[object Array]') {
        if (typeof obj[0] === 'string' && typeof ONECOLOR[obj[0]] === 'function') {
            // Assumed array from .toJSON()
            return new ONECOLOR[obj[0]](obj.slice(1, obj.length));
        } else if (obj.length === 4) {
            // Assumed 4 element int RGB array from canvas with all channels [0;255]
            return new ONECOLOR.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
        }
    } else if (typeof obj === 'string') {
        var lowerCased = obj.toLowerCase();
        if (namedColors[lowerCased]) {
            obj = '#' + namedColors[lowerCased];
        }
        if (lowerCased === 'transparent') {
            obj = 'rgba(0,0,0,0)';
        }
        // Test for CSS rgb(....) string
        var matchCssSyntax = obj.match(cssColorRegExp);
        if (matchCssSyntax) {
            var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                hasHue = colorSpaceName[0] === 'H',
                firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
            if (undef(ONECOLOR[colorSpaceName])) {
                throw new Error("one.color." + colorSpaceName + " is not installed.");
            }
            return new ONECOLOR[colorSpaceName](
                parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                alpha
            );
        }
        // Assume hex syntax
        if (obj.length < 6) {
            // Allow CSS shorthand
            obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
        }
        // Split obj into red, green, and blue components
        var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
        if (hexMatch) {
            return new ONECOLOR.RGB(
                parseInt(hexMatch[1], 16) / 255,
                parseInt(hexMatch[2], 16) / 255,
                parseInt(hexMatch[3], 16) / 255
            );
        }
    } else if (typeof obj === 'object' && obj.isColor) {
        return obj;
    }
    return false;
}

function installColorSpace(colorSpaceName, propertyNames, config) {
    ONECOLOR[colorSpaceName] = new Function(propertyNames.join(","),
        // Allow passing an array to the constructor:
        "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
            propertyNames.map(function (propertyName, i) {
                return propertyName + "=" + propertyNames[0] + "[" + i + "];";
            }).reverse().join("") +
        "}" +
        "if (" + propertyNames.filter(function (propertyName) {
            return propertyName !== 'alpha';
        }).map(function (propertyName) {
            return "isNaN(" + propertyName + ")";
        }).join("||") + "){" + "throw new Error(\"[" + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\");}" +
        propertyNames.map(function (propertyName) {
            if (propertyName === 'hue') {
                return "this._hue=hue<0?hue-Math.floor(hue):hue%1"; // Wrap
            } else if (propertyName === 'alpha') {
                return "this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);";
            } else {
                return "this._" + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
            }
        }).join(";") + ";"
    );
    ONECOLOR[colorSpaceName].propertyNames = propertyNames;

    var prototype = ONECOLOR[colorSpaceName].prototype;

    ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : new Function("return this.rgb()." + methodName + "();"));
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (undef(epsilon)) {
            epsilon = 1e-10;
        }

        otherColor = otherColor[colorSpaceName.toLowerCase()]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = new Function(
        "return ['" + colorSpaceName + "', " +
            propertyNames.map(function (propertyName) {
                return "this._" + propertyName;
            }, this).join(", ") +
        "];"
    );

    for (var propertyName in config) {
        if (config.hasOwnProperty(propertyName)) {
            var matchFromColorSpace = propertyName.match(/^from(.*)$/);
            if (matchFromColorSpace) {
                ONECOLOR[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
            } else {
                prototype[propertyName] = config[propertyName];
            }
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype[colorSpaceName.toLowerCase()] = function () {
        return this;
    };
    prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
        return "\" " + propertyNames[i] + "=\"+this._" + propertyName;
    }).join("+") + "+\"]\";");

    // Generate getters and setters
    propertyNames.forEach(function (propertyName, i) {
        prototype[propertyName] = prototype[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta",
            // Simple getter mode: color.red()
            "if (typeof value === 'undefined') {" +
                "return this._" + propertyName + ";" +
            "}" +
            // Adjuster: color.red(+.2, true)
            "if (isDelta) {" +
                "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                    return "this._" + otherPropertyName + (propertyName === otherPropertyName ? "+value" : "");
                }).join(", ") + ");" +
            "}" +
            // Setter: color.red(.2);
            "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                return propertyName === otherPropertyName ? "value" : "this._" + otherPropertyName;
            }).join(", ") + ");");
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj[sourceColorSpaceName.toLowerCase()] = new Function("return this.rgb()." + sourceColorSpaceName.toLowerCase() + "();"); // Fallback
        ONECOLOR[sourceColorSpaceName].propertyNames.forEach(function (propertyName, i) {
            obj[propertyName] = obj[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta", "return this." + sourceColorSpaceName.toLowerCase() + "()." + propertyName + "(value, isDelta);");
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && ONECOLOR[targetColorSpaceName].prototype[prop] === undefined) {
                ONECOLOR[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    installedColorSpaces.push(colorSpaceName);
}

ONECOLOR.installMethod = function (name, fn) {
    installedColorSpaces.forEach(function (colorSpace) {
        ONECOLOR[colorSpace].prototype[name] = fn;
    });
};

installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
    hex: function () {
        var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    hexa: function () {
        var alphaString = Math.round(this._alpha * 255).toString(16);
        return '#' + '00'.substr(0, 2 - alphaString.length) + alphaString + this.hex().substr(1, 6);
    },

    css: function () {
        return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
    },

    cssa: function () {
        return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
    }
});

if (typeof module !== 'undefined') {
    // Node module export
    module.exports = ONECOLOR;
} else if (typeof define === 'function' && !undef(define.amd)) {
    define([], function () {
        return ONECOLOR;
    });
} else {
    one = window.one || {};
    one.color = ONECOLOR;
}

if (typeof jQuery !== 'undefined' && undef(jQuery.color)) {
    jQuery.color = ONECOLOR;
}

/*global namedColors*/
namedColors = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '0ff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '00f',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '0ff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgrey: 'a9a9a9',
    darkgreen: '006400',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'f0f',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    grey: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgrey: 'd3d3d3',
    lightgreen: '90ee90',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370d8',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'd87093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    rebeccapurple: '639',
    red: 'f00',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32'
};

/*global INCLUDE, installColorSpace, ONECOLOR*/

installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
    fromRgb: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
        var convert = function (channel) {
                return channel > 0.04045 ?
                    Math.pow((channel + 0.055) / 1.055, 2.4) :
                    channel / 12.92;
            },
            r = convert(this._red),
            g = convert(this._green),
            b = convert(this._blue);

        // Reference white point sRGB D65:
        // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
        return new ONECOLOR.XYZ(
            r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
            r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
            r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
            this._alpha
        );
    },

    rgb: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
        var x = this._x,
            y = this._y,
            z = this._z,
            convert = function (channel) {
                return channel > 0.0031308 ?
                    1.055 * Math.pow(channel, 1 / 2.4) - 0.055 :
                    12.92 * channel;
            };

        // Reference white point sRGB D65:
        // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
        return new ONECOLOR.RGB(
            convert(x *  3.2404542 + y * -1.5371385 + z * -0.4985314),
            convert(x * -0.9692660 + y *  1.8760108 + z *  0.0415560),
            convert(x *  0.0556434 + y * -0.2040259 + z *  1.0572252),
            this._alpha
        );
    },

    lab: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
        var convert = function (channel) {
                return channel > 0.008856 ?
                    Math.pow(channel, 1 / 3) :
                    7.787037 * channel + 4 / 29;
            },
            x = convert(this._x /  95.047),
            y = convert(this._y / 100.000),
            z = convert(this._z / 108.883);

        return new ONECOLOR.LAB(
            (116 * y) - 16,
            500 * (x - y),
            200 * (y - z),
            this._alpha
        );
    }
});

/*global INCLUDE, installColorSpace, ONECOLOR*/

installColorSpace('LAB', ['l', 'a', 'b', 'alpha'], {
    fromRgb: function () {
        return this.xyz().lab();
    },

    rgb: function () {
        return this.xyz().rgb();
    },

    xyz: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=08#text8
        var convert = function (channel) {
                var pow = Math.pow(channel, 3);
                return pow > 0.008856 ?
                    pow :
                    (channel - 16 / 116) / 7.87;
            },
            y = (this._l + 16) / 116,
            x = this._a / 500 + y,
            z = y - this._b / 200;

        return new ONECOLOR.XYZ(
            convert(x) *  95.047,
            convert(y) * 100.000,
            convert(z) * 108.883,
            this._alpha
        );
    }
});

/*global one*/

installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
    rgb: function () {
        var hue = this._hue,
            saturation = this._saturation,
            value = this._value,
            i = Math.min(5, Math.floor(hue * 6)),
            f = hue * 6 - i,
            p = value * (1 - saturation),
            q = value * (1 - f * saturation),
            t = value * (1 - (1 - f) * saturation),
            red,
            green,
            blue;
        switch (i) {
        case 0:
            red = value;
            green = t;
            blue = p;
            break;
        case 1:
            red = q;
            green = value;
            blue = p;
            break;
        case 2:
            red = p;
            green = value;
            blue = t;
            break;
        case 3:
            red = p;
            green = q;
            blue = value;
            break;
        case 4:
            red = t;
            green = p;
            blue = value;
            break;
        case 5:
            red = value;
            green = p;
            blue = q;
            break;
        }
        return new ONECOLOR.RGB(red, green, blue, this._alpha);
    },

    hsl: function () {
        var l = (2 - this._saturation) * this._value,
            sv = this._saturation * this._value,
            svDivisor = l <= 1 ? l : (2 - l),
            saturation;

        // Avoid division by zero when lightness approaches zero:
        if (svDivisor < 1e-9) {
            saturation = 0;
        } else {
            saturation = sv / svDivisor;
        }
        return new ONECOLOR.HSL(this._hue, saturation, l / 2, this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        var red = this._red,
            green = this._green,
            blue = this._blue,
            max = Math.max(red, green, blue),
            min = Math.min(red, green, blue),
            delta = max - min,
            hue,
            saturation = (max === 0) ? 0 : (delta / max),
            value = max;
        if (delta === 0) {
            hue = 0;
        } else {
            switch (max) {
            case red:
                hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                break;
            case green:
                hue = (blue - red) / delta / 6 + 1 / 3;
                break;
            case blue:
                hue = (red - green) / delta / 6 + 2 / 3;
                break;
            }
        }
        return new ONECOLOR.HSV(hue, saturation, value, this._alpha);
    }
});

/*global one*/


installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
    hsv: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var l = this._lightness * 2,
            s = this._saturation * ((l <= 1) ? l : 2 - l),
            saturation;

        // Avoid division by zero when l + s is very small (approaching black):
        if (l + s < 1e-9) {
            saturation = 0;
        } else {
            saturation = (2 * s) / (l + s);
        }

        return new ONECOLOR.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
    },

    rgb: function () {
        return this.hsv().rgb();
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        return this.hsv().hsl();
    }
});

/*global one*/

installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
    rgb: function () {
        return new ONECOLOR.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                 (1 - this._magenta * (1 - this._black) - this._black),
                                 (1 - this._yellow * (1 - this._black) - this._black),
                                 this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var red = this._red,
            green = this._green,
            blue = this._blue,
            cyan = 1 - red,
            magenta = 1 - green,
            yellow = 1 - blue,
            black = 1;
        if (red || green || blue) {
            black = Math.min(cyan, Math.min(magenta, yellow));
            cyan = (cyan - black) / (1 - black);
            magenta = (magenta - black) / (1 - black);
            yellow = (yellow - black) / (1 - black);
        } else {
            black = 1;
        }
        return new ONECOLOR.CMYK(cyan, magenta, yellow, black, this._alpha);
    }
});

ONECOLOR.installMethod('clearer', function (amount) {
    return this.alpha(isNaN(amount) ? -0.1 : -amount, true);
});


ONECOLOR.installMethod('darken', function (amount) {
    return this.lightness(isNaN(amount) ? -0.1 : -amount, true);
});


ONECOLOR.installMethod('desaturate', function (amount) {
    return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
});

function gs () {
    var rgb = this.rgb(),
        val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

    return new ONECOLOR.RGB(val, val, val, this._alpha);
};

ONECOLOR.installMethod('greyscale', gs);
ONECOLOR.installMethod('grayscale', gs);


ONECOLOR.installMethod('lighten', function (amount) {
    return this.lightness(isNaN(amount) ? 0.1 : amount, true);
});

ONECOLOR.installMethod('mix', function (otherColor, weight) {
    otherColor = ONECOLOR(otherColor).rgb();
    weight = 1 - (isNaN(weight) ? 0.5 : weight);

    var w = weight * 2 - 1,
        a = this._alpha - otherColor._alpha,
        weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
        weight2 = 1 - weight1,
        rgb = this.rgb();

    return new ONECOLOR.RGB(
        rgb._red * weight1 + otherColor._red * weight2,
        rgb._green * weight1 + otherColor._green * weight2,
        rgb._blue * weight1 + otherColor._blue * weight2,
        rgb._alpha * weight + otherColor._alpha * (1 - weight)
    );
});

ONECOLOR.installMethod('negate', function () {
    var rgb = this.rgb();
    return new ONECOLOR.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
});

ONECOLOR.installMethod('opaquer', function (amount) {
    return this.alpha(isNaN(amount) ? 0.1 : amount, true);
});

ONECOLOR.installMethod('rotate', function (degrees) {
    return this.hue((degrees || 0) / 360, true);
});


ONECOLOR.installMethod('saturate', function (amount) {
    return this.saturation(isNaN(amount) ? 0.1 : amount, true);
});

// Adapted from http://gimp.sourcearchive.com/documentation/2.6.6-1ubuntu1/color-to-alpha_8c-source.html
/*
    toAlpha returns a color where the values of the argument have been converted to alpha
*/
ONECOLOR.installMethod('toAlpha', function (color) {
    var me = this.rgb(),
        other = ONECOLOR(color).rgb(),
        epsilon = 1e-10,
        a = new ONECOLOR.RGB(0, 0, 0, me._alpha),
        channels = ['_red', '_green', '_blue'];

    channels.forEach(function (channel) {
        if (me[channel] < epsilon) {
            a[channel] = me[channel];
        } else if (me[channel] > other[channel]) {
            a[channel] = (me[channel] - other[channel]) / (1 - other[channel]);
        } else if (me[channel] > other[channel]) {
            a[channel] = (other[channel] - me[channel]) / other[channel];
        } else {
            a[channel] = 0;
        }
    });

    if (a._red > a._green) {
        if (a._red > a._blue) {
            me._alpha = a._red;
        } else {
            me._alpha = a._blue;
        }
    } else if (a._green > a._blue) {
        me._alpha = a._green;
    } else {
        me._alpha = a._blue;
    }

    if (me._alpha < epsilon) {
        return me;
    }

    channels.forEach(function (channel) {
        me[channel] = (me[channel] - other[channel]) / me._alpha + other[channel];
    });
    me._alpha *= a._alpha;

    return me;
});

/*global one*/

// This file is purely for the build system

// Order is important to prevent channel name clashes. Lab <-> hsL

// Convenience functions


},{}],"/Users/suisho/github/vue-halite/node_modules/vue/src/batcher.js":[function(require,module,exports){
var utils = require('./utils')

function Batcher () {
    this.reset()
}

var BatcherProto = Batcher.prototype

BatcherProto.push = function (job) {
    if (!job.id || !this.has[job.id]) {
        this.queue.push(job)
        this.has[job.id] = job
        if (!this.waiting) {
            this.waiting = true
            utils.nextTick(utils.bind(this.flush, this))
        }
    } else if (job.override) {
        var oldJob = this.has[job.id]
        oldJob.cancelled = true
        this.queue.push(job)
        this.has[job.id] = job
    }
}

BatcherProto.flush = function () {
    // before flush hook
    if (this._preFlush) this._preFlush()
    // do not cache length because more jobs might be pushed
    // as we execute existing jobs
    for (var i = 0; i < this.queue.length; i++) {
        var job = this.queue[i]
        if (!job.cancelled) {
            job.execute()
        }
    }
    this.reset()
}

BatcherProto.reset = function () {
    this.has = utils.hash()
    this.queue = []
    this.waiting = false
}

module.exports = Batcher
},{"./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/binding.js":[function(require,module,exports){
var Batcher        = require('./batcher'),
    bindingBatcher = new Batcher(),
    bindingId      = 1

/**
 *  Binding class.
 *
 *  each property on the viewmodel has one corresponding Binding object
 *  which has multiple directive instances on the DOM
 *  and multiple computed property dependents
 */
function Binding (compiler, key, isExp, isFn) {
    this.id = bindingId++
    this.value = undefined
    this.isExp = !!isExp
    this.isFn = isFn
    this.root = !this.isExp && key.indexOf('.') === -1
    this.compiler = compiler
    this.key = key
    this.dirs = []
    this.subs = []
    this.deps = []
    this.unbound = false
}

var BindingProto = Binding.prototype

/**
 *  Update value and queue instance updates.
 */
BindingProto.update = function (value) {
    if (!this.isComputed || this.isFn) {
        this.value = value
    }
    if (this.dirs.length || this.subs.length) {
        var self = this
        bindingBatcher.push({
            id: this.id,
            execute: function () {
                if (!self.unbound) {
                    self._update()
                }
            }
        })
    }
}

/**
 *  Actually update the directives.
 */
BindingProto._update = function () {
    var i = this.dirs.length,
        value = this.val()
    while (i--) {
        this.dirs[i].$update(value)
    }
    this.pub()
}

/**
 *  Return the valuated value regardless
 *  of whether it is computed or not
 */
BindingProto.val = function () {
    return this.isComputed && !this.isFn
        ? this.value.$get()
        : this.value
}

/**
 *  Notify computed properties that depend on this binding
 *  to update themselves
 */
BindingProto.pub = function () {
    var i = this.subs.length
    while (i--) {
        this.subs[i].update()
    }
}

/**
 *  Unbind the binding, remove itself from all of its dependencies
 */
BindingProto.unbind = function () {
    // Indicate this has been unbound.
    // It's possible this binding will be in
    // the batcher's flush queue when its owner
    // compiler has already been destroyed.
    this.unbound = true
    var i = this.dirs.length
    while (i--) {
        this.dirs[i].$unbind()
    }
    i = this.deps.length
    var subs
    while (i--) {
        subs = this.deps[i].subs
        var j = subs.indexOf(this)
        if (j > -1) subs.splice(j, 1)
    }
}

module.exports = Binding
},{"./batcher":"/Users/suisho/github/vue-halite/node_modules/vue/src/batcher.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/compiler.js":[function(require,module,exports){
var Emitter     = require('./emitter'),
    Observer    = require('./observer'),
    config      = require('./config'),
    utils       = require('./utils'),
    Binding     = require('./binding'),
    Directive   = require('./directive'),
    TextParser  = require('./text-parser'),
    DepsParser  = require('./deps-parser'),
    ExpParser   = require('./exp-parser'),
    ViewModel,
    
    // cache methods
    slice       = [].slice,
    extend      = utils.extend,
    hasOwn      = ({}).hasOwnProperty,
    def         = Object.defineProperty,

    // hooks to register
    hooks = [
        'created', 'ready',
        'beforeDestroy', 'afterDestroy',
        'attached', 'detached'
    ],

    // list of priority directives
    // that needs to be checked in specific order
    priorityDirectives = [
        'if',
        'repeat',
        'view',
        'component'
    ]

/**
 *  The DOM compiler
 *  scans a DOM node and compile bindings for a ViewModel
 */
function Compiler (vm, options) {

    var compiler = this,
        key, i

    // default state
    compiler.init       = true
    compiler.destroyed  = false

    // process and extend options
    options = compiler.options = options || {}
    utils.processOptions(options)

    // copy compiler options
    extend(compiler, options.compilerOptions)
    // repeat indicates this is a v-repeat instance
    compiler.repeat   = compiler.repeat || false
    // expCache will be shared between v-repeat instances
    compiler.expCache = compiler.expCache || {}

    // initialize element
    var el = compiler.el = compiler.setupElement(options)
    utils.log('\nnew VM instance: ' + el.tagName + '\n')

    // set other compiler properties
    compiler.vm       = el.vue_vm = vm
    compiler.bindings = utils.hash()
    compiler.dirs     = []
    compiler.deferred = []
    compiler.computed = []
    compiler.children = []
    compiler.emitter  = new Emitter(vm)

    // VM ---------------------------------------------------------------------

    // set VM properties
    vm.$         = {}
    vm.$el       = el
    vm.$options  = options
    vm.$compiler = compiler
    vm.$event    = null

    // set parent & root
    var parentVM = options.parent
    if (parentVM) {
        compiler.parent = parentVM.$compiler
        parentVM.$compiler.children.push(compiler)
        vm.$parent = parentVM
        // inherit lazy option
        if (!('lazy' in options)) {
            options.lazy = compiler.parent.options.lazy
        }
    }
    vm.$root = getRoot(compiler).vm

    // DATA -------------------------------------------------------------------

    // setup observer
    // this is necesarry for all hooks and data observation events
    compiler.setupObserver()

    // create bindings for computed properties
    if (options.methods) {
        for (key in options.methods) {
            compiler.createBinding(key)
        }
    }

    // create bindings for methods
    if (options.computed) {
        for (key in options.computed) {
            compiler.createBinding(key)
        }
    }

    // initialize data
    var data = compiler.data = options.data || {},
        defaultData = options.defaultData
    if (defaultData) {
        for (key in defaultData) {
            if (!hasOwn.call(data, key)) {
                data[key] = defaultData[key]
            }
        }
    }

    // copy paramAttributes
    var params = options.paramAttributes
    if (params) {
        i = params.length
        while (i--) {
            data[params[i]] = utils.checkNumber(
                compiler.eval(
                    el.getAttribute(params[i])
                )
            )
        }
    }

    // copy data properties to vm
    // so user can access them in the created hook
    extend(vm, data)
    vm.$data = data

    // beforeCompile hook
    compiler.execHook('created')

    // the user might have swapped the data ...
    data = compiler.data = vm.$data

    // user might also set some properties on the vm
    // in which case we should copy back to $data
    var vmProp
    for (key in vm) {
        vmProp = vm[key]
        if (
            key.charAt(0) !== '$' &&
            data[key] !== vmProp &&
            typeof vmProp !== 'function'
        ) {
            data[key] = vmProp
        }
    }

    // now we can observe the data.
    // this will convert data properties to getter/setters
    // and emit the first batch of set events, which will
    // in turn create the corresponding bindings.
    compiler.observeData(data)

    // COMPILE ----------------------------------------------------------------

    // before compiling, resolve content insertion points
    if (options.template) {
        this.resolveContent()
    }

    // now parse the DOM and bind directives.
    // During this stage, we will also create bindings for
    // encountered keypaths that don't have a binding yet.
    compiler.compile(el, true)

    // Any directive that creates child VMs are deferred
    // so that when they are compiled, all bindings on the
    // parent VM have been created.
    i = compiler.deferred.length
    while (i--) {
        compiler.bindDirective(compiler.deferred[i])
    }
    compiler.deferred = null

    // extract dependencies for computed properties.
    // this will evaluated all collected computed bindings
    // and collect get events that are emitted.
    if (this.computed.length) {
        DepsParser.parse(this.computed)
    }

    // done!
    compiler.init = false

    // post compile / ready hook
    compiler.execHook('ready')
}

var CompilerProto = Compiler.prototype

/**
 *  Initialize the VM/Compiler's element.
 *  Fill it in with the template if necessary.
 */
CompilerProto.setupElement = function (options) {
    // create the node first
    var el = typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el || document.createElement(options.tagName || 'div')

    var template = options.template,
        child, replacer, i, attr, attrs

    if (template) {
        // collect anything already in there
        if (el.hasChildNodes()) {
            this.rawContent = document.createElement('div')
            /* jshint boss: true */
            while (child = el.firstChild) {
                this.rawContent.appendChild(child)
            }
        }
        // replace option: use the first node in
        // the template directly
        if (options.replace && template.firstChild === template.lastChild) {
            replacer = template.firstChild.cloneNode(true)
            if (el.parentNode) {
                el.parentNode.insertBefore(replacer, el)
                el.parentNode.removeChild(el)
            }
            // copy over attributes
            if (el.hasAttributes()) {
                i = el.attributes.length
                while (i--) {
                    attr = el.attributes[i]
                    replacer.setAttribute(attr.name, attr.value)
                }
            }
            // replace
            el = replacer
        } else {
            el.appendChild(template.cloneNode(true))
        }

    }

    // apply element options
    if (options.id) el.id = options.id
    if (options.className) el.className = options.className
    attrs = options.attributes
    if (attrs) {
        for (attr in attrs) {
            el.setAttribute(attr, attrs[attr])
        }
    }

    return el
}

/**
 *  Deal with <content> insertion points
 *  per the Web Components spec
 */
CompilerProto.resolveContent = function () {

    var outlets = slice.call(this.el.getElementsByTagName('content')),
        raw = this.rawContent,
        outlet, select, i, j, main

    i = outlets.length
    if (i) {
        // first pass, collect corresponding content
        // for each outlet.
        while (i--) {
            outlet = outlets[i]
            if (raw) {
                select = outlet.getAttribute('select')
                if (select) { // select content
                    outlet.content =
                        slice.call(raw.querySelectorAll(select))
                } else { // default content
                    main = outlet
                }
            } else { // fallback content
                outlet.content =
                    slice.call(outlet.childNodes)
            }
        }
        // second pass, actually insert the contents
        for (i = 0, j = outlets.length; i < j; i++) {
            outlet = outlets[i]
            if (outlet === main) continue
            insert(outlet, outlet.content)
        }
        // finally insert the main content
        if (raw && main) {
            insert(main, slice.call(raw.childNodes))
        }
    }

    function insert (outlet, contents) {
        var parent = outlet.parentNode,
            i = 0, j = contents.length
        for (; i < j; i++) {
            parent.insertBefore(contents[i], outlet)
        }
        parent.removeChild(outlet)
    }

    this.rawContent = null
}

/**
 *  Setup observer.
 *  The observer listens for get/set/mutate events on all VM
 *  values/objects and trigger corresponding binding updates.
 *  It also listens for lifecycle hooks.
 */
CompilerProto.setupObserver = function () {

    var compiler = this,
        bindings = compiler.bindings,
        options  = compiler.options,
        observer = compiler.observer = new Emitter(compiler.vm)

    // a hash to hold event proxies for each root level key
    // so they can be referenced and removed later
    observer.proxies = {}

    // add own listeners which trigger binding updates
    observer
        .on('get', onGet)
        .on('set', onSet)
        .on('mutate', onSet)

    // register hooks
    var i = hooks.length, j, hook, fns
    while (i--) {
        hook = hooks[i]
        fns = options[hook]
        if (Array.isArray(fns)) {
            j = fns.length
            // since hooks were merged with child at head,
            // we loop reversely.
            while (j--) {
                registerHook(hook, fns[j])
            }
        } else if (fns) {
            registerHook(hook, fns)
        }
    }

    // broadcast attached/detached hooks
    observer
        .on('hook:attached', function () {
            broadcast(1)
        })
        .on('hook:detached', function () {
            broadcast(0)
        })

    function onGet (key) {
        check(key)
        DepsParser.catcher.emit('get', bindings[key])
    }

    function onSet (key, val, mutation) {
        observer.emit('change:' + key, val, mutation)
        check(key)
        bindings[key].update(val)
    }

    function registerHook (hook, fn) {
        observer.on('hook:' + hook, function () {
            fn.call(compiler.vm)
        })
    }

    function broadcast (event) {
        var children = compiler.children
        if (children) {
            var child, i = children.length
            while (i--) {
                child = children[i]
                if (child.el.parentNode) {
                    event = 'hook:' + (event ? 'attached' : 'detached')
                    child.observer.emit(event)
                    child.emitter.emit(event)
                }
            }
        }
    }

    function check (key) {
        if (!bindings[key]) {
            compiler.createBinding(key)
        }
    }
}

CompilerProto.observeData = function (data) {

    var compiler = this,
        observer = compiler.observer

    // recursively observe nested properties
    Observer.observe(data, '', observer)

    // also create binding for top level $data
    // so it can be used in templates too
    var $dataBinding = compiler.bindings['$data'] = new Binding(compiler, '$data')
    $dataBinding.update(data)

    // allow $data to be swapped
    def(compiler.vm, '$data', {
        get: function () {
            compiler.observer.emit('get', '$data')
            return compiler.data
        },
        set: function (newData) {
            var oldData = compiler.data
            Observer.unobserve(oldData, '', observer)
            compiler.data = newData
            Observer.copyPaths(newData, oldData)
            Observer.observe(newData, '', observer)
            update()
        }
    })

    // emit $data change on all changes
    observer
        .on('set', onSet)
        .on('mutate', onSet)

    function onSet (key) {
        if (key !== '$data') update()
    }

    function update () {
        $dataBinding.update(compiler.data)
        observer.emit('change:$data', compiler.data)
    }
}

/**
 *  Compile a DOM node (recursive)
 */
CompilerProto.compile = function (node, root) {
    var nodeType = node.nodeType
    if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node
        this.compileElement(node, root)
    } else if (nodeType === 3 && config.interpolate) {
        this.compileTextNode(node)
    }
}

/**
 *  Check for a priority directive
 *  If it is present and valid, return true to skip the rest
 */
CompilerProto.checkPriorityDir = function (dirname, node, root) {
    var expression, directive, Ctor
    if (
        dirname === 'component' &&
        root !== true &&
        (Ctor = this.resolveComponent(node, undefined, true))
    ) {
        directive = this.parseDirective(dirname, '', node)
        directive.Ctor = Ctor
    } else {
        expression = utils.attr(node, dirname)
        directive = expression && this.parseDirective(dirname, expression, node)
    }
    if (directive) {
        if (root === true) {
            utils.warn(
                'Directive v-' + dirname + ' cannot be used on an already instantiated ' +
                'VM\'s root node. Use it from the parent\'s template instead.'
            )
            return
        }
        this.deferred.push(directive)
        return true
    }
}

/**
 *  Compile normal directives on a node
 */
CompilerProto.compileElement = function (node, root) {

    // textarea is pretty annoying
    // because its value creates childNodes which
    // we don't want to compile.
    if (node.tagName === 'TEXTAREA' && node.value) {
        node.value = this.eval(node.value)
    }

    // only compile if this element has attributes
    // or its tagName contains a hyphen (which means it could
    // potentially be a custom element)
    if (node.hasAttributes() || node.tagName.indexOf('-') > -1) {

        // skip anything with v-pre
        if (utils.attr(node, 'pre') !== null) {
            return
        }

        var i, l, j, k

        // check priority directives.
        // if any of them are present, it will take over the node with a childVM
        // so we can skip the rest
        for (i = 0, l = priorityDirectives.length; i < l; i++) {
            if (this.checkPriorityDir(priorityDirectives[i], node, root)) {
                return
            }
        }

        // check transition & animation properties
        node.vue_trans  = utils.attr(node, 'transition')
        node.vue_anim   = utils.attr(node, 'animation')
        node.vue_effect = this.eval(utils.attr(node, 'effect'))

        var prefix = config.prefix + '-',
            params = this.options.paramAttributes,
            attr, attrname, isDirective, exp, directives, directive, dirname

        // v-with has special priority among the rest
        // it needs to pull in the value from the parent before
        // computed properties are evaluated, because at this stage
        // the computed properties have not set up their dependencies yet.
        if (root) {
            var withExp = utils.attr(node, 'with')
            if (withExp) {
                directives = this.parseDirective('with', withExp, node, true)
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j], this.parent)
                }
            }
        }

        var attrs = slice.call(node.attributes)
        for (i = 0, l = attrs.length; i < l; i++) {

            attr = attrs[i]
            attrname = attr.name
            isDirective = false

            if (attrname.indexOf(prefix) === 0) {
                // a directive - split, parse and bind it.
                isDirective = true
                dirname = attrname.slice(prefix.length)
                // build with multiple: true
                directives = this.parseDirective(dirname, attr.value, node, true)
                // loop through clauses (separated by ",")
                // inside each attribute
                for (j = 0, k = directives.length; j < k; j++) {
                    this.bindDirective(directives[j])
                }
            } else if (config.interpolate) {
                // non directive attribute, check interpolation tags
                exp = TextParser.parseAttr(attr.value)
                if (exp) {
                    directive = this.parseDirective('attr', exp, node)
                    directive.arg = attrname
                    if (params && params.indexOf(attrname) > -1) {
                        // a param attribute... we should use the parent binding
                        // to avoid circular updates like size={{size}}
                        this.bindDirective(directive, this.parent)
                    } else {
                        this.bindDirective(directive)
                    }
                }
            }

            if (isDirective && dirname !== 'cloak') {
                node.removeAttribute(attrname)
            }
        }

    }

    // recursively compile childNodes
    if (node.hasChildNodes()) {
        slice.call(node.childNodes).forEach(this.compile, this)
    }
}

/**
 *  Compile a text node
 */
CompilerProto.compileTextNode = function (node) {

    var tokens = TextParser.parse(node.nodeValue)
    if (!tokens) return
    var el, token, directive

    for (var i = 0, l = tokens.length; i < l; i++) {

        token = tokens[i]
        directive = null

        if (token.key) { // a binding
            if (token.key.charAt(0) === '>') { // a partial
                el = document.createComment('ref')
                directive = this.parseDirective('partial', token.key.slice(1), el)
            } else {
                if (!token.html) { // text binding
                    el = document.createTextNode('')
                    directive = this.parseDirective('text', token.key, el)
                } else { // html binding
                    el = document.createComment(config.prefix + '-html')
                    directive = this.parseDirective('html', token.key, el)
                }
            }
        } else { // a plain string
            el = document.createTextNode(token)
        }

        // insert node
        node.parentNode.insertBefore(el, node)
        // bind directive
        this.bindDirective(directive)

    }
    node.parentNode.removeChild(node)
}

/**
 *  Parse a directive name/value pair into one or more
 *  directive instances
 */
CompilerProto.parseDirective = function (name, value, el, multiple) {
    var compiler = this,
        definition = compiler.getOption('directives', name)
    if (definition) {
        // parse into AST-like objects
        var asts = Directive.parse(value)
        return multiple
            ? asts.map(build)
            : build(asts[0])
    }
    function build (ast) {
        return new Directive(name, ast, definition, compiler, el)
    }
}

/**
 *  Add a directive instance to the correct binding & viewmodel
 */
CompilerProto.bindDirective = function (directive, bindingOwner) {

    if (!directive) return

    // keep track of it so we can unbind() later
    this.dirs.push(directive)

    // for empty or literal directives, simply call its bind()
    // and we're done.
    if (directive.isEmpty || directive.isLiteral) {
        if (directive.bind) directive.bind()
        return
    }

    // otherwise, we got more work to do...
    var binding,
        compiler = bindingOwner || this,
        key      = directive.key

    if (directive.isExp) {
        // expression bindings are always created on current compiler
        binding = compiler.createBinding(key, directive)
    } else {
        // recursively locate which compiler owns the binding
        while (compiler) {
            if (compiler.hasKey(key)) {
                break
            } else {
                compiler = compiler.parent
            }
        }
        compiler = compiler || this
        binding = compiler.bindings[key] || compiler.createBinding(key)
    }
    binding.dirs.push(directive)
    directive.binding = binding

    var value = binding.val()
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(value)
    }
    // set initial value
    directive.$update(value, true)
}

/**
 *  Create binding and attach getter/setter for a key to the viewmodel object
 */
CompilerProto.createBinding = function (key, directive) {

    utils.log('  created binding: ' + key)

    var compiler = this,
        methods  = compiler.options.methods,
        isExp    = directive && directive.isExp,
        isFn     = (directive && directive.isFn) || (methods && methods[key]),
        bindings = compiler.bindings,
        computed = compiler.options.computed,
        binding  = new Binding(compiler, key, isExp, isFn)

    if (isExp) {
        // expression bindings are anonymous
        compiler.defineExp(key, binding, directive)
    } else if (isFn) {
        bindings[key] = binding
        compiler.defineVmProp(key, binding, methods[key])
    } else {
        bindings[key] = binding
        if (binding.root) {
            // this is a root level binding. we need to define getter/setters for it.
            if (computed && computed[key]) {
                // computed property
                compiler.defineComputed(key, binding, computed[key])
            } else if (key.charAt(0) !== '$') {
                // normal property
                compiler.defineDataProp(key, binding)
            } else {
                // properties that start with $ are meta properties
                // they should be kept on the vm but not in the data object.
                compiler.defineVmProp(key, binding, compiler.data[key])
                delete compiler.data[key]
            }
        } else if (computed && computed[utils.baseKey(key)]) {
            // nested path on computed property
            compiler.defineExp(key, binding)
        } else {
            // ensure path in data so that computed properties that
            // access the path don't throw an error and can collect
            // dependencies
            Observer.ensurePath(compiler.data, key)
            var parentKey = key.slice(0, key.lastIndexOf('.'))
            if (!bindings[parentKey]) {
                // this is a nested value binding, but the binding for its parent
                // has not been created yet. We better create that one too.
                compiler.createBinding(parentKey)
            }
        }
    }
    return binding
}

/**
 *  Define the getter/setter to proxy a root-level
 *  data property on the VM
 */
CompilerProto.defineDataProp = function (key, binding) {
    var compiler = this,
        data     = compiler.data,
        ob       = data.__emitter__

    // make sure the key is present in data
    // so it can be observed
    if (!(hasOwn.call(data, key))) {
        data[key] = undefined
    }

    // if the data object is already observed, but the key
    // is not observed, we need to add it to the observed keys.
    if (ob && !(hasOwn.call(ob.values, key))) {
        Observer.convertKey(data, key)
    }

    binding.value = data[key]

    def(compiler.vm, key, {
        get: function () {
            return compiler.data[key]
        },
        set: function (val) {
            compiler.data[key] = val
        }
    })
}

/**
 *  Define a vm property, e.g. $index, $key, or mixin methods
 *  which are bindable but only accessible on the VM,
 *  not in the data.
 */
CompilerProto.defineVmProp = function (key, binding, value) {
    var ob = this.observer
    binding.value = value
    def(this.vm, key, {
        get: function () {
            if (Observer.shouldGet) ob.emit('get', key)
            return binding.value
        },
        set: function (val) {
            ob.emit('set', key, val)
        }
    })
}

/**
 *  Define an expression binding, which is essentially
 *  an anonymous computed property
 */
CompilerProto.defineExp = function (key, binding, directive) {
    var computedKey = directive && directive.computedKey,
        exp         = computedKey ? directive.expression : key,
        getter      = this.expCache[exp]
    if (!getter) {
        getter = this.expCache[exp] = ExpParser.parse(computedKey || key, this)
    }
    if (getter) {
        this.markComputed(binding, getter)
    }
}

/**
 *  Define a computed property on the VM
 */
CompilerProto.defineComputed = function (key, binding, value) {
    this.markComputed(binding, value)
    def(this.vm, key, {
        get: binding.value.$get,
        set: binding.value.$set
    })
}

/**
 *  Process a computed property binding
 *  so its getter/setter are bound to proper context
 */
CompilerProto.markComputed = function (binding, value) {
    binding.isComputed = true
    // bind the accessors to the vm
    if (binding.isFn) {
        binding.value = value
    } else {
        if (typeof value === 'function') {
            value = { $get: value }
        }
        binding.value = {
            $get: utils.bind(value.$get, this.vm),
            $set: value.$set
                ? utils.bind(value.$set, this.vm)
                : undefined
        }
    }
    // keep track for dep parsing later
    this.computed.push(binding)
}

/**
 *  Retrive an option from the compiler
 */
CompilerProto.getOption = function (type, id, silent) {
    var opts = this.options,
        parent = this.parent,
        globalAssets = config.globalAssets,
        res = (opts[type] && opts[type][id]) || (
            parent
                ? parent.getOption(type, id, silent)
                : globalAssets[type] && globalAssets[type][id]
        )
    if (!res && !silent && typeof id === 'string') {
        utils.warn('Unknown ' + type.slice(0, -1) + ': ' + id)
    }
    return res
}

/**
 *  Emit lifecycle events to trigger hooks
 */
CompilerProto.execHook = function (event) {
    event = 'hook:' + event
    this.observer.emit(event)
    this.emitter.emit(event)
}

/**
 *  Check if a compiler's data contains a keypath
 */
CompilerProto.hasKey = function (key) {
    var baseKey = utils.baseKey(key)
    return hasOwn.call(this.data, baseKey) ||
        hasOwn.call(this.vm, baseKey)
}

/**
 *  Do a one-time eval of a string that potentially
 *  includes bindings. It accepts additional raw data
 *  because we need to dynamically resolve v-component
 *  before a childVM is even compiled...
 */
CompilerProto.eval = function (exp, data) {
    var parsed = TextParser.parseAttr(exp)
    return parsed
        ? ExpParser.eval(parsed, this, data)
        : exp
}

/**
 *  Resolve a Component constructor for an element
 *  with the data to be used
 */
CompilerProto.resolveComponent = function (node, data, test) {

    // late require to avoid circular deps
    ViewModel = ViewModel || require('./viewmodel')

    var exp     = utils.attr(node, 'component'),
        tagName = node.tagName,
        id      = this.eval(exp, data),
        tagId   = (tagName.indexOf('-') > 0 && tagName.toLowerCase()),
        Ctor    = this.getOption('components', id || tagId, true)

    if (id && !Ctor) {
        utils.warn('Unknown component: ' + id)
    }

    return test
        ? exp === ''
            ? ViewModel
            : Ctor
        : Ctor || ViewModel
}

/**
 *  Unbind and remove element
 */
CompilerProto.destroy = function (noRemove) {

    // avoid being called more than once
    // this is irreversible!
    if (this.destroyed) return

    var compiler = this,
        i, j, key, dir, dirs, binding,
        vm          = compiler.vm,
        el          = compiler.el,
        directives  = compiler.dirs,
        computed    = compiler.computed,
        bindings    = compiler.bindings,
        children    = compiler.children,
        parent      = compiler.parent

    compiler.execHook('beforeDestroy')

    // unobserve data
    Observer.unobserve(compiler.data, '', compiler.observer)

    // destroy all children
    // do not remove their elements since the parent
    // may have transitions and the children may not
    i = children.length
    while (i--) {
        children[i].destroy(true)
    }

    // unbind all direcitves
    i = directives.length
    while (i--) {
        dir = directives[i]
        // if this directive is an instance of an external binding
        // e.g. a directive that refers to a variable on the parent VM
        // we need to remove it from that binding's directives
        // * empty and literal bindings do not have binding.
        if (dir.binding && dir.binding.compiler !== compiler) {
            dirs = dir.binding.dirs
            if (dirs) {
                j = dirs.indexOf(dir)
                if (j > -1) dirs.splice(j, 1)
            }
        }
        dir.$unbind()
    }

    // unbind all computed, anonymous bindings
    i = computed.length
    while (i--) {
        computed[i].unbind()
    }

    // unbind all keypath bindings
    for (key in bindings) {
        binding = bindings[key]
        if (binding) {
            binding.unbind()
        }
    }

    // remove self from parent
    if (parent) {
        j = parent.children.indexOf(compiler)
        if (j > -1) parent.children.splice(j, 1)
    }

    // finally remove dom element
    if (!noRemove) {
        if (el === document.body) {
            el.innerHTML = ''
        } else {
            vm.$remove()
        }
    }
    el.vue_vm = null

    compiler.destroyed = true
    // emit destroy hook
    compiler.execHook('afterDestroy')

    // finally, unregister all listeners
    compiler.observer.off()
    compiler.emitter.off()
}

// Helpers --------------------------------------------------------------------

/**
 *  shorthand for getting root compiler
 */
function getRoot (compiler) {
    while (compiler.parent) {
        compiler = compiler.parent
    }
    return compiler
}

module.exports = Compiler
},{"./binding":"/Users/suisho/github/vue-halite/node_modules/vue/src/binding.js","./config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js","./deps-parser":"/Users/suisho/github/vue-halite/node_modules/vue/src/deps-parser.js","./directive":"/Users/suisho/github/vue-halite/node_modules/vue/src/directive.js","./emitter":"/Users/suisho/github/vue-halite/node_modules/vue/src/emitter.js","./exp-parser":"/Users/suisho/github/vue-halite/node_modules/vue/src/exp-parser.js","./observer":"/Users/suisho/github/vue-halite/node_modules/vue/src/observer.js","./text-parser":"/Users/suisho/github/vue-halite/node_modules/vue/src/text-parser.js","./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js","./viewmodel":"/Users/suisho/github/vue-halite/node_modules/vue/src/viewmodel.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js":[function(require,module,exports){
var TextParser = require('./text-parser')

module.exports = {
    prefix         : 'v',
    debug          : false,
    silent         : false,
    enterClass     : 'v-enter',
    leaveClass     : 'v-leave',
    interpolate    : true
}

Object.defineProperty(module.exports, 'delimiters', {
    get: function () {
        return TextParser.delimiters
    },
    set: function (delimiters) {
        TextParser.setDelimiters(delimiters)
    }
})
},{"./text-parser":"/Users/suisho/github/vue-halite/node_modules/vue/src/text-parser.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/deps-parser.js":[function(require,module,exports){
var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    Observer = require('./observer'),
    catcher  = new Emitter()

/**
 *  Auto-extract the dependencies of a computed property
 *  by recording the getters triggered when evaluating it.
 */
function catchDeps (binding) {
    if (binding.isFn) return
    utils.log('\n- ' + binding.key)
    var got = utils.hash()
    binding.deps = []
    catcher.on('get', function (dep) {
        var has = got[dep.key]
        if (
            // avoid duplicate bindings
            (has && has.compiler === dep.compiler) ||
            // avoid repeated items as dependency
            // only when the binding is from self or the parent chain
            (dep.compiler.repeat && !isParentOf(dep.compiler, binding.compiler))
        ) {
            return
        }
        got[dep.key] = dep
        utils.log('  - ' + dep.key)
        binding.deps.push(dep)
        dep.subs.push(binding)
    })
    binding.value.$get()
    catcher.off('get')
}

/**
 *  Test if A is a parent of or equals B
 */
function isParentOf (a, b) {
    while (b) {
        if (a === b) {
            return true
        }
        b = b.parent
    }
}

module.exports = {

    /**
     *  the observer that catches events triggered by getters
     */
    catcher: catcher,

    /**
     *  parse a list of computed property bindings
     */
    parse: function (bindings) {
        utils.log('\nparsing dependencies...')
        Observer.shouldGet = true
        bindings.forEach(catchDeps)
        Observer.shouldGet = false
        utils.log('\ndone.')
    }
    
}
},{"./emitter":"/Users/suisho/github/vue-halite/node_modules/vue/src/emitter.js","./observer":"/Users/suisho/github/vue-halite/node_modules/vue/src/observer.js","./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directive.js":[function(require,module,exports){
var dirId           = 1,
    ARG_RE          = /^[\w\$-]+$/,
    FILTER_TOKEN_RE = /[^\s'"]+|'[^']+'|"[^"]+"/g,
    NESTING_RE      = /^\$(parent|root)\./,
    SINGLE_VAR_RE   = /^[\w\.$]+$/,
    QUOTE_RE        = /"/g,
    TextParser      = require('./text-parser')

/**
 *  Directive class
 *  represents a single directive instance in the DOM
 */
function Directive (name, ast, definition, compiler, el) {

    this.id             = dirId++
    this.name           = name
    this.compiler       = compiler
    this.vm             = compiler.vm
    this.el             = el
    this.computeFilters = false
    this.key            = ast.key
    this.arg            = ast.arg
    this.expression     = ast.expression

    var isEmpty = this.expression === ''

    // mix in properties from the directive definition
    if (typeof definition === 'function') {
        this[isEmpty ? 'bind' : 'update'] = definition
    } else {
        for (var prop in definition) {
            this[prop] = definition[prop]
        }
    }

    // empty expression, we're done.
    if (isEmpty || this.isEmpty) {
        this.isEmpty = true
        return
    }

    if (TextParser.Regex.test(this.key)) {
        this.key = compiler.eval(this.key)
        if (this.isLiteral) {
            this.expression = this.key
        }
    }

    var filters = ast.filters,
        filter, fn, i, l, computed
    if (filters) {
        this.filters = []
        for (i = 0, l = filters.length; i < l; i++) {
            filter = filters[i]
            fn = this.compiler.getOption('filters', filter.name)
            if (fn) {
                filter.apply = fn
                this.filters.push(filter)
                if (fn.computed) {
                    computed = true
                }
            }
        }
    }

    if (!this.filters || !this.filters.length) {
        this.filters = null
    }

    if (computed) {
        this.computedKey = Directive.inlineFilters(this.key, this.filters)
        this.filters = null
    }

    this.isExp =
        computed ||
        !SINGLE_VAR_RE.test(this.key) ||
        NESTING_RE.test(this.key)

}

var DirProto = Directive.prototype

/**
 *  called when a new value is set 
 *  for computed properties, this will only be called once
 *  during initialization.
 */
DirProto.$update = function (value, init) {
    if (this.$lock) return
    if (init || value !== this.value || (value && typeof value === 'object')) {
        this.value = value
        if (this.update) {
            this.update(
                this.filters && !this.computeFilters
                    ? this.$applyFilters(value)
                    : value,
                init
            )
        }
    }
}

/**
 *  pipe the value through filters
 */
DirProto.$applyFilters = function (value) {
    var filtered = value, filter
    for (var i = 0, l = this.filters.length; i < l; i++) {
        filter = this.filters[i]
        filtered = filter.apply.apply(this.vm, [filtered].concat(filter.args))
    }
    return filtered
}

/**
 *  Unbind diretive
 */
DirProto.$unbind = function () {
    // this can be called before the el is even assigned...
    if (!this.el || !this.vm) return
    if (this.unbind) this.unbind()
    this.vm = this.el = this.binding = this.compiler = null
}

// Exposed static methods -----------------------------------------------------

/**
 *  Parse a directive string into an Array of
 *  AST-like objects representing directives
 */
Directive.parse = function (str) {

    var inSingle = false,
        inDouble = false,
        curly    = 0,
        square   = 0,
        paren    = 0,
        begin    = 0,
        argIndex = 0,
        dirs     = [],
        dir      = {},
        lastFilterIndex = 0,
        arg

    for (var c, i = 0, l = str.length; i < l; i++) {
        c = str.charAt(i)
        if (inSingle) {
            // check single quote
            if (c === "'") inSingle = !inSingle
        } else if (inDouble) {
            // check double quote
            if (c === '"') inDouble = !inDouble
        } else if (c === ',' && !paren && !curly && !square) {
            // reached the end of a directive
            pushDir()
            // reset & skip the comma
            dir = {}
            begin = argIndex = lastFilterIndex = i + 1
        } else if (c === ':' && !dir.key && !dir.arg) {
            // argument
            arg = str.slice(begin, i).trim()
            if (ARG_RE.test(arg)) {
                argIndex = i + 1
                dir.arg = arg
            }
        } else if (c === '|' && str.charAt(i + 1) !== '|' && str.charAt(i - 1) !== '|') {
            if (dir.key === undefined) {
                // first filter, end of key
                lastFilterIndex = i + 1
                dir.key = str.slice(argIndex, i).trim()
            } else {
                // already has filter
                pushFilter()
            }
        } else if (c === '"') {
            inDouble = true
        } else if (c === "'") {
            inSingle = true
        } else if (c === '(') {
            paren++
        } else if (c === ')') {
            paren--
        } else if (c === '[') {
            square++
        } else if (c === ']') {
            square--
        } else if (c === '{') {
            curly++
        } else if (c === '}') {
            curly--
        }
    }
    if (i === 0 || begin !== i) {
        pushDir()
    }

    function pushDir () {
        dir.expression = str.slice(begin, i).trim()
        if (dir.key === undefined) {
            dir.key = str.slice(argIndex, i).trim()
        } else if (lastFilterIndex !== begin) {
            pushFilter()
        }
        if (i === 0 || dir.key) {
            dirs.push(dir)
        }
    }

    function pushFilter () {
        var exp = str.slice(lastFilterIndex, i).trim(),
            filter
        if (exp) {
            filter = {}
            var tokens = exp.match(FILTER_TOKEN_RE)
            filter.name = tokens[0]
            filter.args = tokens.length > 1 ? tokens.slice(1) : null
        }
        if (filter) {
            (dir.filters = dir.filters || []).push(filter)
        }
        lastFilterIndex = i + 1
    }

    return dirs
}

/**
 *  Inline computed filters so they become part
 *  of the expression
 */
Directive.inlineFilters = function (key, filters) {
    var args, filter
    for (var i = 0, l = filters.length; i < l; i++) {
        filter = filters[i]
        args = filter.args
            ? ',"' + filter.args.map(escapeQuote).join('","') + '"'
            : ''
        key = 'this.$compiler.getOption("filters", "' +
                filter.name +
            '").call(this,' +
                key + args +
            ')'
    }
    return key
}

/**
 *  Convert double quotes to single quotes
 *  so they don't mess up the generated function body
 */
function escapeQuote (v) {
    return v.indexOf('"') > -1
        ? v.replace(QUOTE_RE, '\'')
        : v
}

module.exports = Directive
},{"./text-parser":"/Users/suisho/github/vue-halite/node_modules/vue/src/text-parser.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/html.js":[function(require,module,exports){
var utils = require('../utils'),
    slice = [].slice

/**
 *  Binding for innerHTML
 */
module.exports = {

    bind: function () {
        // a comment node means this is a binding for
        // {{{ inline unescaped html }}}
        if (this.el.nodeType === 8) {
            // hold nodes
            this.nodes = []
        }
    },

    update: function (value) {
        value = utils.guard(value)
        if (this.nodes) {
            this.swap(value)
        } else {
            this.el.innerHTML = value
        }
    },

    swap: function (value) {
        var parent = this.el.parentNode,
            nodes  = this.nodes,
            i      = nodes.length
        // remove old nodes
        while (i--) {
            parent.removeChild(nodes[i])
        }
        // convert new value to a fragment
        var frag = utils.toFragment(value)
        // save a reference to these nodes so we can remove later
        this.nodes = slice.call(frag.childNodes)
        parent.insertBefore(frag, this.el)
    }
}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/if.js":[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Manages a conditional child VM
 */
module.exports = {

    bind: function () {
        
        this.parent = this.el.parentNode
        this.ref    = document.createComment('vue-if')
        this.Ctor   = this.compiler.resolveComponent(this.el)

        // insert ref
        this.parent.insertBefore(this.ref, this.el)
        this.parent.removeChild(this.el)

        if (utils.attr(this.el, 'view')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-view. ' +
                'Just set v-view\'s binding value to empty string to empty it.'
            )
        }
        if (utils.attr(this.el, 'repeat')) {
            utils.warn(
                'Conflict: v-if cannot be used together with v-repeat. ' +
                'Use `v-show` or the `filterBy` filter instead.'
            )
        }
    },

    update: function (value) {

        if (!value) {
            this.unbind()
        } else if (!this.childVM) {
            this.childVM = new this.Ctor({
                el: this.el.cloneNode(true),
                parent: this.vm
            })
            if (this.compiler.init) {
                this.parent.insertBefore(this.childVM.$el, this.ref)
            } else {
                this.childVM.$before(this.ref)
            }
        }
        
    },

    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
            this.childVM = null
        }
    }
}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/index.js":[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config'),
    transition = require('../transition'),
    directives = module.exports = utils.hash()

/**
 *  Nest and manage a Child VM
 */
directives.component = {
    isLiteral: true,
    bind: function () {
        if (!this.el.vue_vm) {
            this.childVM = new this.Ctor({
                el: this.el,
                parent: this.vm
            })
        }
    },
    unbind: function () {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }
}

/**
 *  Binding HTML attributes
 */
directives.attr = {
    bind: function () {
        var params = this.vm.$options.paramAttributes
        this.isParam = params && params.indexOf(this.arg) > -1
    },
    update: function (value) {
        if (value || value === 0) {
            this.el.setAttribute(this.arg, value)
        } else {
            this.el.removeAttribute(this.arg)
        }
        if (this.isParam) {
            this.vm[this.arg] = utils.checkNumber(value)
        }
    }
}

/**
 *  Binding textContent
 */
directives.text = {
    bind: function () {
        this.attr = this.el.nodeType === 3
            ? 'nodeValue'
            : 'textContent'
    },
    update: function (value) {
        this.el[this.attr] = utils.guard(value)
    }
}

/**
 *  Binding CSS display property
 */
directives.show = function (value) {
    var el = this.el,
        target = value ? '' : 'none',
        change = function () {
            el.style.display = target
        }
    transition(el, value ? 1 : -1, change, this.compiler)
}

/**
 *  Binding CSS classes
 */
directives['class'] = function (value) {
    if (this.arg) {
        utils[value ? 'addClass' : 'removeClass'](this.el, this.arg)
    } else {
        if (this.lastVal) {
            utils.removeClass(this.el, this.lastVal)
        }
        if (value) {
            utils.addClass(this.el, value)
            this.lastVal = value
        }
    }
}

/**
 *  Only removed after the owner VM is ready
 */
directives.cloak = {
    isEmpty: true,
    bind: function () {
        var el = this.el
        this.compiler.observer.once('hook:ready', function () {
            el.removeAttribute(config.prefix + '-cloak')
        })
    }
}

/**
 *  Store a reference to self in parent VM's $
 */
directives.ref = {
    isLiteral: true,
    bind: function () {
        var id = this.expression
        if (id) {
            this.vm.$parent.$[id] = this.vm
        }
    },
    unbind: function () {
        var id = this.expression
        if (id) {
            delete this.vm.$parent.$[id]
        }
    }
}

directives.on      = require('./on')
directives.repeat  = require('./repeat')
directives.model   = require('./model')
directives['if']   = require('./if')
directives['with'] = require('./with')
directives.html    = require('./html')
directives.style   = require('./style')
directives.partial = require('./partial')
directives.view    = require('./view')
},{"../config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js","../transition":"/Users/suisho/github/vue-halite/node_modules/vue/src/transition.js","../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js","./html":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/html.js","./if":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/if.js","./model":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/model.js","./on":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/on.js","./partial":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/partial.js","./repeat":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/repeat.js","./style":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/style.js","./view":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/view.js","./with":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/with.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/model.js":[function(require,module,exports){
var utils = require('../utils'),
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0,
    filter = [].filter

/**
 *  Returns an array of values from a multiple select
 */
function getMultipleSelectOptions (select) {
    return filter
        .call(select.options, function (option) {
            return option.selected
        })
        .map(function (option) {
            return option.value || option.text
        })
}

/**
 *  Two-way binding for form input elements
 */
module.exports = {

    bind: function () {

        var self = this,
            el   = self.el,
            type = el.type,
            tag  = el.tagName

        self.lock = false
        self.ownerVM = self.binding.compiler.vm

        // determine what event to listen to
        self.event =
            (self.compiler.options.lazy ||
            tag === 'SELECT' ||
            type === 'checkbox' || type === 'radio')
                ? 'change'
                : 'input'

        // determine the attribute to change when updating
        self.attr = type === 'checkbox'
            ? 'checked'
            : (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')
                ? 'value'
                : 'innerHTML'

        // select[multiple] support
        if(tag === 'SELECT' && el.hasAttribute('multiple')) {
            this.multi = true
        }

        var compositionLock = false
        self.cLock = function () {
            compositionLock = true
        }
        self.cUnlock = function () {
            compositionLock = false
        }
        el.addEventListener('compositionstart', this.cLock)
        el.addEventListener('compositionend', this.cUnlock)

        // attach listener
        self.set = self.filters
            ? function () {
                if (compositionLock) return
                // if this directive has filters
                // we need to let the vm.$set trigger
                // update() so filters are applied.
                // therefore we have to record cursor position
                // so that after vm.$set changes the input
                // value we can put the cursor back at where it is
                var cursorPos
                try { cursorPos = el.selectionStart } catch (e) {}

                self._set()

                // since updates are async
                // we need to reset cursor position async too
                utils.nextTick(function () {
                    if (cursorPos !== undefined) {
                        el.setSelectionRange(cursorPos, cursorPos)
                    }
                })
            }
            : function () {
                if (compositionLock) return
                // no filters, don't let it trigger update()
                self.lock = true

                self._set()

                utils.nextTick(function () {
                    self.lock = false
                })
            }
        el.addEventListener(self.event, self.set)

        // fix shit for IE9
        // since it doesn't fire input on backspace / del / cut
        if (isIE9) {
            self.onCut = function () {
                // cut event fires before the value actually changes
                utils.nextTick(function () {
                    self.set()
                })
            }
            self.onDel = function (e) {
                if (e.keyCode === 46 || e.keyCode === 8) {
                    self.set()
                }
            }
            el.addEventListener('cut', self.onCut)
            el.addEventListener('keyup', self.onDel)
        }
    },

    _set: function () {
        this.ownerVM.$set(
            this.key, this.multi
                ? getMultipleSelectOptions(this.el)
                : this.el[this.attr]
        )
    },

    update: function (value, init) {
        /* jshint eqeqeq: false */
        // sync back inline value if initial data is undefined
        if (init && value === undefined) {
            return this._set()
        }
        if (this.lock) return
        var el = this.el
        if (el.tagName === 'SELECT') { // select dropdown
            el.selectedIndex = -1
            if(this.multi && Array.isArray(value)) {
                value.forEach(this.updateSelect, this)
            } else {
                this.updateSelect(value)
            }
        } else if (el.type === 'radio') { // radio button
            el.checked = value == el.value
        } else if (el.type === 'checkbox') { // checkbox
            el.checked = !!value
        } else {
            el[this.attr] = utils.guard(value)
        }
    },

    updateSelect: function (value) {
        /* jshint eqeqeq: false */
        // setting <select>'s value in IE9 doesn't work
        // we have to manually loop through the options
        var options = this.el.options,
            i = options.length
        while (i--) {
            if (options[i].value == value) {
                options[i].selected = true
                break
            }
        }
    },

    unbind: function () {
        var el = this.el
        el.removeEventListener(this.event, this.set)
        el.removeEventListener('compositionstart', this.cLock)
        el.removeEventListener('compositionend', this.cUnlock)
        if (isIE9) {
            el.removeEventListener('cut', this.onCut)
            el.removeEventListener('keyup', this.onDel)
        }
    }
}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/on.js":[function(require,module,exports){
var utils    = require('../utils')

/**
 *  Binding for event listeners
 */
module.exports = {

    isFn: true,

    bind: function () {
        this.context = this.binding.isExp
            ? this.vm
            : this.binding.compiler.vm
        if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
            var self = this
            this.iframeBind = function () {
                self.el.contentWindow.addEventListener(self.arg, self.handler)
            }
            this.el.addEventListener('load', this.iframeBind)
        }
    },

    update: function (handler) {
        if (typeof handler !== 'function') {
            utils.warn('Directive "v-on:' + this.expression + '" expects a method.')
            return
        }
        this.reset()
        var vm = this.vm,
            context = this.context
        this.handler = function (e) {
            e.targetVM = vm
            context.$event = e
            var res = handler.call(context, e)
            context.$event = null
            return res
        }
        if (this.iframeBind) {
            this.iframeBind()
        } else {
            this.el.addEventListener(this.arg, this.handler)
        }
    },

    reset: function () {
        var el = this.iframeBind
            ? this.el.contentWindow
            : this.el
        if (this.handler) {
            el.removeEventListener(this.arg, this.handler)
        }
    },

    unbind: function () {
        this.reset()
        this.el.removeEventListener('load', this.iframeBind)
    }
}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/partial.js":[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for partials
 */
module.exports = {

    isLiteral: true,

    bind: function () {

        var id = this.expression
        if (!id) return

        var el       = this.el,
            compiler = this.compiler,
            partial  = compiler.getOption('partials', id)

        if (!partial) {
            if (id === 'yield') {
                utils.warn('{{>yield}} syntax has been deprecated. Use <content> tag instead.')
            }
            return
        }

        partial = partial.cloneNode(true)

        // comment ref node means inline partial
        if (el.nodeType === 8) {

            // keep a ref for the partial's content nodes
            var nodes = [].slice.call(partial.childNodes),
                parent = el.parentNode
            parent.insertBefore(partial, el)
            parent.removeChild(el)
            // compile partial after appending, because its children's parentNode
            // will change from the fragment to the correct parentNode.
            // This could affect directives that need access to its element's parentNode.
            nodes.forEach(compiler.compile, compiler)

        } else {

            // just set innerHTML...
            el.innerHTML = ''
            el.appendChild(partial)

        }
    }

}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/repeat.js":[function(require,module,exports){
var utils      = require('../utils'),
    config     = require('../config')

/**
 *  Binding that manages VMs based on an Array
 */
module.exports = {

    bind: function () {

        this.identifier = '$r' + this.id

        // a hash to cache the same expressions on repeated instances
        // so they don't have to be compiled for every single instance
        this.expCache = utils.hash()

        var el   = this.el,
            ctn  = this.container = el.parentNode

        // extract child Id, if any
        this.childId = this.compiler.eval(utils.attr(el, 'ref'))

        // create a comment node as a reference node for DOM insertions
        this.ref = document.createComment(config.prefix + '-repeat-' + this.key)
        ctn.insertBefore(this.ref, el)
        ctn.removeChild(el)

        this.collection = null
        this.vms = null

    },

    update: function (collection) {

        if (!Array.isArray(collection)) {
            if (utils.isObject(collection)) {
                collection = utils.objectToArray(collection)
            } else {
                utils.warn('v-repeat only accepts Array or Object values.')
            }
        }

        // keep reference of old data and VMs
        // so we can reuse them if possible
        this.oldVMs = this.vms
        this.oldCollection = this.collection
        collection = this.collection = collection || []

        var isObject = collection[0] && utils.isObject(collection[0])
        this.vms = this.oldCollection
            ? this.diff(collection, isObject)
            : this.init(collection, isObject)

        if (this.childId) {
            this.vm.$[this.childId] = this.vms
        }

    },

    init: function (collection, isObject) {
        var vm, vms = []
        for (var i = 0, l = collection.length; i < l; i++) {
            vm = this.build(collection[i], i, isObject)
            vms.push(vm)
            if (this.compiler.init) {
                this.container.insertBefore(vm.$el, this.ref)
            } else {
                vm.$before(this.ref)
            }
        }
        return vms
    },

    /**
     *  Diff the new array with the old
     *  and determine the minimum amount of DOM manipulations.
     */
    diff: function (newCollection, isObject) {

        var i, l, item, vm,
            oldIndex,
            targetNext,
            currentNext,
            nextEl,
            ctn    = this.container,
            oldVMs = this.oldVMs,
            vms    = []

        vms.length = newCollection.length

        // first pass, collect new reused and new created
        for (i = 0, l = newCollection.length; i < l; i++) {
            item = newCollection[i]
            if (isObject) {
                item.$index = i
                if (item.__emitter__ && item.__emitter__[this.identifier]) {
                    // this piece of data is being reused.
                    // record its final position in reused vms
                    item.$reused = true
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            } else {
                // we can't attach an identifier to primitive values
                // so have to do an indexOf...
                oldIndex = indexOf(oldVMs, item)
                if (oldIndex > -1) {
                    // record the position on the existing vm
                    oldVMs[oldIndex].$reused = true
                    oldVMs[oldIndex].$data.$index = i
                } else {
                    vms[i] = this.build(item, i, isObject)
                }
            }
        }

        // second pass, collect old reused and destroy unused
        for (i = 0, l = oldVMs.length; i < l; i++) {
            vm = oldVMs[i]
            item = this.arg
                ? vm.$data[this.arg]
                : vm.$data
            if (item.$reused) {
                vm.$reused = true
                delete item.$reused
            }
            if (vm.$reused) {
                // update the index to latest
                vm.$index = item.$index
                // the item could have had a new key
                if (item.$key && item.$key !== vm.$key) {
                    vm.$key = item.$key
                }
                vms[vm.$index] = vm
            } else {
                // this one can be destroyed.
                if (item.__emitter__) {
                    delete item.__emitter__[this.identifier]
                }
                vm.$destroy()
            }
        }

        // final pass, move/insert DOM elements
        i = vms.length
        while (i--) {
            vm = vms[i]
            item = vm.$data
            targetNext = vms[i + 1]
            if (vm.$reused) {
                nextEl = vm.$el.nextSibling
                // destroyed VMs' element might still be in the DOM
                // due to transitions
                while (!nextEl.vue_vm && nextEl !== this.ref) {
                    nextEl = nextEl.nextSibling
                }
                currentNext = nextEl.vue_vm
                if (currentNext !== targetNext) {
                    if (!targetNext) {
                        ctn.insertBefore(vm.$el, this.ref)
                    } else {
                        nextEl = targetNext.$el
                        // new VMs' element might not be in the DOM yet
                        // due to transitions
                        while (!nextEl.parentNode) {
                            targetNext = vms[nextEl.vue_vm.$index + 1]
                            nextEl = targetNext
                                ? targetNext.$el
                                : this.ref
                        }
                        ctn.insertBefore(vm.$el, nextEl)
                    }
                }
                delete vm.$reused
                delete item.$index
                delete item.$key
            } else { // a new vm
                vm.$before(targetNext ? targetNext.$el : this.ref)
            }
        }

        return vms
    },

    build: function (data, index, isObject) {

        // wrap non-object values
        var raw, alias,
            wrap = !isObject || this.arg
        if (wrap) {
            raw = data
            alias = this.arg || '$value'
            data = {}
            data[alias] = raw
        }
        data.$index = index

        var el = this.el.cloneNode(true),
            Ctor = this.compiler.resolveComponent(el, data),
            vm = new Ctor({
                el: el,
                data: data,
                parent: this.vm,
                compilerOptions: {
                    repeat: true,
                    expCache: this.expCache
                }
            })

        if (isObject) {
            // attach an ienumerable identifier to the raw data
            (raw || data).__emitter__[this.identifier] = true
        }

        return vm

    },

    unbind: function () {
        if (this.childId) {
            delete this.vm.$[this.childId]
        }
        if (this.vms) {
            var i = this.vms.length
            while (i--) {
                this.vms[i].$destroy()
            }
        }
    }
}

// Helpers --------------------------------------------------------------------

/**
 *  Find an object or a wrapped data object
 *  from an Array
 */
function indexOf (vms, obj) {
    for (var vm, i = 0, l = vms.length; i < l; i++) {
        vm = vms[i]
        if (!vm.$reused && vm.$value === obj) {
            return i
        }
    }
    return -1
}
},{"../config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js","../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/style.js":[function(require,module,exports){
var prefixes = ['-webkit-', '-moz-', '-ms-']

/**
 *  Binding for CSS styles
 */
module.exports = {

    bind: function () {
        var prop = this.arg
        if (!prop) return
        if (prop.charAt(0) === '$') {
            // properties that start with $ will be auto-prefixed
            prop = prop.slice(1)
            this.prefixed = true
        }
        this.prop = prop
    },

    update: function (value) {
        var prop = this.prop,
            isImportant
        /* jshint eqeqeq: true */
        // cast possible numbers/booleans into strings
        if (value != null) value += ''
        if (prop) {
            if (value) {
                isImportant = value.slice(-10) === '!important'
                    ? 'important'
                    : ''
                if (isImportant) {
                    value = value.slice(0, -10).trim()
                }
            }
            this.el.style.setProperty(prop, value, isImportant)
            if (this.prefixed) {
                var i = prefixes.length
                while (i--) {
                    this.el.style.setProperty(prefixes[i] + prop, value, isImportant)
                }
            }
        } else {
            this.el.style.cssText = value
        }
    }

}
},{}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/view.js":[function(require,module,exports){
/**
 *  Manages a conditional child VM using the
 *  binding's value as the component ID.
 */
module.exports = {

    bind: function () {

        // track position in DOM with a ref node
        var el       = this.raw = this.el,
            parent   = el.parentNode,
            ref      = this.ref = document.createComment('v-view')
        parent.insertBefore(ref, el)
        parent.removeChild(el)

        // cache original content
        /* jshint boss: true */
        var node,
            frag = this.inner = document.createElement('div')
        while (node = el.firstChild) {
            frag.appendChild(node)
        }

    },

    update: function(value) {

        this.unbind()

        var Ctor  = this.compiler.getOption('components', value)
        if (!Ctor) return

        this.childVM = new Ctor({
            el: this.raw.cloneNode(true),
            parent: this.vm,
            compilerOptions: {
                rawContent: this.inner.cloneNode(true)
            }
        })

        this.el = this.childVM.$el
        if (this.compiler.init) {
            this.ref.parentNode.insertBefore(this.el, this.ref)
        } else {
            this.childVM.$before(this.ref)
        }

    },

    unbind: function() {
        if (this.childVM) {
            this.childVM.$destroy()
        }
    }

}
},{}],"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/with.js":[function(require,module,exports){
var utils = require('../utils')

/**
 *  Binding for inheriting data from parent VMs.
 */
module.exports = {

    bind: function () {

        var self      = this,
            childKey  = self.arg,
            parentKey = self.key,
            compiler  = self.compiler,
            owner     = self.binding.compiler

        if (compiler === owner) {
            this.alone = true
            return
        }

        if (childKey) {
            if (!compiler.bindings[childKey]) {
                compiler.createBinding(childKey)
            }
            // sync changes on child back to parent
            compiler.observer.on('change:' + childKey, function (val) {
                if (compiler.init) return
                if (!self.lock) {
                    self.lock = true
                    utils.nextTick(function () {
                        self.lock = false
                    })
                }
                owner.vm.$set(parentKey, val)
            })
        }
    },

    update: function (value) {
        // sync from parent
        if (!this.alone && !this.lock) {
            if (this.arg) {
                this.vm.$set(this.arg, value)
            } else if (this.vm.$data !== value) {
                this.vm.$data = value
            }
        }
    }

}
},{"../utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/emitter.js":[function(require,module,exports){
var slice = [].slice

function Emitter (ctx) {
    this._ctx = ctx || this
}

var EmitterProto = Emitter.prototype

EmitterProto.on = function (event, fn) {
    this._cbs = this._cbs || {}
    ;(this._cbs[event] = this._cbs[event] || [])
        .push(fn)
    return this
}

EmitterProto.once = function (event, fn) {
    var self = this
    this._cbs = this._cbs || {}

    function on () {
        self.off(event, on)
        fn.apply(this, arguments)
    }

    on.fn = fn
    this.on(event, on)
    return this
}

EmitterProto.off = function (event, fn) {
    this._cbs = this._cbs || {}

    // all
    if (!arguments.length) {
        this._cbs = {}
        return this
    }

    // specific event
    var callbacks = this._cbs[event]
    if (!callbacks) return this

    // remove all handlers
    if (arguments.length === 1) {
        delete this._cbs[event]
        return this
    }

    // remove specific handler
    var cb
    for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i]
        if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1)
            break
        }
    }
    return this
}

/**
 *  The internal, faster emit with fixed amount of arguments
 *  using Function.call
 */
EmitterProto.emit = function (event, a, b, c) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event]

    if (callbacks) {
        callbacks = callbacks.slice(0)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].call(this._ctx, a, b, c)
        }
    }

    return this
}

/**
 *  The external emit using Function.apply
 */
EmitterProto.applyEmit = function (event) {
    this._cbs = this._cbs || {}
    var callbacks = this._cbs[event], args

    if (callbacks) {
        callbacks = callbacks.slice(0)
        args = slice.call(arguments, 1)
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(this._ctx, args)
        }
    }

    return this
}

module.exports = Emitter
},{}],"/Users/suisho/github/vue-halite/node_modules/vue/src/exp-parser.js":[function(require,module,exports){
var utils           = require('./utils'),
    STR_SAVE_RE     = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
    STR_RESTORE_RE  = /"(\d+)"/g,
    NEWLINE_RE      = /\n/g,
    CTOR_RE         = new RegExp('constructor'.split('').join('[\'"+, ]*')),
    UNICODE_RE      = /\\u\d\d\d\d/

// Variable extraction scooped from https://github.com/RubyLouvre/avalon

var KEYWORDS =
        // keywords
        'break,case,catch,continue,debugger,default,delete,do,else,false' +
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
        ',throw,true,try,typeof,var,void,while,with,undefined' +
        // reserved
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
        ',final,float,goto,implements,import,int,interface,long,native' +
        ',package,private,protected,public,short,static,super,synchronized' +
        ',throws,transient,volatile' +
        // ECMA 5 - use strict
        ',arguments,let,yield' +
        // allow using Math in expressions
        ',Math',
        
    KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g'),
    REMOVE_RE   = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+|[\{,]\s*[\w\$_]+\s*:/g,
    SPLIT_RE    = /[^\w$]+/g,
    NUMBER_RE   = /\b\d[^,]*/g,
    BOUNDARY_RE = /^,+|,+$/g

/**
 *  Strip top level variable names from a snippet of JS expression
 */
function getVariables (code) {
    code = code
        .replace(REMOVE_RE, '')
        .replace(SPLIT_RE, ',')
        .replace(KEYWORDS_RE, '')
        .replace(NUMBER_RE, '')
        .replace(BOUNDARY_RE, '')
    return code
        ? code.split(/,+/)
        : []
}

/**
 *  A given path could potentially exist not on the
 *  current compiler, but up in the parent chain somewhere.
 *  This function generates an access relationship string
 *  that can be used in the getter function by walking up
 *  the parent chain to check for key existence.
 *
 *  It stops at top parent if no vm in the chain has the
 *  key. It then creates any missing bindings on the
 *  final resolved vm.
 */
function traceScope (path, compiler, data) {
    var rel  = '',
        dist = 0,
        self = compiler

    if (data && utils.get(data, path) !== undefined) {
        // hack: temporarily attached data
        return '$temp.'
    }

    while (compiler) {
        if (compiler.hasKey(path)) {
            break
        } else {
            compiler = compiler.parent
            dist++
        }
    }
    if (compiler) {
        while (dist--) {
            rel += '$parent.'
        }
        if (!compiler.bindings[path] && path.charAt(0) !== '$') {
            compiler.createBinding(path)
        }
    } else {
        self.createBinding(path)
    }
    return rel
}

/**
 *  Create a function from a string...
 *  this looks like evil magic but since all variables are limited
 *  to the VM's data it's actually properly sandboxed
 */
function makeGetter (exp, raw) {
    var fn
    try {
        fn = new Function(exp)
    } catch (e) {
        utils.warn('Error parsing expression: ' + raw)
    }
    return fn
}

/**
 *  Escape a leading dollar sign for regex construction
 */
function escapeDollar (v) {
    return v.charAt(0) === '$'
        ? '\\' + v
        : v
}

/**
 *  Parse and return an anonymous computed property getter function
 *  from an arbitrary expression, together with a list of paths to be
 *  created as bindings.
 */
exports.parse = function (exp, compiler, data) {
    // unicode and 'constructor' are not allowed for XSS security.
    if (UNICODE_RE.test(exp) || CTOR_RE.test(exp)) {
        utils.warn('Unsafe expression: ' + exp)
        return
    }
    // extract variable names
    var vars = getVariables(exp)
    if (!vars.length) {
        return makeGetter('return ' + exp, exp)
    }
    vars = utils.unique(vars)

    var accessors = '',
        has       = utils.hash(),
        strings   = [],
        // construct a regex to extract all valid variable paths
        // ones that begin with "$" are particularly tricky
        // because we can't use \b for them
        pathRE = new RegExp(
            "[^$\\w\\.](" +
            vars.map(escapeDollar).join('|') +
            ")[$\\w\\.]*\\b", 'g'
        ),
        body = (' ' + exp)
            .replace(STR_SAVE_RE, saveStrings)
            .replace(pathRE, replacePath)
            .replace(STR_RESTORE_RE, restoreStrings)

    body = accessors + 'return ' + body

    function saveStrings (str) {
        var i = strings.length
        // escape newlines in strings so the expression
        // can be correctly evaluated
        strings[i] = str.replace(NEWLINE_RE, '\\n')
        return '"' + i + '"'
    }

    function replacePath (path) {
        // keep track of the first char
        var c = path.charAt(0)
        path = path.slice(1)
        var val = 'this.' + traceScope(path, compiler, data) + path
        if (!has[path]) {
            accessors += val + ';'
            has[path] = 1
        }
        // don't forget to put that first char back
        return c + val
    }

    function restoreStrings (str, i) {
        return strings[i]
    }

    return makeGetter(body, exp)
}

/**
 *  Evaluate an expression in the context of a compiler.
 *  Accepts additional data.
 */
exports.eval = function (exp, compiler, data) {
    var getter = exports.parse(exp, compiler, data), res
    if (getter) {
        // hack: temporarily attach the additional data so
        // it can be accessed in the getter
        compiler.vm.$temp = data
        res = getter.call(compiler.vm)
        delete compiler.vm.$temp
    }
    return res
}
},{"./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/filters.js":[function(require,module,exports){
var utils    = require('./utils'),
    get      = utils.get,
    slice    = [].slice,
    QUOTE_RE = /^'.*'$/,
    filters  = module.exports = utils.hash()

/**
 *  'abc' => 'Abc'
 */
filters.capitalize = function (value) {
    if (!value && value !== 0) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 *  'abc' => 'ABC'
 */
filters.uppercase = function (value) {
    return (value || value === 0)
        ? value.toString().toUpperCase()
        : ''
}

/**
 *  'AbC' => 'abc'
 */
filters.lowercase = function (value) {
    return (value || value === 0)
        ? value.toString().toLowerCase()
        : ''
}

/**
 *  12345 => $12,345.00
 */
filters.currency = function (value, sign) {
    value = parseFloat(value)
    if (!value && value !== 0) return ''
    sign = sign || '$'
    var s = Math.floor(value).toString(),
        i = s.length % 3,
        h = i > 0 ? (s.slice(0, i) + (s.length > 3 ? ',' : '')) : '',
        f = '.' + value.toFixed(2).slice(-2)
    return sign + h + s.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + f
}

/**
 *  args: an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */
filters.pluralize = function (value) {
    var args = slice.call(arguments, 1)
    return args.length > 1
        ? (args[value - 1] || args[args.length - 1])
        : (args[value - 1] || args[0] + 's')
}

/**
 *  A special filter that takes a handler function,
 *  wraps it so it only gets triggered on specific keypresses.
 *
 *  v-on only
 */

var keyCodes = {
    enter    : 13,
    tab      : 9,
    'delete' : 46,
    up       : 38,
    left     : 37,
    right    : 39,
    down     : 40,
    esc      : 27
}

filters.key = function (handler, key) {
    if (!handler) return
    var code = keyCodes[key]
    if (!code) {
        code = parseInt(key, 10)
    }
    return function (e) {
        if (e.keyCode === code) {
            return handler.call(this, e)
        }
    }
}

/**
 *  Filter filter for v-repeat
 */
filters.filterBy = function (arr, searchKey, delimiter, dataKey) {

    // allow optional `in` delimiter
    // because why not
    if (delimiter && delimiter !== 'in') {
        dataKey = delimiter
    }

    // get the search string
    var search = stripQuotes(searchKey) || this.$get(searchKey)
    if (!search) return arr
    search = search.toLowerCase()

    // get the optional dataKey
    dataKey = dataKey && (stripQuotes(dataKey) || this.$get(dataKey))

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    return arr.filter(function (item) {
        return dataKey
            ? contains(get(item, dataKey), search)
            : contains(item, search)
    })

}

filters.filterBy.computed = true

/**
 *  Sort fitler for v-repeat
 */
filters.orderBy = function (arr, sortKey, reverseKey) {

    var key = stripQuotes(sortKey) || this.$get(sortKey)
    if (!key) return arr

    // convert object to array
    if (!Array.isArray(arr)) {
        arr = utils.objectToArray(arr)
    }

    var order = 1
    if (reverseKey) {
        if (reverseKey === '-1') {
            order = -1
        } else if (reverseKey.charAt(0) === '!') {
            reverseKey = reverseKey.slice(1)
            order = this.$get(reverseKey) ? 1 : -1
        } else {
            order = this.$get(reverseKey) ? -1 : 1
        }
    }

    // sort on a copy to avoid mutating original array
    return arr.slice().sort(function (a, b) {
        a = get(a, key)
        b = get(b, key)
        return a === b ? 0 : a > b ? order : -order
    })

}

filters.orderBy.computed = true

// Array filter helpers -------------------------------------------------------

/**
 *  String contain helper
 */
function contains (val, search) {
    /* jshint eqeqeq: false */
    if (utils.isObject(val)) {
        for (var key in val) {
            if (contains(val[key], search)) {
                return true
            }
        }
    } else if (val != null) {
        return val.toString().toLowerCase().indexOf(search) > -1
    }
}

/**
 *  Test whether a string is in quotes,
 *  if yes return stripped string
 */
function stripQuotes (str) {
    if (QUOTE_RE.test(str)) {
        return str.slice(1, -1)
    }
}
},{"./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/fragment.js":[function(require,module,exports){
// string -> DOM conversion
// wrappers originally from jQuery, scooped from component/domify
var map = {
    legend   : [1, '<fieldset>', '</fieldset>'],
    tr       : [2, '<table><tbody>', '</tbody></table>'],
    col      : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    _default : [0, '', '']
}

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>']

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>']

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>']

var TAG_RE = /<([\w:]+)/

module.exports = function (templateString) {
    var frag = document.createDocumentFragment(),
        m = TAG_RE.exec(templateString)
    // text only
    if (!m) {
        frag.appendChild(document.createTextNode(templateString))
        return frag
    }

    var tag = m[1],
        wrap = map[tag] || map._default,
        depth = wrap[0],
        prefix = wrap[1],
        suffix = wrap[2],
        node = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) node = node.lastChild

    // one element
    if (node.firstChild === node.lastChild) {
        frag.appendChild(node.firstChild)
        return frag
    }

    // multiple nodes, return a fragment
    var child
    /* jshint boss: true */
    while (child = node.firstChild) {
        if (node.nodeType === 1) {
            frag.appendChild(child)
        }
    }
    return frag
}
},{}],"/Users/suisho/github/vue-halite/node_modules/vue/src/main.js":[function(require,module,exports){
var config      = require('./config'),
    ViewModel   = require('./viewmodel'),
    utils       = require('./utils'),
    makeHash    = utils.hash,
    assetTypes  = ['directive', 'filter', 'partial', 'effect', 'component'],
    // Internal modules that are exposed for plugins
    pluginAPI   = {
        utils: utils,
        config: config,
        transition: require('./transition'),
        observer: require('./observer')
    }

ViewModel.options = config.globalAssets = {
    directives  : require('./directives'),
    filters     : require('./filters'),
    partials    : makeHash(),
    effects     : makeHash(),
    components  : makeHash()
}

/**
 *  Expose asset registration methods
 */
assetTypes.forEach(function (type) {
    ViewModel[type] = function (id, value) {
        var hash = this.options[type + 's']
        if (!hash) {
            hash = this.options[type + 's'] = makeHash()
        }
        if (!value) return hash[id]
        if (type === 'partial') {
            value = utils.parseTemplateOption(value)
        } else if (type === 'component') {
            value = utils.toConstructor(value)
        } else if (type === 'filter') {
            utils.checkFilter(value)
        }
        hash[id] = value
        return this
    }
})

/**
 *  Set config options
 */
ViewModel.config = function (opts, val) {
    if (typeof opts === 'string') {
        if (val === undefined) {
            return config[opts]
        } else {
            config[opts] = val
        }
    } else {
        utils.extend(config, opts)
    }
    return this
}

/**
 *  Expose an interface for plugins
 */
ViewModel.use = function (plugin) {
    if (typeof plugin === 'string') {
        try {
            plugin = require(plugin)
        } catch (e) {
            utils.warn('Cannot find plugin: ' + plugin)
            return
        }
    }

    // additional parameters
    var args = [].slice.call(arguments, 1)
    args.unshift(this)

    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else {
        plugin.apply(null, args)
    }
    return this
}

/**
 *  Expose internal modules for plugins
 */
ViewModel.require = function (module) {
    return pluginAPI[module]
}

ViewModel.extend = extend
ViewModel.nextTick = utils.nextTick

/**
 *  Expose the main ViewModel class
 *  and add extend method
 */
function extend (options) {

    var ParentVM = this

    // extend data options need to be copied
    // on instantiation
    if (options.data) {
        options.defaultData = options.data
        delete options.data
    }

    // inherit options
    // but only when the super class is not the native Vue.
    if (ParentVM !== ViewModel) {
        options = inheritOptions(options, ParentVM.options, true)
    }
    utils.processOptions(options)

    var ExtendedVM = function (opts, asParent) {
        if (!asParent) {
            opts = inheritOptions(opts, options, true)
        }
        ParentVM.call(this, opts, true)
    }

    // inherit prototype props
    var proto = ExtendedVM.prototype = Object.create(ParentVM.prototype)
    utils.defProtected(proto, 'constructor', ExtendedVM)

    // allow extended VM to be further extended
    ExtendedVM.extend  = extend
    ExtendedVM.super   = ParentVM
    ExtendedVM.options = options

    // allow extended VM to add its own assets
    assetTypes.forEach(function (type) {
        ExtendedVM[type] = ViewModel[type]
    })

    // allow extended VM to use plugins
    ExtendedVM.use     = ViewModel.use
    ExtendedVM.require = ViewModel.require

    return ExtendedVM
}

/**
 *  Inherit options
 *
 *  For options such as `data`, `vms`, `directives`, 'partials',
 *  they should be further extended. However extending should only
 *  be done at top level.
 *  
 *  `proto` is an exception because it's handled directly on the
 *  prototype.
 *
 *  `el` is an exception because it's not allowed as an
 *  extension option, but only as an instance option.
 */
function inheritOptions (child, parent, topLevel) {
    child = child || {}
    if (!parent) return child
    for (var key in parent) {
        if (key === 'el') continue
        var val = child[key],
            parentVal = parent[key]
        if (topLevel && typeof val === 'function' && parentVal) {
            // merge hook functions into an array
            child[key] = [val]
            if (Array.isArray(parentVal)) {
                child[key] = child[key].concat(parentVal)
            } else {
                child[key].push(parentVal)
            }
        } else if (
            topLevel &&
            (utils.isTrueObject(val) || utils.isTrueObject(parentVal))
            && !(parentVal instanceof ViewModel)
        ) {
            // merge toplevel object options
            child[key] = inheritOptions(val, parentVal)
        } else if (val === undefined) {
            // inherit if child doesn't override
            child[key] = parentVal
        }
    }
    return child
}

module.exports = ViewModel
},{"./config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js","./directives":"/Users/suisho/github/vue-halite/node_modules/vue/src/directives/index.js","./filters":"/Users/suisho/github/vue-halite/node_modules/vue/src/filters.js","./observer":"/Users/suisho/github/vue-halite/node_modules/vue/src/observer.js","./transition":"/Users/suisho/github/vue-halite/node_modules/vue/src/transition.js","./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js","./viewmodel":"/Users/suisho/github/vue-halite/node_modules/vue/src/viewmodel.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/observer.js":[function(require,module,exports){
/* jshint proto:true */

var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    // cache methods
    def      = utils.defProtected,
    isObject = utils.isObject,
    isArray  = Array.isArray,
    hasOwn   = ({}).hasOwnProperty,
    oDef     = Object.defineProperty,
    slice    = [].slice,
    // fix for IE + __proto__ problem
    // define methods as inenumerable if __proto__ is present,
    // otherwise enumerable so we can loop through and manually
    // attach to array instances
    hasProto = ({}).__proto__

// Array Mutation Handlers & Augmentations ------------------------------------

// The proxy prototype to replace the __proto__ of
// an observed array
var ArrayProxy = Object.create(Array.prototype)

// intercept mutation methods
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(watchMutation)

// Augment the ArrayProxy with convenience methods
def(ArrayProxy, '$set', function (index, data) {
    return this.splice(index, 1, data)[0]
}, !hasProto)

def(ArrayProxy, '$remove', function (index) {
    if (typeof index !== 'number') {
        index = this.indexOf(index)
    }
    if (index > -1) {
        return this.splice(index, 1)[0]
    }
}, !hasProto)

/**
 *  Intercep a mutation event so we can emit the mutation info.
 *  we also analyze what elements are added/removed and link/unlink
 *  them with the parent Array.
 */
function watchMutation (method) {
    def(ArrayProxy, method, function () {

        var args = slice.call(arguments),
            result = Array.prototype[method].apply(this, args),
            inserted, removed

        // determine new / removed elements
        if (method === 'push' || method === 'unshift') {
            inserted = args
        } else if (method === 'pop' || method === 'shift') {
            removed = [result]
        } else if (method === 'splice') {
            inserted = args.slice(2)
            removed = result
        }
        
        // link & unlink
        linkArrayElements(this, inserted)
        unlinkArrayElements(this, removed)

        // emit the mutation event
        this.__emitter__.emit('mutate', '', this, {
            method   : method,
            args     : args,
            result   : result,
            inserted : inserted,
            removed  : removed
        })

        return result
        
    }, !hasProto)
}

/**
 *  Link new elements to an Array, so when they change
 *  and emit events, the owner Array can be notified.
 */
function linkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item, owners
        while (i--) {
            item = items[i]
            if (isWatchable(item)) {
                // if object is not converted for observing
                // convert it...
                if (!item.__emitter__) {
                    convert(item)
                    watch(item)
                }
                owners = item.__emitter__.owners
                if (owners.indexOf(arr) < 0) {
                    owners.push(arr)
                }
            }
        }
    }
}

/**
 *  Unlink removed elements from the ex-owner Array.
 */
function unlinkArrayElements (arr, items) {
    if (items) {
        var i = items.length, item
        while (i--) {
            item = items[i]
            if (item && item.__emitter__) {
                var owners = item.__emitter__.owners
                if (owners) owners.splice(owners.indexOf(arr))
            }
        }
    }
}

// Object add/delete key augmentation -----------------------------------------

var ObjProxy = Object.create(Object.prototype)

def(ObjProxy, '$add', function (key, val) {
    if (hasOwn.call(this, key)) return
    this[key] = val
    convertKey(this, key, true)
}, !hasProto)

def(ObjProxy, '$delete', function (key) {
    if (!(hasOwn.call(this, key))) return
    // trigger set events
    this[key] = undefined
    delete this[key]
    this.__emitter__.emit('delete', key)
}, !hasProto)

// Watch Helpers --------------------------------------------------------------

/**
 *  Check if a value is watchable
 */
function isWatchable (obj) {
    return typeof obj === 'object' && obj && !obj.$compiler
}

/**
 *  Convert an Object/Array to give it a change emitter.
 */
function convert (obj) {
    if (obj.__emitter__) return true
    var emitter = new Emitter()
    def(obj, '__emitter__', emitter)
    emitter
        .on('set', function (key, val, propagate) {
            if (propagate) propagateChange(obj)
        })
        .on('mutate', function () {
            propagateChange(obj)
        })
    emitter.values = utils.hash()
    emitter.owners = []
    return false
}

/**
 *  Propagate an array element's change to its owner arrays
 */
function propagateChange (obj) {
    var owners = obj.__emitter__.owners,
        i = owners.length
    while (i--) {
        owners[i].__emitter__.emit('set', '', '', true)
    }
}

/**
 *  Watch target based on its type
 */
function watch (obj) {
    if (isArray(obj)) {
        watchArray(obj)
    } else {
        watchObject(obj)
    }
}

/**
 *  Augment target objects with modified
 *  methods
 */
function augment (target, src) {
    if (hasProto) {
        target.__proto__ = src
    } else {
        for (var key in src) {
            def(target, key, src[key])
        }
    }
}

/**
 *  Watch an Object, recursive.
 */
function watchObject (obj) {
    augment(obj, ObjProxy)
    for (var key in obj) {
        convertKey(obj, key)
    }
}

/**
 *  Watch an Array, overload mutation methods
 *  and add augmentations by intercepting the prototype chain
 */
function watchArray (arr) {
    augment(arr, ArrayProxy)
    linkArrayElements(arr, arr)
}

/**
 *  Define accessors for a property on an Object
 *  so it emits get/set events.
 *  Then watch the value itself.
 */
function convertKey (obj, key, propagate) {
    var keyPrefix = key.charAt(0)
    if (keyPrefix === '$' || keyPrefix === '_') {
        return
    }
    // emit set on bind
    // this means when an object is observed it will emit
    // a first batch of set events.
    var emitter = obj.__emitter__,
        values  = emitter.values

    init(obj[key], propagate)

    oDef(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var value = values[key]
            // only emit get on tip values
            if (pub.shouldGet) {
                emitter.emit('get', key)
            }
            return value
        },
        set: function (newVal) {
            var oldVal = values[key]
            unobserve(oldVal, key, emitter)
            copyPaths(newVal, oldVal)
            // an immediate property should notify its parent
            // to emit set for itself too
            init(newVal, true)
        }
    })

    function init (val, propagate) {
        values[key] = val
        emitter.emit('set', key, val, propagate)
        if (isArray(val)) {
            emitter.emit('set', key + '.length', val.length, propagate)
        }
        observe(val, key, emitter)
    }
}

/**
 *  When a value that is already converted is
 *  observed again by another observer, we can skip
 *  the watch conversion and simply emit set event for
 *  all of its properties.
 */
function emitSet (obj) {
    var emitter = obj && obj.__emitter__
    if (!emitter) return
    if (isArray(obj)) {
        emitter.emit('set', 'length', obj.length)
    } else {
        var key, val
        for (key in obj) {
            val = obj[key]
            emitter.emit('set', key, val)
            emitSet(val)
        }
    }
}

/**
 *  Make sure all the paths in an old object exists
 *  in a new object.
 *  So when an object changes, all missing keys will
 *  emit a set event with undefined value.
 */
function copyPaths (newObj, oldObj) {
    if (!isObject(newObj) || !isObject(oldObj)) {
        return
    }
    var path, oldVal, newVal
    for (path in oldObj) {
        if (!(hasOwn.call(newObj, path))) {
            oldVal = oldObj[path]
            if (isArray(oldVal)) {
                newObj[path] = []
            } else if (isObject(oldVal)) {
                newVal = newObj[path] = {}
                copyPaths(newVal, oldVal)
            } else {
                newObj[path] = undefined
            }
        }
    }
}

/**
 *  walk along a path and make sure it can be accessed
 *  and enumerated in that object
 */
function ensurePath (obj, key) {
    var path = key.split('.'), sec
    for (var i = 0, d = path.length - 1; i < d; i++) {
        sec = path[i]
        if (!obj[sec]) {
            obj[sec] = {}
            if (obj.__emitter__) convertKey(obj, sec)
        }
        obj = obj[sec]
    }
    if (isObject(obj)) {
        sec = path[i]
        if (!(hasOwn.call(obj, sec))) {
            obj[sec] = undefined
            if (obj.__emitter__) convertKey(obj, sec)
        }
    }
}

// Main API Methods -----------------------------------------------------------

/**
 *  Observe an object with a given path,
 *  and proxy get/set/mutate events to the provided observer.
 */
function observe (obj, rawPath, observer) {

    if (!isWatchable(obj)) return

    var path = rawPath ? rawPath + '.' : '',
        alreadyConverted = convert(obj),
        emitter = obj.__emitter__

    // setup proxy listeners on the parent observer.
    // we need to keep reference to them so that they
    // can be removed when the object is un-observed.
    observer.proxies = observer.proxies || {}
    var proxies = observer.proxies[path] = {
        get: function (key) {
            observer.emit('get', path + key)
        },
        set: function (key, val, propagate) {
            if (key) observer.emit('set', path + key, val)
            // also notify observer that the object itself changed
            // but only do so when it's a immediate property. this
            // avoids duplicate event firing.
            if (rawPath && propagate) {
                observer.emit('set', rawPath, obj, true)
            }
        },
        mutate: function (key, val, mutation) {
            // if the Array is a root value
            // the key will be null
            var fixedPath = key ? path + key : rawPath
            observer.emit('mutate', fixedPath, val, mutation)
            // also emit set for Array's length when it mutates
            var m = mutation.method
            if (m !== 'sort' && m !== 'reverse') {
                observer.emit('set', fixedPath + '.length', val.length)
            }
        }
    }

    // attach the listeners to the child observer.
    // now all the events will propagate upwards.
    emitter
        .on('get', proxies.get)
        .on('set', proxies.set)
        .on('mutate', proxies.mutate)

    if (alreadyConverted) {
        // for objects that have already been converted,
        // emit set events for everything inside
        emitSet(obj)
    } else {
        watch(obj)
    }
}

/**
 *  Cancel observation, turn off the listeners.
 */
function unobserve (obj, path, observer) {

    if (!obj || !obj.__emitter__) return

    path = path ? path + '.' : ''
    var proxies = observer.proxies[path]
    if (!proxies) return

    // turn off listeners
    obj.__emitter__
        .off('get', proxies.get)
        .off('set', proxies.set)
        .off('mutate', proxies.mutate)

    // remove reference
    observer.proxies[path] = null
}

// Expose API -----------------------------------------------------------------

var pub = module.exports = {

    // whether to emit get events
    // only enabled during dependency parsing
    shouldGet   : false,

    observe     : observe,
    unobserve   : unobserve,
    ensurePath  : ensurePath,
    copyPaths   : copyPaths,
    watch       : watch,
    convert     : convert,
    convertKey  : convertKey
}
},{"./emitter":"/Users/suisho/github/vue-halite/node_modules/vue/src/emitter.js","./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/template-parser.js":[function(require,module,exports){
var toFragment = require('./fragment');

/**
 * Parses a template string or node and normalizes it into a
 * a node that can be used as a partial of a template option
 *
 * Possible values include
 * id selector: '#some-template-id'
 * template string: '<div><span>my template</span></div>'
 * DocumentFragment object
 * Node object of type Template
 */
module.exports = function(template) {
    var templateNode;

    if (template instanceof window.DocumentFragment) {
        // if the template is already a document fragment -- do nothing
        return template
    }

    if (typeof template === 'string') {
        // template by ID
        if (template.charAt(0) === '#') {
            templateNode = document.getElementById(template.slice(1))
            if (!templateNode) return
        } else {
            return toFragment(template)
        }
    } else if (template.nodeType) {
        templateNode = template
    } else {
        return
    }

    // if its a template tag and the browser supports it,
    // its content is already a document fragment!
    if (templateNode.tagName === 'TEMPLATE' && templateNode.content) {
        return templateNode.content
    }

    if (templateNode.tagName === 'SCRIPT') {
        return toFragment(templateNode.innerHTML)
    }

    return toFragment(templateNode.outerHTML);
}

},{"./fragment":"/Users/suisho/github/vue-halite/node_modules/vue/src/fragment.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/text-parser.js":[function(require,module,exports){
var openChar        = '{',
    endChar         = '}',
    ESCAPE_RE       = /[-.*+?^${}()|[\]\/\\]/g,
    // lazy require
    Directive

exports.Regex = buildInterpolationRegex()

function buildInterpolationRegex () {
    var open = escapeRegex(openChar),
        end  = escapeRegex(endChar)
    return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end)
}

function escapeRegex (str) {
    return str.replace(ESCAPE_RE, '\\$&')
}

function setDelimiters (delimiters) {
    openChar = delimiters[0]
    endChar = delimiters[1]
    exports.delimiters = delimiters
    exports.Regex = buildInterpolationRegex()
}

/** 
 *  Parse a piece of text, return an array of tokens
 *  token types:
 *  1. plain string
 *  2. object with key = binding key
 *  3. object with key & html = true
 */
function parse (text) {
    if (!exports.Regex.test(text)) return null
    var m, i, token, match, tokens = []
    /* jshint boss: true */
    while (m = text.match(exports.Regex)) {
        i = m.index
        if (i > 0) tokens.push(text.slice(0, i))
        token = { key: m[1].trim() }
        match = m[0]
        token.html =
            match.charAt(2) === openChar &&
            match.charAt(match.length - 3) === endChar
        tokens.push(token)
        text = text.slice(i + m[0].length)
    }
    if (text.length) tokens.push(text)
    return tokens
}

/**
 *  Parse an attribute value with possible interpolation tags
 *  return a Directive-friendly expression
 *
 *  e.g.  a {{b}} c  =>  "a " + b + " c"
 */
function parseAttr (attr) {
    Directive = Directive || require('./directive')
    var tokens = parse(attr)
    if (!tokens) return null
    if (tokens.length === 1) return tokens[0].key
    var res = [], token
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i]
        res.push(
            token.key
                ? inlineFilters(token.key)
                : ('"' + token + '"')
        )
    }
    return res.join('+')
}

/**
 *  Inlines any possible filters in a binding
 *  so that we can combine everything into a huge expression
 */
function inlineFilters (key) {
    if (key.indexOf('|') > -1) {
        var dirs = Directive.parse(key),
            dir = dirs && dirs[0]
        if (dir && dir.filters) {
            key = Directive.inlineFilters(
                dir.key,
                dir.filters
            )
        }
    }
    return '(' + key + ')'
}

exports.parse         = parse
exports.parseAttr     = parseAttr
exports.setDelimiters = setDelimiters
exports.delimiters    = [openChar, endChar]
},{"./directive":"/Users/suisho/github/vue-halite/node_modules/vue/src/directive.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/transition.js":[function(require,module,exports){
var endEvents  = sniffEndEvents(),
    config     = require('./config'),
    // batch enter animations so we only force the layout once
    Batcher    = require('./batcher'),
    batcher    = new Batcher(),
    // cache timer functions
    setTO      = window.setTimeout,
    clearTO    = window.clearTimeout,
    // exit codes for testing
    codes = {
        CSS_E     : 1,
        CSS_L     : 2,
        JS_E      : 3,
        JS_L      : 4,
        CSS_SKIP  : -1,
        JS_SKIP   : -2,
        JS_SKIP_E : -3,
        JS_SKIP_L : -4,
        INIT      : -5,
        SKIP      : -6
    }

// force layout before triggering transitions/animations
batcher._preFlush = function () {
    /* jshint unused: false */
    var f = document.body.offsetHeight
}

/**
 *  stage:
 *    1 = enter
 *    2 = leave
 */
var transition = module.exports = function (el, stage, cb, compiler) {

    var changeState = function () {
        cb()
        compiler.execHook(stage > 0 ? 'attached' : 'detached')
    }

    if (compiler.init) {
        changeState()
        return codes.INIT
    }

    var hasTransition = el.vue_trans === '',
        hasAnimation  = el.vue_anim === '',
        effectId      = el.vue_effect

    if (effectId) {
        return applyTransitionFunctions(
            el,
            stage,
            changeState,
            effectId,
            compiler
        )
    } else if (hasTransition || hasAnimation) {
        return applyTransitionClass(
            el,
            stage,
            changeState,
            hasAnimation
        )
    } else {
        changeState()
        return codes.SKIP
    }

}

/**
 *  Togggle a CSS class to trigger transition
 */
function applyTransitionClass (el, stage, changeState, hasAnimation) {

    if (!endEvents.trans) {
        changeState()
        return codes.CSS_SKIP
    }

    // if the browser supports transition,
    // it must have classList...
    var onEnd,
        classList        = el.classList,
        existingCallback = el.vue_trans_cb,
        enterClass       = config.enterClass,
        leaveClass       = config.leaveClass,
        endEvent         = hasAnimation ? endEvents.anim : endEvents.trans

    // cancel unfinished callbacks and jobs
    if (existingCallback) {
        el.removeEventListener(endEvent, existingCallback)
        classList.remove(enterClass)
        classList.remove(leaveClass)
        el.vue_trans_cb = null
    }

    if (stage > 0) { // enter

        // set to enter state before appending
        classList.add(enterClass)
        // append
        changeState()
        // trigger transition
        if (!hasAnimation) {
            batcher.push({
                execute: function () {
                    classList.remove(enterClass)
                }
            })
        } else {
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    classList.remove(enterClass)
                }
            }
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        }
        return codes.CSS_E

    } else { // leave

        if (el.offsetWidth || el.offsetHeight) {
            // trigger hide transition
            classList.add(leaveClass)
            onEnd = function (e) {
                if (e.target === el) {
                    el.removeEventListener(endEvent, onEnd)
                    el.vue_trans_cb = null
                    // actually remove node here
                    changeState()
                    classList.remove(leaveClass)
                }
            }
            // attach transition end listener
            el.addEventListener(endEvent, onEnd)
            el.vue_trans_cb = onEnd
        } else {
            // directly remove invisible elements
            changeState()
        }
        return codes.CSS_L
        
    }

}

function applyTransitionFunctions (el, stage, changeState, effectId, compiler) {

    var funcs = compiler.getOption('effects', effectId)
    if (!funcs) {
        changeState()
        return codes.JS_SKIP
    }

    var enter = funcs.enter,
        leave = funcs.leave,
        timeouts = el.vue_timeouts

    // clear previous timeouts
    if (timeouts) {
        var i = timeouts.length
        while (i--) {
            clearTO(timeouts[i])
        }
    }

    timeouts = el.vue_timeouts = []
    function timeout (cb, delay) {
        var id = setTO(function () {
            cb()
            timeouts.splice(timeouts.indexOf(id), 1)
            if (!timeouts.length) {
                el.vue_timeouts = null
            }
        }, delay)
        timeouts.push(id)
    }

    if (stage > 0) { // enter
        if (typeof enter !== 'function') {
            changeState()
            return codes.JS_SKIP_E
        }
        enter(el, changeState, timeout)
        return codes.JS_E
    } else { // leave
        if (typeof leave !== 'function') {
            changeState()
            return codes.JS_SKIP_L
        }
        leave(el, changeState, timeout)
        return codes.JS_L
    }

}

/**
 *  Sniff proper transition end event name
 */
function sniffEndEvents () {
    var el = document.createElement('vue'),
        defaultEvent = 'transitionend',
        events = {
            'webkitTransition' : 'webkitTransitionEnd',
            'transition'       : defaultEvent,
            'mozTransition'    : defaultEvent
        },
        ret = {}
    for (var name in events) {
        if (el.style[name] !== undefined) {
            ret.trans = events[name]
            break
        }
    }
    ret.anim = el.style.animation === ''
        ? 'animationend'
        : 'webkitAnimationEnd'
    return ret
}

// Expose some stuff for testing purposes
transition.codes = codes
transition.sniff = sniffEndEvents
},{"./batcher":"/Users/suisho/github/vue-halite/node_modules/vue/src/batcher.js","./config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js":[function(require,module,exports){
var config       = require('./config'),
    toString     = ({}).toString,
    win          = window,
    console      = win.console,
    def          = Object.defineProperty,
    OBJECT       = 'object',
    THIS_RE      = /[^\w]this[^\w]/,
    BRACKET_RE_S = /\['([^']+)'\]/g,
    BRACKET_RE_D = /\["([^"]+)"\]/g,
    hasClassList = 'classList' in document.documentElement,
    ViewModel // late def

var defer =
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.setTimeout

/**
 *  Normalize keypath with possible brackets into dot notations
 */
function normalizeKeypath (key) {
    return key.indexOf('[') < 0
        ? key
        : key.replace(BRACKET_RE_S, '.$1')
             .replace(BRACKET_RE_D, '.$1')
}

var utils = module.exports = {

    /**
     *  Convert a string template to a dom fragment
     */
    toFragment: require('./fragment'),

    /**
     *  Parse the various types of template options
     */
    parseTemplateOption: require('./template-parser.js'),

    /**
     *  get a value from an object keypath
     */
    get: function (obj, key) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            return obj[key]
        }
        var path = key.split('.'),
            d = -1, l = path.length
        while (++d < l && obj != null) {
            obj = obj[path[d]]
        }
        return obj
    },

    /**
     *  set a value to an object keypath
     */
    set: function (obj, key, val) {
        /* jshint eqeqeq: false */
        key = normalizeKeypath(key)
        if (key.indexOf('.') < 0) {
            obj[key] = val
            return
        }
        var path = key.split('.'),
            d = -1, l = path.length - 1
        while (++d < l) {
            if (obj[path[d]] == null) {
                obj[path[d]] = {}
            }
            obj = obj[path[d]]
        }
        obj[path[d]] = val
    },

    /**
     *  return the base segment of a keypath
     */
    baseKey: function (key) {
        return key.indexOf('.') > 0
            ? key.split('.')[0]
            : key
    },

    /**
     *  Create a prototype-less object
     *  which is a better hash/map
     */
    hash: function () {
        return Object.create(null)
    },

    /**
     *  get an attribute and remove it.
     */
    attr: function (el, type) {
        var attr = config.prefix + '-' + type,
            val = el.getAttribute(attr)
        if (val !== null) {
            el.removeAttribute(attr)
        }
        return val
    },

    /**
     *  Define an ienumerable property
     *  This avoids it being included in JSON.stringify
     *  or for...in loops.
     */
    defProtected: function (obj, key, val, enumerable, writable) {
        def(obj, key, {
            value        : val,
            enumerable   : enumerable,
            writable     : writable,
            configurable : true
        })
    },

    /**
     *  A less bullet-proof but more efficient type check
     *  than Object.prototype.toString
     */
    isObject: function (obj) {
        return typeof obj === OBJECT && obj && !Array.isArray(obj)
    },

    /**
     *  A more accurate but less efficient type check
     */
    isTrueObject: function (obj) {
        return toString.call(obj) === '[object Object]'
    },

    /**
     *  Most simple bind
     *  enough for the usecase and fast than native bind()
     */
    bind: function (fn, ctx) {
        return function (arg) {
            return fn.call(ctx, arg)
        }
    },

    /**
     *  Make sure null and undefined output empty string
     */
    guard: function (value) {
        /* jshint eqeqeq: false, eqnull: true */
        return value == null
            ? ''
            : (typeof value == 'object')
                ? JSON.stringify(value)
                : value
    },

    /**
     *  When setting value on the VM, parse possible numbers
     */
    checkNumber: function (value) {
        return (isNaN(value) || value === null || typeof value === 'boolean')
            ? value
            : Number(value)
    },

    /**
     *  simple extend
     */
    extend: function (obj, ext) {
        for (var key in ext) {
            if (obj[key] !== ext[key]) {
                obj[key] = ext[key]
            }
        }
        return obj
    },

    /**
     *  filter an array with duplicates into uniques
     */
    unique: function (arr) {
        var hash = utils.hash(),
            i = arr.length,
            key, res = []
        while (i--) {
            key = arr[i]
            if (hash[key]) continue
            hash[key] = 1
            res.push(key)
        }
        return res
    },

    /**
     *  Convert the object to a ViewModel constructor
     *  if it is not already one
     */
    toConstructor: function (obj) {
        ViewModel = ViewModel || require('./viewmodel')
        return utils.isObject(obj)
            ? ViewModel.extend(obj)
            : typeof obj === 'function'
                ? obj
                : null
    },

    /**
     *  Check if a filter function contains references to `this`
     *  If yes, mark it as a computed filter.
     */
    checkFilter: function (filter) {
        if (THIS_RE.test(filter.toString())) {
            filter.computed = true
        }
    },

    /**
     *  convert certain option values to the desired format.
     */
    processOptions: function (options) {
        var components = options.components,
            partials   = options.partials,
            template   = options.template,
            filters    = options.filters,
            key
        if (components) {
            for (key in components) {
                components[key] = utils.toConstructor(components[key])
            }
        }
        if (partials) {
            for (key in partials) {
                partials[key] = utils.parseTemplateOption(partials[key])
            }
        }
        if (filters) {
            for (key in filters) {
                utils.checkFilter(filters[key])
            }
        }
        if (template) {
            options.template = utils.parseTemplateOption(template)
        }
    },

    /**
     *  used to defer batch updates
     */
    nextTick: function (cb) {
        defer(cb, 0)
    },

    /**
     *  add class for IE9
     *  uses classList if available
     */
    addClass: function (el, cls) {
        if (hasClassList) {
            el.classList.add(cls)
        } else {
            var cur = ' ' + el.className + ' '
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.className = (cur + cls).trim()
            }
        }
    },

    /**
     *  remove class for IE9
     */
    removeClass: function (el, cls) {
        if (hasClassList) {
            el.classList.remove(cls)
        } else {
            var cur = ' ' + el.className + ' ',
                tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }
            el.className = cur.trim()
        }
    },

    /**
     *  Convert an object to Array
     *  used in v-repeat and array filters
     */
    objectToArray: function (obj) {
        var res = [], val, data
        for (var key in obj) {
            val = obj[key]
            data = utils.isObject(val)
                ? val
                : { $value: val }
            data.$key = key
            res.push(data)
        }
        return res
    }
}

enableDebug()
function enableDebug () {
    /**
     *  log for debugging
     */
    utils.log = function (msg) {
        if (config.debug && console) {
            console.log(msg)
        }
    }
    
    /**
     *  warnings, traces by default
     *  can be suppressed by `silent` option.
     */
    utils.warn = function (msg) {
        if (!config.silent && console) {
            console.warn(msg)
            if (config.debug && console.trace) {
                console.trace()
            }
        }
    }
}
},{"./config":"/Users/suisho/github/vue-halite/node_modules/vue/src/config.js","./fragment":"/Users/suisho/github/vue-halite/node_modules/vue/src/fragment.js","./template-parser.js":"/Users/suisho/github/vue-halite/node_modules/vue/src/template-parser.js","./viewmodel":"/Users/suisho/github/vue-halite/node_modules/vue/src/viewmodel.js"}],"/Users/suisho/github/vue-halite/node_modules/vue/src/viewmodel.js":[function(require,module,exports){
var Compiler   = require('./compiler'),
    utils      = require('./utils'),
    transition = require('./transition'),
    Batcher    = require('./batcher'),
    slice      = [].slice,
    def        = utils.defProtected,
    nextTick   = utils.nextTick,

    // batch $watch callbacks
    watcherBatcher = new Batcher(),
    watcherId      = 1

/**
 *  ViewModel exposed to the user that holds data,
 *  computed properties, event handlers
 *  and a few reserved methods
 */
function ViewModel (options) {
    // compile if options passed, if false return. options are passed directly to compiler
    if (options === false) return
    new Compiler(this, options)
}

// All VM prototype methods are inenumerable
// so it can be stringified/looped through as raw data
var VMProto = ViewModel.prototype

/**
 *  init allows config compilation after instantiation:
 *    var a = new Vue(false)
 *    a.init(config)
 */
def(VMProto, '$init', function (options) {
    new Compiler(this, options)
})

/**
 *  Convenience function to get a value from
 *  a keypath
 */
def(VMProto, '$get', function (key) {
    var val = utils.get(this, key)
    return val === undefined && this.$parent
        ? this.$parent.$get(key)
        : val
})

/**
 *  Convenience function to set an actual nested value
 *  from a flat key string. Used in directives.
 */
def(VMProto, '$set', function (key, value) {
    utils.set(this, key, value)
})

/**
 *  watch a key on the viewmodel for changes
 *  fire callback with new value
 */
def(VMProto, '$watch', function (key, callback) {
    // save a unique id for each watcher
    var id = watcherId++,
        self = this
    function on () {
        var args = slice.call(arguments)
        watcherBatcher.push({
            id: id,
            override: true,
            execute: function () {
                callback.apply(self, args)
            }
        })
    }
    callback._fn = on
    self.$compiler.observer.on('change:' + key, on)
})

/**
 *  unwatch a key
 */
def(VMProto, '$unwatch', function (key, callback) {
    // workaround here
    // since the emitter module checks callback existence
    // by checking the length of arguments
    var args = ['change:' + key],
        ob = this.$compiler.observer
    if (callback) args.push(callback._fn)
    ob.off.apply(ob, args)
})

/**
 *  unbind everything, remove everything
 */
def(VMProto, '$destroy', function (noRemove) {
    this.$compiler.destroy(noRemove)
})

/**
 *  broadcast an event to all child VMs recursively.
 */
def(VMProto, '$broadcast', function () {
    var children = this.$compiler.children,
        i = children.length,
        child
    while (i--) {
        child = children[i]
        child.emitter.applyEmit.apply(child.emitter, arguments)
        child.vm.$broadcast.apply(child.vm, arguments)
    }
})

/**
 *  emit an event that propagates all the way up to parent VMs.
 */
def(VMProto, '$dispatch', function () {
    var compiler = this.$compiler,
        emitter = compiler.emitter,
        parent = compiler.parent
    emitter.applyEmit.apply(emitter, arguments)
    if (parent) {
        parent.vm.$dispatch.apply(parent.vm, arguments)
    }
})

/**
 *  delegate on/off/once to the compiler's emitter
 */
;['emit', 'on', 'off', 'once'].forEach(function (method) {
    // internal emit has fixed number of arguments.
    // exposed emit uses the external version
    // with fn.apply.
    var realMethod = method === 'emit'
        ? 'applyEmit'
        : method
    def(VMProto, '$' + method, function () {
        var emitter = this.$compiler.emitter
        emitter[realMethod].apply(emitter, arguments)
    })
})

// DOM convenience methods

def(VMProto, '$appendTo', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.appendChild(el)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$remove', function (cb) {
    var el = this.$el
    transition(el, -1, function () {
        if (el.parentNode) {
            el.parentNode.removeChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$before', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        target.parentNode.insertBefore(el, target)
        if (cb) nextTick(cb)
    }, this.$compiler)
})

def(VMProto, '$after', function (target, cb) {
    target = query(target)
    var el = this.$el
    transition(el, 1, function () {
        if (target.nextSibling) {
            target.parentNode.insertBefore(el, target.nextSibling)
        } else {
            target.parentNode.appendChild(el)
        }
        if (cb) nextTick(cb)
    }, this.$compiler)
})

function query (el) {
    return typeof el === 'string'
        ? document.querySelector(el)
        : el
}

module.exports = ViewModel

},{"./batcher":"/Users/suisho/github/vue-halite/node_modules/vue/src/batcher.js","./compiler":"/Users/suisho/github/vue-halite/node_modules/vue/src/compiler.js","./transition":"/Users/suisho/github/vue-halite/node_modules/vue/src/transition.js","./utils":"/Users/suisho/github/vue-halite/node_modules/vue/src/utils.js"}]},{},["/Users/suisho/github/vue-halite/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL2luZGV4LmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9saWIvZHVtbXkuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL2xpYi9wb2ludHMuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL2xpYi9yYW5kLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvZXh0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvb25lY29sb3Ivb25lLWNvbG9yLWFsbC1kZWJ1Zy5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmluZGluZy5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGVwcy1wYXJzZXIuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZS5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2lmLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2luZGV4LmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL29uLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3BhcnRpYWwuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3N0eWxlLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3ZpZXcuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZW1pdHRlci5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZXhwLXBhcnNlci5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZnJhZ21lbnQuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL21haW4uanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90ZW1wbGF0ZS1wYXJzZXIuanMiLCIvVXNlcnMvc3Vpc2hvL2dpdGh1Yi92dWUtaGFsaXRlL25vZGVfbW9kdWxlcy92dWUvc3JjL3RleHQtcGFyc2VyLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uLmpzIiwiL1VzZXJzL3N1aXNoby9naXRodWIvdnVlLWhhbGl0ZS9ub2RlX21vZHVsZXMvdnVlL3NyYy91dGlscy5qcyIsIi9Vc2Vycy9zdWlzaG8vZ2l0aHViL3Z1ZS1oYWxpdGUvbm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdmlld21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVnVlID0gcmVxdWlyZSgndnVlJylcbnZhciBvbmVDb2xvciA9IHJlcXVpcmUoXCJvbmVjb2xvclwiKVxudmFyIGNhbGNQb2ludHMgPSByZXF1aXJlKFwiLi9saWIvcG9pbnRzXCIpXG52YXIgZ2VuZXJhdGVSYW5kb21TdGF0ID0gcmVxdWlyZShcIi4vbGliL2R1bW15XCIpXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcImV4dGVuZFwiKVxuVnVlLmNvbXBvbmVudCgndHJpYW5nbGUnLCB7XG4gIGRhdGEgOiB7XG4gICAgeiA6IHRydWVcbiAgfSxcbiAgY29tcHV0ZWQgOiB7XG4gICAgc3R5bGUgOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIFwiZmlsbDpcIiArIHRoaXMuY29sb3JcbiAgICB9LFxuICAgIGZyYW1lU3R5bGUgOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIFwiZmlsbDp0cmFuc3BhcmVudDsgc3Ryb2tlOndoaXRlXCJcbiAgICB9LFxuICAgIGNvbG9yIDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBvbmVDb2xvcih0aGlzLmJhc2VDb2xvcikuc2F0dXJhdGlvbih0aGlzLnNhdCkuaGV4KClcbiAgICB9LFxuICAgIHBvaW50cyA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy50cmlhbmdsZS5tYXAoZnVuY3Rpb24ocG9pbnQsaSl7XG4gICAgICAgIHJldHVybiBwb2ludC54ICsgJywnICsgcG9pbnQueVxuICAgICAgfSkuam9pbignICcpXG4gICAgfSxcbiAgICBkIDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciB6ID0gdGhpcy56ID8gXCJ6XCIgOiBcIlwiXG4gICAgICByZXR1cm4gXCJNXCIrdGhpcy5wb2ludHMgKyB6XG4gICAgfVxuICB9XG59KVxuXG4vLyBBIHJlc3VzYWJsZSBwb2x5Z29uIGdyYXBoIGNvbXBvbmVudFxuVnVlLmNvbXBvbmVudCgncG9seWdyYXBoJywge1xuICB0ZW1wbGF0ZTogJyNwb2x5Z3JhcGgtdGVtcGxhdGUnLFxuICByZXBsYWNlOiB0cnVlLFxuICBkYXRhIDoge1xuICAgIGZyYW1lQ291bnQgOiAxXG4gIH0sXG4gIHJlYWR5OiBmdW5jdGlvbigpe1xuICAgIHRoaXMuYW5pbWF0aW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKVxuICAgIHRoaXMuYW5pbWF0ZSgpXG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgc3R5bGUgOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIFwiZmlsbDpcIiArIHRoaXMuY29sb3JcbiAgICB9LFxuICAgIHZTdGF0cyA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0cy5tYXAoZnVuY3Rpb24oc3Qpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxlbmd0aDogc3QubGVuZ3RoIC0gMTYsXG4gICAgICAgICAgYW5nbGU6ICBzdC5hbmdsZSxcbiAgICAgICAgICBzYXQ6ICAgIHN0LnNhdCwgXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBwb2ludHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjYWxjUG9pbnRzKHRoaXMudlN0YXRzKVxuICAgIH0sXG4gICAgYmFzZVBvaW50cyA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludHMubWFwKGZ1bmN0aW9uKHN0YXQpe1xuICAgICAgICByZXR1cm4gc3RhdC54ICsgXCIsXCIgKyBzdGF0LnlcbiAgICAgIH0pLmpvaW4oXCIgXCIpXG4gICAgfSxcbiAgICBmcmFtZVRyaWFuZ2xlcyA6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgcHRzID0gY2FsY1BvaW50cyh0aGlzLnN0YXRzKVxuICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVUcmlhbmdsZXModGhpcy50cmlhbmdsZVBvaW50cyhwdHMpLCB0aGlzLnN0YXRzLCB7XG4gICAgICAgIHogOiBmYWxzZVxuICAgICAgfSlcbiAgICB9LFxuICAgIHRyaWFuZ2xlcyA6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZVRyaWFuZ2xlcyh0aGlzLnRyaWFuZ2xlUG9pbnRzKHRoaXMucG9pbnRzKSwgdGhpcy52U3RhdHMpXG4gICAgfSxcbiAgfSxcbiAgbWV0aG9kcyA6IHtcbiAgICBnZW5lcmF0ZVRyaWFuZ2xlcyA6IGZ1bmN0aW9uKHRyaSwgc3RhdHMsIG9wdCApe1xuICAgICAgdmFyIGNsciA9IHRoaXMuY29sb3JcbiAgICAgIHJldHVybiBzdGF0cy5tYXAoZnVuY3Rpb24oc3QsIGkpe1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHtcbiAgICAgICAgICBiYXNlQ29sb3I6IGNscixcbiAgICAgICAgICBzYXQgOiBzdC5zYXQvMTAwLFxuICAgICAgICAgIHRyaWFuZ2xlIDogdHJpW2ldXG4gICAgICAgIH0sIG9wdClcbiAgICAgIH0pXG4gICAgfSxcbiAgICB0cmlhbmdsZVBvaW50cyA6IGZ1bmN0aW9uKHBvaW50cyl7XG4gICAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbihwb2ludCwgaSwgcG9pbnRzKXtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7eDowLCB5OjB9LFxuICAgICAgICAgIHBvaW50c1tpXSxcbiAgICAgICAgICBwb2ludHNbKGkgKyAxKSAlIHBvaW50cy5sZW5ndGhdXG4gICAgICAgIF1cbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5lcmF0ZUFuaW1hdGVJbmNyZW1lbnQgOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVuZ3RoIDogTWF0aC5yYW5kb20oKSAqIDEwIC0gNSxcbiAgICAgICAgYW5nbGUgOiBNYXRoLnJhbmRvbSgpICogMTAgLSA1LFxuICAgICAgICBzYXQgICA6IE1hdGgucmFuZG9tKCkgKiAxMCAtIDUsXG4gICAgICB9XG4gICAgXG4gICAgfSxcbiAgICBhbmltYXRlIDpmdW5jdGlvbih0aW1lKXtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdmFyIGZyYW1lU3RlcCA9IDUwXG4gICAgICBpZigodGhpcy5mcmFtZUNvdW50ICUgZnJhbWVTdGVwKSA9PSAxKXtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnRhdGlvblNldCA9IGdlbmVyYXRlQW5pbWF0ZUluY3JlbWVudFxuICAgICAgfSAgICAgIFxuICAgICAgXG4gICAgICB0aGlzLnN0YXRzLmZvckVhY2goZnVuY3Rpb24oc3Qpe1xuICAgICAgICBzdC5sZW5ndGggKz0gc2VsZi5pbmNyZW1lbnRhdGlvblNldC5sZW5ndGggLyBmcmFtZVN0ZXBcbiAgICAgICAgc3QuYW5nbGUgKz0gIHNlbGYuaW5jcmVtZW50YXRpb25TZXQuYW5nbGUgLyBmcmFtZVN0ZXBcbiAgICAgICAgc3Quc2F0ICs9ICAgIHNlbGYuaW5jcmVtZW50YXRpb25TZXQuc2F0IC8gZnJhbWVTdGVwXG4gICAgICB9KVxuICAgICAgdGhpcy5mcmFtZUNvdW50KytcbiAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgc2VsZi5hbmltYXRlKGUpXG4gICAgICB9KVxuICAgIH0sXG4gICAgXG4gIH0sXG59KVxuXG4vLyBib290c3RyYXAgdGhlIGRlbW9cbnZhciBhcHAgPSBuZXcgVnVlKHtcbiAgZWw6ICcjZGVtbycsXG4gIHJlcGxhY2U6dHJ1ZSxcbiAgZGF0YToge1xuICAgIG5ld0xhYmVsOiAnJyxcbiAgICBzdGF0czogZ2VuZXJhdGVSYW5kb21TdGF0KCksXG4gICAgY29sb3IgOiBcIiM4ZWQ3ZjFcIlxuICB9XG59KVxuXG4iLCJ2YXIgZ2F1Y2lhblJhbmRvbSA9IHJlcXVpcmUoXCIuL3JhbmRcIilcblxudmFyIGRlZmF1bHRTdGF0ID0gZnVuY3Rpb24oKXtcbiAgdmFyIHN0YXQgPSAgeyBcbiAgICBsZW5ndGg6IGdhdWNpYW5SYW5kb20oNTAsMjApLFxuICAgIGFuZ2xlOiAgTWF0aC5yYW5kb20oKSwgLy9nYXVjaWFuUmFuZG9tKDUwLDEwKSxcbiAgICBzYXQ6ICAgIGdhdWNpYW5SYW5kb20oNTAsMzUpXG4gIH1cbiAgcmV0dXJuIHN0YXRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgc3RhdHMgPSBbXVxuICBmb3IodmFyIGk9MDsgaSA8IDg7IGkrKyl7XG4gICAgc3RhdHMucHVzaCggZGVmYXVsdFN0YXQoKSlcbiAgfVxuICBzdGF0cyA9IHN0YXRzLnNvcnQoZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIGEuc2F0ID4gYi5zYXRcbiAgfSlcblxuICB2YXIgc29ydGVkU3RhdCA9IFtdXG4gIGZvcih2YXIgaT0wOyBpIDwgODsgaSsrKXtcbiAgICAvL3ZhciBqID0gKGkgKiAzKSAlIDggXG4gICAgdmFyIGogPSAoaSAqIDMpICUgOCBcbiAgICBzb3J0ZWRTdGF0LnB1c2goc3RhdHNbal0pXG4gIH1cbiAgcmV0dXJuIHNvcnRlZFN0YXRcbn1cbiIsIi8vIG1hdGggaGVscGVyLi4uXG52YXIgYW5nbGVUb1BvaW50ID0gZnVuY3Rpb24obGVuZ3RoLCBhbmdsZSl7XG4gIHJldHVybiB7XG4gICAgeDogbGVuZ3RoICogTWF0aC5jb3MoYW5nbGUpLFxuICAgIHk6IGxlbmd0aCAqIE1hdGguc2luKGFuZ2xlKVxuICB9XG59XG5cbnZhciB0b1BvaW50ID0gZnVuY3Rpb24oc3RhdHMsIHNjYWxlKXtcbiAgdmFyIHJhZCA9IE1hdGguUEkgKiAyIC8gc3RhdHMubGVuZ3RoXG4gIHNjYWxlID0gKHNjYWxlICE9PSB1bmRlZmluZWQpID8gc2NhbGUgOiAxXG4gIFxuICByZXR1cm4gc3RhdHMubWFwKGZ1bmN0aW9uIChzdGF0LCBpKSB7XG4gICAgdmFyIGFuZ2xlID0gcmFkICogKGkgKyBzdGF0LmFuZ2xlLzEwMClcbiAgICBcbiAgICB2YXIgcG9pbnQgPSBhbmdsZVRvUG9pbnQoc3RhdC5sZW5ndGgsIGFuZ2xlLCBzY2FsZSlcbiAgICByZXR1cm4gcG9pbnRcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1BvaW50IiwiZnVuY3Rpb24gX2dhdWNpYW5SYW5kb20obSwgcykge1xuICAvL3JldHVybiBNYXRoLnJhbmRvbSgpIFxuICB2YXIgdSA9IDEgLSBNYXRoLnJhbmRvbSgpXG4gIHZhciB2ID0gMSAtIE1hdGgucmFuZG9tKClcbiAgXG4gIHZhciByYW5kMSA9ICBNYXRoLnNxcnQoLTIqTWF0aC5sb2codSkpICogTWF0aC5jb3MoMipNYXRoLlBJKnYpXG4gIHZhciByYW5kMiA9ICBNYXRoLnNxcnQoLTIqTWF0aC5sb2codSkpICogTWF0aC5zaW4oMipNYXRoLlBJKnYpXG4gIHJldHVybiAgTWF0aC5tYXgoTWF0aC5jZWlsKHJhbmQxKSkgXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2F1Y2lhblJhbmRvbShtLHMpe1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIDcwICsgMzBcbiAgdmFyIHZhbCA9IDBcbiAgLypkb3tcbiAgICB2YWwgPSBfZ2F1Y2lhblJhbmRvbSgpICogcyArIG1cbiAgICAvL2NvbnNvbGUubG9nKHZhbClcbiAgfXdoaWxlKCB2YWwgPCAwIHx8IDEwMCA8IHZhbCApKi9cbiAgcmV0dXJuIHZhbFxufSIsInZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB1bmRlZmluZWQ7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdGlmICghb2JqIHx8IHRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScgfHwgb2JqLm5vZGVUeXBlIHx8IG9iai5zZXRJbnRlcnZhbCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBoYXNfb3duX2NvbnN0cnVjdG9yID0gaGFzT3duLmNhbGwob2JqLCAnY29uc3RydWN0b3InKTtcblx0dmFyIGhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCAnaXNQcm90b3R5cGVPZicpO1xuXHQvLyBOb3Qgb3duIGNvbnN0cnVjdG9yIHByb3BlcnR5IG11c3QgYmUgT2JqZWN0XG5cdGlmIChvYmouY29uc3RydWN0b3IgJiYgIWhhc19vd25fY29uc3RydWN0b3IgJiYgIWhhc19pc19wcm9wZXJ0eV9vZl9tZXRob2QpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcblx0Ly8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIG9iaikge31cblxuXHRyZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBleHRlbmQoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsXG5cdFx0dGFyZ2V0ID0gYXJndW1lbnRzWzBdLFxuXHRcdGkgPSAxLFxuXHRcdGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXG5cdFx0ZGVlcCA9IGZhbHNlO1xuXG5cdC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHRhcmdldCAhPT0gXCJmdW5jdGlvblwiIHx8IHRhcmdldCA9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRhcmdldCA9IHt9O1xuXHR9XG5cblx0Zm9yICg7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAoKG9wdGlvbnMgPSBhcmd1bWVudHNbaV0pICE9IG51bGwpIHtcblx0XHRcdC8vIEV4dGVuZCB0aGUgYmFzZSBvYmplY3Rcblx0XHRcdGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFtuYW1lXTtcblx0XHRcdFx0Y29weSA9IG9wdGlvbnNbbmFtZV07XG5cblx0XHRcdFx0Ly8gUHJldmVudCBuZXZlci1lbmRpbmcgbG9vcFxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKGRlZXAgJiYgY29weSAmJiAoaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcblx0XHRcdFx0XHRpZiAoY29weUlzQXJyYXkpIHtcblx0XHRcdFx0XHRcdGNvcHlJc0FycmF5ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuXHRcdFx0XHQvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG5cdFx0XHRcdH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0dGFyZ2V0W25hbWVdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG4iLCIvKmpzaGludCBldmlsOnRydWUsIG9uZXZhcjpmYWxzZSovXG4vKmdsb2JhbCBkZWZpbmUqL1xudmFyIGluc3RhbGxlZENvbG9yU3BhY2VzID0gW10sXG4gICAgbmFtZWRDb2xvcnMgPSB7fSxcbiAgICB1bmRlZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xuICAgIH0sXG4gICAgY2hhbm5lbFJlZ0V4cCA9IC9cXHMqKFxcLlxcZCt8XFxkKyg/OlxcLlxcZCspPykoJSk/XFxzKi8sXG4gICAgYWxwaGFDaGFubmVsUmVnRXhwID0gL1xccyooXFwuXFxkK3xcXGQrKD86XFwuXFxkKyk/KVxccyovLFxuICAgIGNzc0NvbG9yUmVnRXhwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIl4ocmdifGhzbHxoc3YpYT9cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJcXFxcKFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbFJlZ0V4cC5zb3VyY2UgKyBcIixcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxSZWdFeHAuc291cmNlICsgXCIsXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsUmVnRXhwLnNvdXJjZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKD86LFwiICsgYWxwaGFDaGFubmVsUmVnRXhwLnNvdXJjZSArIFwiKT9cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJcXFxcKSRcIiwgXCJpXCIpO1xuXG5mdW5jdGlvbiBPTkVDT0xPUihvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShvYmopID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqWzBdID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgT05FQ09MT1Jbb2JqWzBdXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gQXNzdW1lZCBhcnJheSBmcm9tIC50b0pTT04oKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBPTkVDT0xPUltvYmpbMF1dKG9iai5zbGljZSgxLCBvYmoubGVuZ3RoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgLy8gQXNzdW1lZCA0IGVsZW1lbnQgaW50IFJHQiBhcnJheSBmcm9tIGNhbnZhcyB3aXRoIGFsbCBjaGFubmVscyBbMDsyNTVdXG4gICAgICAgICAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlJHQihvYmpbMF0gLyAyNTUsIG9ialsxXSAvIDI1NSwgb2JqWzJdIC8gMjU1LCBvYmpbM10gLyAyNTUpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgbG93ZXJDYXNlZCA9IG9iai50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobmFtZWRDb2xvcnNbbG93ZXJDYXNlZF0pIHtcbiAgICAgICAgICAgIG9iaiA9ICcjJyArIG5hbWVkQ29sb3JzW2xvd2VyQ2FzZWRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb3dlckNhc2VkID09PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICAgICAgICBvYmogPSAncmdiYSgwLDAsMCwwKSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGVzdCBmb3IgQ1NTIHJnYiguLi4uKSBzdHJpbmdcbiAgICAgICAgdmFyIG1hdGNoQ3NzU3ludGF4ID0gb2JqLm1hdGNoKGNzc0NvbG9yUmVnRXhwKTtcbiAgICAgICAgaWYgKG1hdGNoQ3NzU3ludGF4KSB7XG4gICAgICAgICAgICB2YXIgY29sb3JTcGFjZU5hbWUgPSBtYXRjaENzc1N5bnRheFsxXS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgICAgICAgIGFscGhhID0gdW5kZWYobWF0Y2hDc3NTeW50YXhbOF0pID8gbWF0Y2hDc3NTeW50YXhbOF0gOiBwYXJzZUZsb2F0KG1hdGNoQ3NzU3ludGF4WzhdKSxcbiAgICAgICAgICAgICAgICBoYXNIdWUgPSBjb2xvclNwYWNlTmFtZVswXSA9PT0gJ0gnLFxuICAgICAgICAgICAgICAgIGZpcnN0Q2hhbm5lbERpdmlzb3IgPSBtYXRjaENzc1N5bnRheFszXSA/IDEwMCA6IChoYXNIdWUgPyAzNjAgOiAyNTUpLFxuICAgICAgICAgICAgICAgIHNlY29uZENoYW5uZWxEaXZpc29yID0gKG1hdGNoQ3NzU3ludGF4WzVdIHx8IGhhc0h1ZSkgPyAxMDAgOiAyNTUsXG4gICAgICAgICAgICAgICAgdGhpcmRDaGFubmVsRGl2aXNvciA9IChtYXRjaENzc1N5bnRheFs3XSB8fCBoYXNIdWUpID8gMTAwIDogMjU1O1xuICAgICAgICAgICAgaWYgKHVuZGVmKE9ORUNPTE9SW2NvbG9yU3BhY2VOYW1lXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvbmUuY29sb3IuXCIgKyBjb2xvclNwYWNlTmFtZSArIFwiIGlzIG5vdCBpbnN0YWxsZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBPTkVDT0xPUltjb2xvclNwYWNlTmFtZV0oXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdChtYXRjaENzc1N5bnRheFsyXSkgLyBmaXJzdENoYW5uZWxEaXZpc29yLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQobWF0Y2hDc3NTeW50YXhbNF0pIC8gc2Vjb25kQ2hhbm5lbERpdmlzb3IsXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdChtYXRjaENzc1N5bnRheFs2XSkgLyB0aGlyZENoYW5uZWxEaXZpc29yLFxuICAgICAgICAgICAgICAgIGFscGhhXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFzc3VtZSBoZXggc3ludGF4XG4gICAgICAgIGlmIChvYmoubGVuZ3RoIDwgNikge1xuICAgICAgICAgICAgLy8gQWxsb3cgQ1NTIHNob3J0aGFuZFxuICAgICAgICAgICAgb2JqID0gb2JqLnJlcGxhY2UoL14jPyhbMC05YS1mXSkoWzAtOWEtZl0pKFswLTlhLWZdKSQvaSwgJyQxJDEkMiQyJDMkMycpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNwbGl0IG9iaiBpbnRvIHJlZCwgZ3JlZW4sIGFuZCBibHVlIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIGhleE1hdGNoID0gb2JqLm1hdGNoKC9eIz8oWzAtOWEtZl1bMC05YS1mXSkoWzAtOWEtZl1bMC05YS1mXSkoWzAtOWEtZl1bMC05YS1mXSkkL2kpO1xuICAgICAgICBpZiAoaGV4TWF0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT05FQ09MT1IuUkdCKFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGhleE1hdGNoWzFdLCAxNikgLyAyNTUsXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQoaGV4TWF0Y2hbMl0sIDE2KSAvIDI1NSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChoZXhNYXRjaFszXSwgMTYpIC8gMjU1XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmouaXNDb2xvcikge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGluc3RhbGxDb2xvclNwYWNlKGNvbG9yU3BhY2VOYW1lLCBwcm9wZXJ0eU5hbWVzLCBjb25maWcpIHtcbiAgICBPTkVDT0xPUltjb2xvclNwYWNlTmFtZV0gPSBuZXcgRnVuY3Rpb24ocHJvcGVydHlOYW1lcy5qb2luKFwiLFwiKSxcbiAgICAgICAgLy8gQWxsb3cgcGFzc2luZyBhbiBhcnJheSB0byB0aGUgY29uc3RydWN0b3I6XG4gICAgICAgIFwiaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkoXCIgKyBwcm9wZXJ0eU5hbWVzWzBdICsgXCIpID09PSAnW29iamVjdCBBcnJheV0nKSB7XCIgK1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWUgKyBcIj1cIiArIHByb3BlcnR5TmFtZXNbMF0gKyBcIltcIiArIGkgKyBcIl07XCI7XG4gICAgICAgICAgICB9KS5yZXZlcnNlKCkuam9pbihcIlwiKSArXG4gICAgICAgIFwifVwiICtcbiAgICAgICAgXCJpZiAoXCIgKyBwcm9wZXJ0eU5hbWVzLmZpbHRlcihmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydHlOYW1lICE9PSAnYWxwaGEnO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiaXNOYU4oXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIilcIjtcbiAgICAgICAgfSkuam9pbihcInx8XCIpICsgXCIpe1wiICsgXCJ0aHJvdyBuZXcgRXJyb3IoXFxcIltcIiArIGNvbG9yU3BhY2VOYW1lICsgXCJdOiBJbnZhbGlkIGNvbG9yOiAoXFxcIitcIiArIHByb3BlcnR5TmFtZXMuam9pbihcIitcXFwiLFxcXCIrXCIpICsgXCIrXFxcIilcXFwiKTt9XCIgK1xuICAgICAgICBwcm9wZXJ0eU5hbWVzLm1hcChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnaHVlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInRoaXMuX2h1ZT1odWU8MD9odWUtTWF0aC5mbG9vcihodWUpOmh1ZSUxXCI7IC8vIFdyYXBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlOYW1lID09PSAnYWxwaGEnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidGhpcy5fYWxwaGE9KGlzTmFOKGFscGhhKXx8YWxwaGE+MSk/MTooYWxwaGE8MD8wOmFscGhhKTtcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidGhpcy5fXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIj1cIiArIHByb3BlcnR5TmFtZSArIFwiPDA/MDooXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIj4xPzE6XCIgKyBwcm9wZXJ0eU5hbWUgKyBcIilcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuam9pbihcIjtcIikgKyBcIjtcIlxuICAgICk7XG4gICAgT05FQ09MT1JbY29sb3JTcGFjZU5hbWVdLnByb3BlcnR5TmFtZXMgPSBwcm9wZXJ0eU5hbWVzO1xuXG4gICAgdmFyIHByb3RvdHlwZSA9IE9ORUNPTE9SW2NvbG9yU3BhY2VOYW1lXS5wcm90b3R5cGU7XG5cbiAgICBbJ3ZhbHVlT2YnLCAnaGV4JywgJ2hleGEnLCAnY3NzJywgJ2Nzc2EnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAgICAgIHByb3RvdHlwZVttZXRob2ROYW1lXSA9IHByb3RvdHlwZVttZXRob2ROYW1lXSB8fCAoY29sb3JTcGFjZU5hbWUgPT09ICdSR0InID8gcHJvdG90eXBlLmhleCA6IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzLnJnYigpLlwiICsgbWV0aG9kTmFtZSArIFwiKCk7XCIpKTtcbiAgICB9KTtcblxuICAgIHByb3RvdHlwZS5pc0NvbG9yID0gdHJ1ZTtcblxuICAgIHByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXJDb2xvciwgZXBzaWxvbikge1xuICAgICAgICBpZiAodW5kZWYoZXBzaWxvbikpIHtcbiAgICAgICAgICAgIGVwc2lsb24gPSAxZS0xMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG90aGVyQ29sb3IgPSBvdGhlckNvbG9yW2NvbG9yU3BhY2VOYW1lLnRvTG93ZXJDYXNlKCldKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpc1snXycgKyBwcm9wZXJ0eU5hbWVzW2ldXSAtIG90aGVyQ29sb3JbJ18nICsgcHJvcGVydHlOYW1lc1tpXV0pID4gZXBzaWxvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBwcm90b3R5cGUudG9KU09OID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICBcInJldHVybiBbJ1wiICsgY29sb3JTcGFjZU5hbWUgKyBcIicsIFwiICtcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZXMubWFwKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0aGlzLl9cIiArIHByb3BlcnR5TmFtZTtcbiAgICAgICAgICAgIH0sIHRoaXMpLmpvaW4oXCIsIFwiKSArXG4gICAgICAgIFwiXTtcIlxuICAgICk7XG5cbiAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgdmFyIG1hdGNoRnJvbUNvbG9yU3BhY2UgPSBwcm9wZXJ0eU5hbWUubWF0Y2goL15mcm9tKC4qKSQvKTtcbiAgICAgICAgICAgIGlmIChtYXRjaEZyb21Db2xvclNwYWNlKSB7XG4gICAgICAgICAgICAgICAgT05FQ09MT1JbbWF0Y2hGcm9tQ29sb3JTcGFjZVsxXS50b1VwcGVyQ2FzZSgpXS5wcm90b3R5cGVbY29sb3JTcGFjZU5hbWUudG9Mb3dlckNhc2UoKV0gPSBjb25maWdbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlW3Byb3BlcnR5TmFtZV0gPSBjb25maWdbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEl0IGlzIHByZXR0eSBlYXN5IHRvIGltcGxlbWVudCB0aGUgY29udmVyc2lvbiB0byB0aGUgc2FtZSBjb2xvciBzcGFjZTpcbiAgICBwcm90b3R5cGVbY29sb3JTcGFjZU5hbWUudG9Mb3dlckNhc2UoKV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcHJvdG90eXBlLnRvU3RyaW5nID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIFxcXCJbb25lLmNvbG9yLlwiICsgY29sb3JTcGFjZU5hbWUgKyBcIjpcXFwiK1wiICsgcHJvcGVydHlOYW1lcy5tYXAoZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgaSkge1xuICAgICAgICByZXR1cm4gXCJcXFwiIFwiICsgcHJvcGVydHlOYW1lc1tpXSArIFwiPVxcXCIrdGhpcy5fXCIgKyBwcm9wZXJ0eU5hbWU7XG4gICAgfSkuam9pbihcIitcIikgKyBcIitcXFwiXVxcXCI7XCIpO1xuXG4gICAgLy8gR2VuZXJhdGUgZ2V0dGVycyBhbmQgc2V0dGVyc1xuICAgIHByb3BlcnR5TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lLCBpKSB7XG4gICAgICAgIHByb3RvdHlwZVtwcm9wZXJ0eU5hbWVdID0gcHJvdG90eXBlW3Byb3BlcnR5TmFtZSA9PT0gJ2JsYWNrJyA/ICdrJyA6IHByb3BlcnR5TmFtZVswXV0gPSBuZXcgRnVuY3Rpb24oXCJ2YWx1ZVwiLCBcImlzRGVsdGFcIixcbiAgICAgICAgICAgIC8vIFNpbXBsZSBnZXR0ZXIgbW9kZTogY29sb3IucmVkKClcbiAgICAgICAgICAgIFwiaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcIiArXG4gICAgICAgICAgICAgICAgXCJyZXR1cm4gdGhpcy5fXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIjtcIiArXG4gICAgICAgICAgICBcIn1cIiArXG4gICAgICAgICAgICAvLyBBZGp1c3RlcjogY29sb3IucmVkKCsuMiwgdHJ1ZSlcbiAgICAgICAgICAgIFwiaWYgKGlzRGVsdGEpIHtcIiArXG4gICAgICAgICAgICAgICAgXCJyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXCIgKyBwcm9wZXJ0eU5hbWVzLm1hcChmdW5jdGlvbiAob3RoZXJQcm9wZXJ0eU5hbWUsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidGhpcy5fXCIgKyBvdGhlclByb3BlcnR5TmFtZSArIChwcm9wZXJ0eU5hbWUgPT09IG90aGVyUHJvcGVydHlOYW1lID8gXCIrdmFsdWVcIiA6IFwiXCIpO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oXCIsIFwiKSArIFwiKTtcIiArXG4gICAgICAgICAgICBcIn1cIiArXG4gICAgICAgICAgICAvLyBTZXR0ZXI6IGNvbG9yLnJlZCguMik7XG4gICAgICAgICAgICBcInJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcIiArIHByb3BlcnR5TmFtZXMubWFwKGZ1bmN0aW9uIChvdGhlclByb3BlcnR5TmFtZSwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWUgPT09IG90aGVyUHJvcGVydHlOYW1lID8gXCJ2YWx1ZVwiIDogXCJ0aGlzLl9cIiArIG90aGVyUHJvcGVydHlOYW1lO1xuICAgICAgICAgICAgfSkuam9pbihcIiwgXCIpICsgXCIpO1wiKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGluc3RhbGxGb3JlaWduTWV0aG9kcyh0YXJnZXRDb2xvclNwYWNlTmFtZSwgc291cmNlQ29sb3JTcGFjZU5hbWUpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBvYmpbc291cmNlQ29sb3JTcGFjZU5hbWUudG9Mb3dlckNhc2UoKV0gPSBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpcy5yZ2IoKS5cIiArIHNvdXJjZUNvbG9yU3BhY2VOYW1lLnRvTG93ZXJDYXNlKCkgKyBcIigpO1wiKTsgLy8gRmFsbGJhY2tcbiAgICAgICAgT05FQ09MT1Jbc291cmNlQ29sb3JTcGFjZU5hbWVdLnByb3BlcnR5TmFtZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lLCBpKSB7XG4gICAgICAgICAgICBvYmpbcHJvcGVydHlOYW1lXSA9IG9ialtwcm9wZXJ0eU5hbWUgPT09ICdibGFjaycgPyAnaycgOiBwcm9wZXJ0eU5hbWVbMF1dID0gbmV3IEZ1bmN0aW9uKFwidmFsdWVcIiwgXCJpc0RlbHRhXCIsIFwicmV0dXJuIHRoaXMuXCIgKyBzb3VyY2VDb2xvclNwYWNlTmFtZS50b0xvd2VyQ2FzZSgpICsgXCIoKS5cIiArIHByb3BlcnR5TmFtZSArIFwiKHZhbHVlLCBpc0RlbHRhKTtcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiBPTkVDT0xPUlt0YXJnZXRDb2xvclNwYWNlTmFtZV0ucHJvdG90eXBlW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBPTkVDT0xPUlt0YXJnZXRDb2xvclNwYWNlTmFtZV0ucHJvdG90eXBlW3Byb3BdID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5zdGFsbGVkQ29sb3JTcGFjZXMuZm9yRWFjaChmdW5jdGlvbiAob3RoZXJDb2xvclNwYWNlTmFtZSkge1xuICAgICAgICBpbnN0YWxsRm9yZWlnbk1ldGhvZHMoY29sb3JTcGFjZU5hbWUsIG90aGVyQ29sb3JTcGFjZU5hbWUpO1xuICAgICAgICBpbnN0YWxsRm9yZWlnbk1ldGhvZHMob3RoZXJDb2xvclNwYWNlTmFtZSwgY29sb3JTcGFjZU5hbWUpO1xuICAgIH0pO1xuXG4gICAgaW5zdGFsbGVkQ29sb3JTcGFjZXMucHVzaChjb2xvclNwYWNlTmFtZSk7XG59XG5cbk9ORUNPTE9SLmluc3RhbGxNZXRob2QgPSBmdW5jdGlvbiAobmFtZSwgZm4pIHtcbiAgICBpbnN0YWxsZWRDb2xvclNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChjb2xvclNwYWNlKSB7XG4gICAgICAgIE9ORUNPTE9SW2NvbG9yU3BhY2VdLnByb3RvdHlwZVtuYW1lXSA9IGZuO1xuICAgIH0pO1xufTtcblxuaW5zdGFsbENvbG9yU3BhY2UoJ1JHQicsIFsncmVkJywgJ2dyZWVuJywgJ2JsdWUnLCAnYWxwaGEnXSwge1xuICAgIGhleDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaGV4U3RyaW5nID0gKE1hdGgucm91bmQoMjU1ICogdGhpcy5fcmVkKSAqIDB4MTAwMDAgKyBNYXRoLnJvdW5kKDI1NSAqIHRoaXMuX2dyZWVuKSAqIDB4MTAwICsgTWF0aC5yb3VuZCgyNTUgKiB0aGlzLl9ibHVlKSkudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXR1cm4gJyMnICsgKCcwMDAwMCcuc3Vic3RyKDAsIDYgLSBoZXhTdHJpbmcubGVuZ3RoKSkgKyBoZXhTdHJpbmc7XG4gICAgfSxcblxuICAgIGhleGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFscGhhU3RyaW5nID0gTWF0aC5yb3VuZCh0aGlzLl9hbHBoYSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXR1cm4gJyMnICsgJzAwJy5zdWJzdHIoMCwgMiAtIGFscGhhU3RyaW5nLmxlbmd0aCkgKyBhbHBoYVN0cmluZyArIHRoaXMuaGV4KCkuc3Vic3RyKDEsIDYpO1xuICAgIH0sXG5cbiAgICBjc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwicmdiKFwiICsgTWF0aC5yb3VuZCgyNTUgKiB0aGlzLl9yZWQpICsgXCIsXCIgKyBNYXRoLnJvdW5kKDI1NSAqIHRoaXMuX2dyZWVuKSArIFwiLFwiICsgTWF0aC5yb3VuZCgyNTUgKiB0aGlzLl9ibHVlKSArIFwiKVwiO1xuICAgIH0sXG5cbiAgICBjc3NhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcInJnYmEoXCIgKyBNYXRoLnJvdW5kKDI1NSAqIHRoaXMuX3JlZCkgKyBcIixcIiArIE1hdGgucm91bmQoMjU1ICogdGhpcy5fZ3JlZW4pICsgXCIsXCIgKyBNYXRoLnJvdW5kKDI1NSAqIHRoaXMuX2JsdWUpICsgXCIsXCIgKyB0aGlzLl9hbHBoYSArIFwiKVwiO1xuICAgIH1cbn0pO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBOb2RlIG1vZHVsZSBleHBvcnRcbiAgICBtb2R1bGUuZXhwb3J0cyA9IE9ORUNPTE9SO1xufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmICF1bmRlZihkZWZpbmUuYW1kKSkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gT05FQ09MT1I7XG4gICAgfSk7XG59IGVsc2Uge1xuICAgIG9uZSA9IHdpbmRvdy5vbmUgfHwge307XG4gICAgb25lLmNvbG9yID0gT05FQ09MT1I7XG59XG5cbmlmICh0eXBlb2YgalF1ZXJ5ICE9PSAndW5kZWZpbmVkJyAmJiB1bmRlZihqUXVlcnkuY29sb3IpKSB7XG4gICAgalF1ZXJ5LmNvbG9yID0gT05FQ09MT1I7XG59XG5cbi8qZ2xvYmFsIG5hbWVkQ29sb3JzKi9cbm5hbWVkQ29sb3JzID0ge1xuICAgIGFsaWNlYmx1ZTogJ2YwZjhmZicsXG4gICAgYW50aXF1ZXdoaXRlOiAnZmFlYmQ3JyxcbiAgICBhcXVhOiAnMGZmJyxcbiAgICBhcXVhbWFyaW5lOiAnN2ZmZmQ0JyxcbiAgICBhenVyZTogJ2YwZmZmZicsXG4gICAgYmVpZ2U6ICdmNWY1ZGMnLFxuICAgIGJpc3F1ZTogJ2ZmZTRjNCcsXG4gICAgYmxhY2s6ICcwMDAnLFxuICAgIGJsYW5jaGVkYWxtb25kOiAnZmZlYmNkJyxcbiAgICBibHVlOiAnMDBmJyxcbiAgICBibHVldmlvbGV0OiAnOGEyYmUyJyxcbiAgICBicm93bjogJ2E1MmEyYScsXG4gICAgYnVybHl3b29kOiAnZGViODg3JyxcbiAgICBjYWRldGJsdWU6ICc1ZjllYTAnLFxuICAgIGNoYXJ0cmV1c2U6ICc3ZmZmMDAnLFxuICAgIGNob2NvbGF0ZTogJ2QyNjkxZScsXG4gICAgY29yYWw6ICdmZjdmNTAnLFxuICAgIGNvcm5mbG93ZXJibHVlOiAnNjQ5NWVkJyxcbiAgICBjb3Juc2lsazogJ2ZmZjhkYycsXG4gICAgY3JpbXNvbjogJ2RjMTQzYycsXG4gICAgY3lhbjogJzBmZicsXG4gICAgZGFya2JsdWU6ICcwMDAwOGInLFxuICAgIGRhcmtjeWFuOiAnMDA4YjhiJyxcbiAgICBkYXJrZ29sZGVucm9kOiAnYjg4NjBiJyxcbiAgICBkYXJrZ3JheTogJ2E5YTlhOScsXG4gICAgZGFya2dyZXk6ICdhOWE5YTknLFxuICAgIGRhcmtncmVlbjogJzAwNjQwMCcsXG4gICAgZGFya2toYWtpOiAnYmRiNzZiJyxcbiAgICBkYXJrbWFnZW50YTogJzhiMDA4YicsXG4gICAgZGFya29saXZlZ3JlZW46ICc1NTZiMmYnLFxuICAgIGRhcmtvcmFuZ2U6ICdmZjhjMDAnLFxuICAgIGRhcmtvcmNoaWQ6ICc5OTMyY2MnLFxuICAgIGRhcmtyZWQ6ICc4YjAwMDAnLFxuICAgIGRhcmtzYWxtb246ICdlOTk2N2EnLFxuICAgIGRhcmtzZWFncmVlbjogJzhmYmM4ZicsXG4gICAgZGFya3NsYXRlYmx1ZTogJzQ4M2Q4YicsXG4gICAgZGFya3NsYXRlZ3JheTogJzJmNGY0ZicsXG4gICAgZGFya3NsYXRlZ3JleTogJzJmNGY0ZicsXG4gICAgZGFya3R1cnF1b2lzZTogJzAwY2VkMScsXG4gICAgZGFya3Zpb2xldDogJzk0MDBkMycsXG4gICAgZGVlcHBpbms6ICdmZjE0OTMnLFxuICAgIGRlZXBza3libHVlOiAnMDBiZmZmJyxcbiAgICBkaW1ncmF5OiAnNjk2OTY5JyxcbiAgICBkaW1ncmV5OiAnNjk2OTY5JyxcbiAgICBkb2RnZXJibHVlOiAnMWU5MGZmJyxcbiAgICBmaXJlYnJpY2s6ICdiMjIyMjInLFxuICAgIGZsb3JhbHdoaXRlOiAnZmZmYWYwJyxcbiAgICBmb3Jlc3RncmVlbjogJzIyOGIyMicsXG4gICAgZnVjaHNpYTogJ2YwZicsXG4gICAgZ2FpbnNib3JvOiAnZGNkY2RjJyxcbiAgICBnaG9zdHdoaXRlOiAnZjhmOGZmJyxcbiAgICBnb2xkOiAnZmZkNzAwJyxcbiAgICBnb2xkZW5yb2Q6ICdkYWE1MjAnLFxuICAgIGdyYXk6ICc4MDgwODAnLFxuICAgIGdyZXk6ICc4MDgwODAnLFxuICAgIGdyZWVuOiAnMDA4MDAwJyxcbiAgICBncmVlbnllbGxvdzogJ2FkZmYyZicsXG4gICAgaG9uZXlkZXc6ICdmMGZmZjAnLFxuICAgIGhvdHBpbms6ICdmZjY5YjQnLFxuICAgIGluZGlhbnJlZDogJ2NkNWM1YycsXG4gICAgaW5kaWdvOiAnNGIwMDgyJyxcbiAgICBpdm9yeTogJ2ZmZmZmMCcsXG4gICAga2hha2k6ICdmMGU2OGMnLFxuICAgIGxhdmVuZGVyOiAnZTZlNmZhJyxcbiAgICBsYXZlbmRlcmJsdXNoOiAnZmZmMGY1JyxcbiAgICBsYXduZ3JlZW46ICc3Y2ZjMDAnLFxuICAgIGxlbW9uY2hpZmZvbjogJ2ZmZmFjZCcsXG4gICAgbGlnaHRibHVlOiAnYWRkOGU2JyxcbiAgICBsaWdodGNvcmFsOiAnZjA4MDgwJyxcbiAgICBsaWdodGN5YW46ICdlMGZmZmYnLFxuICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiAnZmFmYWQyJyxcbiAgICBsaWdodGdyYXk6ICdkM2QzZDMnLFxuICAgIGxpZ2h0Z3JleTogJ2QzZDNkMycsXG4gICAgbGlnaHRncmVlbjogJzkwZWU5MCcsXG4gICAgbGlnaHRwaW5rOiAnZmZiNmMxJyxcbiAgICBsaWdodHNhbG1vbjogJ2ZmYTA3YScsXG4gICAgbGlnaHRzZWFncmVlbjogJzIwYjJhYScsXG4gICAgbGlnaHRza3libHVlOiAnODdjZWZhJyxcbiAgICBsaWdodHNsYXRlZ3JheTogJzc4OScsXG4gICAgbGlnaHRzbGF0ZWdyZXk6ICc3ODknLFxuICAgIGxpZ2h0c3RlZWxibHVlOiAnYjBjNGRlJyxcbiAgICBsaWdodHllbGxvdzogJ2ZmZmZlMCcsXG4gICAgbGltZTogJzBmMCcsXG4gICAgbGltZWdyZWVuOiAnMzJjZDMyJyxcbiAgICBsaW5lbjogJ2ZhZjBlNicsXG4gICAgbWFnZW50YTogJ2YwZicsXG4gICAgbWFyb29uOiAnODAwMDAwJyxcbiAgICBtZWRpdW1hcXVhbWFyaW5lOiAnNjZjZGFhJyxcbiAgICBtZWRpdW1ibHVlOiAnMDAwMGNkJyxcbiAgICBtZWRpdW1vcmNoaWQ6ICdiYTU1ZDMnLFxuICAgIG1lZGl1bXB1cnBsZTogJzkzNzBkOCcsXG4gICAgbWVkaXVtc2VhZ3JlZW46ICczY2IzNzEnLFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogJzdiNjhlZScsXG4gICAgbWVkaXVtc3ByaW5nZ3JlZW46ICcwMGZhOWEnLFxuICAgIG1lZGl1bXR1cnF1b2lzZTogJzQ4ZDFjYycsXG4gICAgbWVkaXVtdmlvbGV0cmVkOiAnYzcxNTg1JyxcbiAgICBtaWRuaWdodGJsdWU6ICcxOTE5NzAnLFxuICAgIG1pbnRjcmVhbTogJ2Y1ZmZmYScsXG4gICAgbWlzdHlyb3NlOiAnZmZlNGUxJyxcbiAgICBtb2NjYXNpbjogJ2ZmZTRiNScsXG4gICAgbmF2YWpvd2hpdGU6ICdmZmRlYWQnLFxuICAgIG5hdnk6ICcwMDAwODAnLFxuICAgIG9sZGxhY2U6ICdmZGY1ZTYnLFxuICAgIG9saXZlOiAnODA4MDAwJyxcbiAgICBvbGl2ZWRyYWI6ICc2YjhlMjMnLFxuICAgIG9yYW5nZTogJ2ZmYTUwMCcsXG4gICAgb3JhbmdlcmVkOiAnZmY0NTAwJyxcbiAgICBvcmNoaWQ6ICdkYTcwZDYnLFxuICAgIHBhbGVnb2xkZW5yb2Q6ICdlZWU4YWEnLFxuICAgIHBhbGVncmVlbjogJzk4ZmI5OCcsXG4gICAgcGFsZXR1cnF1b2lzZTogJ2FmZWVlZScsXG4gICAgcGFsZXZpb2xldHJlZDogJ2Q4NzA5MycsXG4gICAgcGFwYXlhd2hpcDogJ2ZmZWZkNScsXG4gICAgcGVhY2hwdWZmOiAnZmZkYWI5JyxcbiAgICBwZXJ1OiAnY2Q4NTNmJyxcbiAgICBwaW5rOiAnZmZjMGNiJyxcbiAgICBwbHVtOiAnZGRhMGRkJyxcbiAgICBwb3dkZXJibHVlOiAnYjBlMGU2JyxcbiAgICBwdXJwbGU6ICc4MDAwODAnLFxuICAgIHJlYmVjY2FwdXJwbGU6ICc2MzknLFxuICAgIHJlZDogJ2YwMCcsXG4gICAgcm9zeWJyb3duOiAnYmM4ZjhmJyxcbiAgICByb3lhbGJsdWU6ICc0MTY5ZTEnLFxuICAgIHNhZGRsZWJyb3duOiAnOGI0NTEzJyxcbiAgICBzYWxtb246ICdmYTgwNzInLFxuICAgIHNhbmR5YnJvd246ICdmNGE0NjAnLFxuICAgIHNlYWdyZWVuOiAnMmU4YjU3JyxcbiAgICBzZWFzaGVsbDogJ2ZmZjVlZScsXG4gICAgc2llbm5hOiAnYTA1MjJkJyxcbiAgICBzaWx2ZXI6ICdjMGMwYzAnLFxuICAgIHNreWJsdWU6ICc4N2NlZWInLFxuICAgIHNsYXRlYmx1ZTogJzZhNWFjZCcsXG4gICAgc2xhdGVncmF5OiAnNzA4MDkwJyxcbiAgICBzbGF0ZWdyZXk6ICc3MDgwOTAnLFxuICAgIHNub3c6ICdmZmZhZmEnLFxuICAgIHNwcmluZ2dyZWVuOiAnMDBmZjdmJyxcbiAgICBzdGVlbGJsdWU6ICc0NjgyYjQnLFxuICAgIHRhbjogJ2QyYjQ4YycsXG4gICAgdGVhbDogJzAwODA4MCcsXG4gICAgdGhpc3RsZTogJ2Q4YmZkOCcsXG4gICAgdG9tYXRvOiAnZmY2MzQ3JyxcbiAgICB0dXJxdW9pc2U6ICc0MGUwZDAnLFxuICAgIHZpb2xldDogJ2VlODJlZScsXG4gICAgd2hlYXQ6ICdmNWRlYjMnLFxuICAgIHdoaXRlOiAnZmZmJyxcbiAgICB3aGl0ZXNtb2tlOiAnZjVmNWY1JyxcbiAgICB5ZWxsb3c6ICdmZjAnLFxuICAgIHllbGxvd2dyZWVuOiAnOWFjZDMyJ1xufTtcblxuLypnbG9iYWwgSU5DTFVERSwgaW5zdGFsbENvbG9yU3BhY2UsIE9ORUNPTE9SKi9cblxuaW5zdGFsbENvbG9yU3BhY2UoJ1hZWicsIFsneCcsICd5JywgJ3onLCAnYWxwaGEnXSwge1xuICAgIGZyb21SZ2I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gaHR0cDovL3d3dy5lYXN5cmdiLmNvbS9pbmRleC5waHA/WD1NQVRIJkg9MDIjdGV4dDJcbiAgICAgICAgdmFyIGNvbnZlcnQgPSBmdW5jdGlvbiAoY2hhbm5lbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGFubmVsID4gMC4wNDA0NSA/XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KChjaGFubmVsICsgMC4wNTUpIC8gMS4wNTUsIDIuNCkgOlxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsIC8gMTIuOTI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgciA9IGNvbnZlcnQodGhpcy5fcmVkKSxcbiAgICAgICAgICAgIGcgPSBjb252ZXJ0KHRoaXMuX2dyZWVuKSxcbiAgICAgICAgICAgIGIgPSBjb252ZXJ0KHRoaXMuX2JsdWUpO1xuXG4gICAgICAgIC8vIFJlZmVyZW5jZSB3aGl0ZSBwb2ludCBzUkdCIEQ2NTpcbiAgICAgICAgLy8gaHR0cDovL3d3dy5icnVjZWxpbmRibG9vbS5jb20vaW5kZXguaHRtbD9FcW5fUkdCX1hZWl9NYXRyaXguaHRtbFxuICAgICAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlhZWihcbiAgICAgICAgICAgIHIgKiAwLjQxMjQ1NjQgKyBnICogMC4zNTc1NzYxICsgYiAqIDAuMTgwNDM3NSxcbiAgICAgICAgICAgIHIgKiAwLjIxMjY3MjkgKyBnICogMC43MTUxNTIyICsgYiAqIDAuMDcyMTc1MCxcbiAgICAgICAgICAgIHIgKiAwLjAxOTMzMzkgKyBnICogMC4xMTkxOTIwICsgYiAqIDAuOTUwMzA0MSxcbiAgICAgICAgICAgIHRoaXMuX2FscGhhXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIHJnYjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBodHRwOi8vd3d3LmVhc3lyZ2IuY29tL2luZGV4LnBocD9YPU1BVEgmSD0wMSN0ZXh0MVxuICAgICAgICB2YXIgeCA9IHRoaXMuX3gsXG4gICAgICAgICAgICB5ID0gdGhpcy5feSxcbiAgICAgICAgICAgIHogPSB0aGlzLl96LFxuICAgICAgICAgICAgY29udmVydCA9IGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYW5uZWwgPiAwLjAwMzEzMDggP1xuICAgICAgICAgICAgICAgICAgICAxLjA1NSAqIE1hdGgucG93KGNoYW5uZWwsIDEgLyAyLjQpIC0gMC4wNTUgOlxuICAgICAgICAgICAgICAgICAgICAxMi45MiAqIGNoYW5uZWw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlZmVyZW5jZSB3aGl0ZSBwb2ludCBzUkdCIEQ2NTpcbiAgICAgICAgLy8gaHR0cDovL3d3dy5icnVjZWxpbmRibG9vbS5jb20vaW5kZXguaHRtbD9FcW5fUkdCX1hZWl9NYXRyaXguaHRtbFxuICAgICAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlJHQihcbiAgICAgICAgICAgIGNvbnZlcnQoeCAqICAzLjI0MDQ1NDIgKyB5ICogLTEuNTM3MTM4NSArIHogKiAtMC40OTg1MzE0KSxcbiAgICAgICAgICAgIGNvbnZlcnQoeCAqIC0wLjk2OTI2NjAgKyB5ICogIDEuODc2MDEwOCArIHogKiAgMC4wNDE1NTYwKSxcbiAgICAgICAgICAgIGNvbnZlcnQoeCAqICAwLjA1NTY0MzQgKyB5ICogLTAuMjA0MDI1OSArIHogKiAgMS4wNTcyMjUyKSxcbiAgICAgICAgICAgIHRoaXMuX2FscGhhXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIGxhYjogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBodHRwOi8vd3d3LmVhc3lyZ2IuY29tL2luZGV4LnBocD9YPU1BVEgmSD0wNyN0ZXh0N1xuICAgICAgICB2YXIgY29udmVydCA9IGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYW5uZWwgPiAwLjAwODg1NiA/XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KGNoYW5uZWwsIDEgLyAzKSA6XG4gICAgICAgICAgICAgICAgICAgIDcuNzg3MDM3ICogY2hhbm5lbCArIDQgLyAyOTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4ID0gY29udmVydCh0aGlzLl94IC8gIDk1LjA0NyksXG4gICAgICAgICAgICB5ID0gY29udmVydCh0aGlzLl95IC8gMTAwLjAwMCksXG4gICAgICAgICAgICB6ID0gY29udmVydCh0aGlzLl96IC8gMTA4Ljg4Myk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPTkVDT0xPUi5MQUIoXG4gICAgICAgICAgICAoMTE2ICogeSkgLSAxNixcbiAgICAgICAgICAgIDUwMCAqICh4IC0geSksXG4gICAgICAgICAgICAyMDAgKiAoeSAtIHopLFxuICAgICAgICAgICAgdGhpcy5fYWxwaGFcbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxuLypnbG9iYWwgSU5DTFVERSwgaW5zdGFsbENvbG9yU3BhY2UsIE9ORUNPTE9SKi9cblxuaW5zdGFsbENvbG9yU3BhY2UoJ0xBQicsIFsnbCcsICdhJywgJ2InLCAnYWxwaGEnXSwge1xuICAgIGZyb21SZ2I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueHl6KCkubGFiKCk7XG4gICAgfSxcblxuICAgIHJnYjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54eXooKS5yZ2IoKTtcbiAgICB9LFxuXG4gICAgeHl6OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGh0dHA6Ly93d3cuZWFzeXJnYi5jb20vaW5kZXgucGhwP1g9TUFUSCZIPTA4I3RleHQ4XG4gICAgICAgIHZhciBjb252ZXJ0ID0gZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG93ID0gTWF0aC5wb3coY2hhbm5lbCwgMyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvdyA+IDAuMDA4ODU2ID9cbiAgICAgICAgICAgICAgICAgICAgcG93IDpcbiAgICAgICAgICAgICAgICAgICAgKGNoYW5uZWwgLSAxNiAvIDExNikgLyA3Ljg3O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHkgPSAodGhpcy5fbCArIDE2KSAvIDExNixcbiAgICAgICAgICAgIHggPSB0aGlzLl9hIC8gNTAwICsgeSxcbiAgICAgICAgICAgIHogPSB5IC0gdGhpcy5fYiAvIDIwMDtcblxuICAgICAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlhZWihcbiAgICAgICAgICAgIGNvbnZlcnQoeCkgKiAgOTUuMDQ3LFxuICAgICAgICAgICAgY29udmVydCh5KSAqIDEwMC4wMDAsXG4gICAgICAgICAgICBjb252ZXJ0KHopICogMTA4Ljg4MyxcbiAgICAgICAgICAgIHRoaXMuX2FscGhhXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbi8qZ2xvYmFsIG9uZSovXG5cbmluc3RhbGxDb2xvclNwYWNlKCdIU1YnLCBbJ2h1ZScsICdzYXR1cmF0aW9uJywgJ3ZhbHVlJywgJ2FscGhhJ10sIHtcbiAgICByZ2I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGh1ZSA9IHRoaXMuX2h1ZSxcbiAgICAgICAgICAgIHNhdHVyYXRpb24gPSB0aGlzLl9zYXR1cmF0aW9uLFxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl92YWx1ZSxcbiAgICAgICAgICAgIGkgPSBNYXRoLm1pbig1LCBNYXRoLmZsb29yKGh1ZSAqIDYpKSxcbiAgICAgICAgICAgIGYgPSBodWUgKiA2IC0gaSxcbiAgICAgICAgICAgIHAgPSB2YWx1ZSAqICgxIC0gc2F0dXJhdGlvbiksXG4gICAgICAgICAgICBxID0gdmFsdWUgKiAoMSAtIGYgKiBzYXR1cmF0aW9uKSxcbiAgICAgICAgICAgIHQgPSB2YWx1ZSAqICgxIC0gKDEgLSBmKSAqIHNhdHVyYXRpb24pLFxuICAgICAgICAgICAgcmVkLFxuICAgICAgICAgICAgZ3JlZW4sXG4gICAgICAgICAgICBibHVlO1xuICAgICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmVkID0gdmFsdWU7XG4gICAgICAgICAgICBncmVlbiA9IHQ7XG4gICAgICAgICAgICBibHVlID0gcDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZWQgPSBxO1xuICAgICAgICAgICAgZ3JlZW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIGJsdWUgPSBwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJlZCA9IHA7XG4gICAgICAgICAgICBncmVlbiA9IHZhbHVlO1xuICAgICAgICAgICAgYmx1ZSA9IHQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmVkID0gcDtcbiAgICAgICAgICAgIGdyZWVuID0gcTtcbiAgICAgICAgICAgIGJsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZWQgPSB0O1xuICAgICAgICAgICAgZ3JlZW4gPSBwO1xuICAgICAgICAgICAgYmx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJlZCA9IHZhbHVlO1xuICAgICAgICAgICAgZ3JlZW4gPSBwO1xuICAgICAgICAgICAgYmx1ZSA9IHE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlJHQihyZWQsIGdyZWVuLCBibHVlLCB0aGlzLl9hbHBoYSk7XG4gICAgfSxcblxuICAgIGhzbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbCA9ICgyIC0gdGhpcy5fc2F0dXJhdGlvbikgKiB0aGlzLl92YWx1ZSxcbiAgICAgICAgICAgIHN2ID0gdGhpcy5fc2F0dXJhdGlvbiAqIHRoaXMuX3ZhbHVlLFxuICAgICAgICAgICAgc3ZEaXZpc29yID0gbCA8PSAxID8gbCA6ICgyIC0gbCksXG4gICAgICAgICAgICBzYXR1cmF0aW9uO1xuXG4gICAgICAgIC8vIEF2b2lkIGRpdmlzaW9uIGJ5IHplcm8gd2hlbiBsaWdodG5lc3MgYXBwcm9hY2hlcyB6ZXJvOlxuICAgICAgICBpZiAoc3ZEaXZpc29yIDwgMWUtOSkge1xuICAgICAgICAgICAgc2F0dXJhdGlvbiA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXR1cmF0aW9uID0gc3YgLyBzdkRpdmlzb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPTkVDT0xPUi5IU0wodGhpcy5faHVlLCBzYXR1cmF0aW9uLCBsIC8gMiwgdGhpcy5fYWxwaGEpO1xuICAgIH0sXG5cbiAgICBmcm9tUmdiOiBmdW5jdGlvbiAoKSB7IC8vIEJlY29tZXMgb25lLmNvbG9yLlJHQi5wcm90b3R5cGUuaHN2XG4gICAgICAgIHZhciByZWQgPSB0aGlzLl9yZWQsXG4gICAgICAgICAgICBncmVlbiA9IHRoaXMuX2dyZWVuLFxuICAgICAgICAgICAgYmx1ZSA9IHRoaXMuX2JsdWUsXG4gICAgICAgICAgICBtYXggPSBNYXRoLm1heChyZWQsIGdyZWVuLCBibHVlKSxcbiAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKHJlZCwgZ3JlZW4sIGJsdWUpLFxuICAgICAgICAgICAgZGVsdGEgPSBtYXggLSBtaW4sXG4gICAgICAgICAgICBodWUsXG4gICAgICAgICAgICBzYXR1cmF0aW9uID0gKG1heCA9PT0gMCkgPyAwIDogKGRlbHRhIC8gbWF4KSxcbiAgICAgICAgICAgIHZhbHVlID0gbWF4O1xuICAgICAgICBpZiAoZGVsdGEgPT09IDApIHtcbiAgICAgICAgICAgIGh1ZSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1heCkge1xuICAgICAgICAgICAgY2FzZSByZWQ6XG4gICAgICAgICAgICAgICAgaHVlID0gKGdyZWVuIC0gYmx1ZSkgLyBkZWx0YSAvIDYgKyAoZ3JlZW4gPCBibHVlID8gMSA6IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBncmVlbjpcbiAgICAgICAgICAgICAgICBodWUgPSAoYmx1ZSAtIHJlZCkgLyBkZWx0YSAvIDYgKyAxIC8gMztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYmx1ZTpcbiAgICAgICAgICAgICAgICBodWUgPSAocmVkIC0gZ3JlZW4pIC8gZGVsdGEgLyA2ICsgMiAvIDM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPTkVDT0xPUi5IU1YoaHVlLCBzYXR1cmF0aW9uLCB2YWx1ZSwgdGhpcy5fYWxwaGEpO1xuICAgIH1cbn0pO1xuXG4vKmdsb2JhbCBvbmUqL1xuXG5cbmluc3RhbGxDb2xvclNwYWNlKCdIU0wnLCBbJ2h1ZScsICdzYXR1cmF0aW9uJywgJ2xpZ2h0bmVzcycsICdhbHBoYSddLCB7XG4gICAgaHN2OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEFsZ29yaXRobSBhZGFwdGVkIGZyb20gaHR0cDovL3dpa2kuc2Vjb25kbGlmZS5jb20vd2lraS9Db2xvcl9jb252ZXJzaW9uX3NjcmlwdHNcbiAgICAgICAgdmFyIGwgPSB0aGlzLl9saWdodG5lc3MgKiAyLFxuICAgICAgICAgICAgcyA9IHRoaXMuX3NhdHVyYXRpb24gKiAoKGwgPD0gMSkgPyBsIDogMiAtIGwpLFxuICAgICAgICAgICAgc2F0dXJhdGlvbjtcblxuICAgICAgICAvLyBBdm9pZCBkaXZpc2lvbiBieSB6ZXJvIHdoZW4gbCArIHMgaXMgdmVyeSBzbWFsbCAoYXBwcm9hY2hpbmcgYmxhY2spOlxuICAgICAgICBpZiAobCArIHMgPCAxZS05KSB7XG4gICAgICAgICAgICBzYXR1cmF0aW9uID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdHVyYXRpb24gPSAoMiAqIHMpIC8gKGwgKyBzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgT05FQ09MT1IuSFNWKHRoaXMuX2h1ZSwgc2F0dXJhdGlvbiwgKGwgKyBzKSAvIDIsIHRoaXMuX2FscGhhKTtcbiAgICB9LFxuXG4gICAgcmdiOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhzdigpLnJnYigpO1xuICAgIH0sXG5cbiAgICBmcm9tUmdiOiBmdW5jdGlvbiAoKSB7IC8vIEJlY29tZXMgb25lLmNvbG9yLlJHQi5wcm90b3R5cGUuaHN2XG4gICAgICAgIHJldHVybiB0aGlzLmhzdigpLmhzbCgpO1xuICAgIH1cbn0pO1xuXG4vKmdsb2JhbCBvbmUqL1xuXG5pbnN0YWxsQ29sb3JTcGFjZSgnQ01ZSycsIFsnY3lhbicsICdtYWdlbnRhJywgJ3llbGxvdycsICdibGFjaycsICdhbHBoYSddLCB7XG4gICAgcmdiOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgT05FQ09MT1IuUkdCKCgxIC0gdGhpcy5fY3lhbiAqICgxIC0gdGhpcy5fYmxhY2spIC0gdGhpcy5fYmxhY2spLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDEgLSB0aGlzLl9tYWdlbnRhICogKDEgLSB0aGlzLl9ibGFjaykgLSB0aGlzLl9ibGFjayksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMSAtIHRoaXMuX3llbGxvdyAqICgxIC0gdGhpcy5fYmxhY2spIC0gdGhpcy5fYmxhY2spLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWxwaGEpO1xuICAgIH0sXG5cbiAgICBmcm9tUmdiOiBmdW5jdGlvbiAoKSB7IC8vIEJlY29tZXMgb25lLmNvbG9yLlJHQi5wcm90b3R5cGUuY215a1xuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cDovL3d3dy5qYXZhc2NyaXB0ZXIubmV0L2ZhcS9yZ2IyY215ay5odG1cbiAgICAgICAgdmFyIHJlZCA9IHRoaXMuX3JlZCxcbiAgICAgICAgICAgIGdyZWVuID0gdGhpcy5fZ3JlZW4sXG4gICAgICAgICAgICBibHVlID0gdGhpcy5fYmx1ZSxcbiAgICAgICAgICAgIGN5YW4gPSAxIC0gcmVkLFxuICAgICAgICAgICAgbWFnZW50YSA9IDEgLSBncmVlbixcbiAgICAgICAgICAgIHllbGxvdyA9IDEgLSBibHVlLFxuICAgICAgICAgICAgYmxhY2sgPSAxO1xuICAgICAgICBpZiAocmVkIHx8IGdyZWVuIHx8IGJsdWUpIHtcbiAgICAgICAgICAgIGJsYWNrID0gTWF0aC5taW4oY3lhbiwgTWF0aC5taW4obWFnZW50YSwgeWVsbG93KSk7XG4gICAgICAgICAgICBjeWFuID0gKGN5YW4gLSBibGFjaykgLyAoMSAtIGJsYWNrKTtcbiAgICAgICAgICAgIG1hZ2VudGEgPSAobWFnZW50YSAtIGJsYWNrKSAvICgxIC0gYmxhY2spO1xuICAgICAgICAgICAgeWVsbG93ID0gKHllbGxvdyAtIGJsYWNrKSAvICgxIC0gYmxhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxhY2sgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgT05FQ09MT1IuQ01ZSyhjeWFuLCBtYWdlbnRhLCB5ZWxsb3csIGJsYWNrLCB0aGlzLl9hbHBoYSk7XG4gICAgfVxufSk7XG5cbk9ORUNPTE9SLmluc3RhbGxNZXRob2QoJ2NsZWFyZXInLCBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuYWxwaGEoaXNOYU4oYW1vdW50KSA/IC0wLjEgOiAtYW1vdW50LCB0cnVlKTtcbn0pO1xuXG5cbk9ORUNPTE9SLmluc3RhbGxNZXRob2QoJ2RhcmtlbicsIGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICByZXR1cm4gdGhpcy5saWdodG5lc3MoaXNOYU4oYW1vdW50KSA/IC0wLjEgOiAtYW1vdW50LCB0cnVlKTtcbn0pO1xuXG5cbk9ORUNPTE9SLmluc3RhbGxNZXRob2QoJ2Rlc2F0dXJhdGUnLCBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2F0dXJhdGlvbihpc05hTihhbW91bnQpID8gLTAuMSA6IC1hbW91bnQsIHRydWUpO1xufSk7XG5cbmZ1bmN0aW9uIGdzICgpIHtcbiAgICB2YXIgcmdiID0gdGhpcy5yZ2IoKSxcbiAgICAgICAgdmFsID0gcmdiLl9yZWQgKiAwLjMgKyByZ2IuX2dyZWVuICogMC41OSArIHJnYi5fYmx1ZSAqIDAuMTE7XG5cbiAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlJHQih2YWwsIHZhbCwgdmFsLCB0aGlzLl9hbHBoYSk7XG59O1xuXG5PTkVDT0xPUi5pbnN0YWxsTWV0aG9kKCdncmV5c2NhbGUnLCBncyk7XG5PTkVDT0xPUi5pbnN0YWxsTWV0aG9kKCdncmF5c2NhbGUnLCBncyk7XG5cblxuT05FQ09MT1IuaW5zdGFsbE1ldGhvZCgnbGlnaHRlbicsIGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICByZXR1cm4gdGhpcy5saWdodG5lc3MoaXNOYU4oYW1vdW50KSA/IDAuMSA6IGFtb3VudCwgdHJ1ZSk7XG59KTtcblxuT05FQ09MT1IuaW5zdGFsbE1ldGhvZCgnbWl4JywgZnVuY3Rpb24gKG90aGVyQ29sb3IsIHdlaWdodCkge1xuICAgIG90aGVyQ29sb3IgPSBPTkVDT0xPUihvdGhlckNvbG9yKS5yZ2IoKTtcbiAgICB3ZWlnaHQgPSAxIC0gKGlzTmFOKHdlaWdodCkgPyAwLjUgOiB3ZWlnaHQpO1xuXG4gICAgdmFyIHcgPSB3ZWlnaHQgKiAyIC0gMSxcbiAgICAgICAgYSA9IHRoaXMuX2FscGhhIC0gb3RoZXJDb2xvci5fYWxwaGEsXG4gICAgICAgIHdlaWdodDEgPSAoKCh3ICogYSA9PT0gLTEpID8gdyA6ICh3ICsgYSkgLyAoMSArIHcgKiBhKSkgKyAxKSAvIDIsXG4gICAgICAgIHdlaWdodDIgPSAxIC0gd2VpZ2h0MSxcbiAgICAgICAgcmdiID0gdGhpcy5yZ2IoKTtcblxuICAgIHJldHVybiBuZXcgT05FQ09MT1IuUkdCKFxuICAgICAgICByZ2IuX3JlZCAqIHdlaWdodDEgKyBvdGhlckNvbG9yLl9yZWQgKiB3ZWlnaHQyLFxuICAgICAgICByZ2IuX2dyZWVuICogd2VpZ2h0MSArIG90aGVyQ29sb3IuX2dyZWVuICogd2VpZ2h0MixcbiAgICAgICAgcmdiLl9ibHVlICogd2VpZ2h0MSArIG90aGVyQ29sb3IuX2JsdWUgKiB3ZWlnaHQyLFxuICAgICAgICByZ2IuX2FscGhhICogd2VpZ2h0ICsgb3RoZXJDb2xvci5fYWxwaGEgKiAoMSAtIHdlaWdodClcbiAgICApO1xufSk7XG5cbk9ORUNPTE9SLmluc3RhbGxNZXRob2QoJ25lZ2F0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmdiID0gdGhpcy5yZ2IoKTtcbiAgICByZXR1cm4gbmV3IE9ORUNPTE9SLlJHQigxIC0gcmdiLl9yZWQsIDEgLSByZ2IuX2dyZWVuLCAxIC0gcmdiLl9ibHVlLCB0aGlzLl9hbHBoYSk7XG59KTtcblxuT05FQ09MT1IuaW5zdGFsbE1ldGhvZCgnb3BhcXVlcicsIGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICByZXR1cm4gdGhpcy5hbHBoYShpc05hTihhbW91bnQpID8gMC4xIDogYW1vdW50LCB0cnVlKTtcbn0pO1xuXG5PTkVDT0xPUi5pbnN0YWxsTWV0aG9kKCdyb3RhdGUnLCBmdW5jdGlvbiAoZGVncmVlcykge1xuICAgIHJldHVybiB0aGlzLmh1ZSgoZGVncmVlcyB8fCAwKSAvIDM2MCwgdHJ1ZSk7XG59KTtcblxuXG5PTkVDT0xPUi5pbnN0YWxsTWV0aG9kKCdzYXR1cmF0ZScsIGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICByZXR1cm4gdGhpcy5zYXR1cmF0aW9uKGlzTmFOKGFtb3VudCkgPyAwLjEgOiBhbW91bnQsIHRydWUpO1xufSk7XG5cbi8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vZ2ltcC5zb3VyY2VhcmNoaXZlLmNvbS9kb2N1bWVudGF0aW9uLzIuNi42LTF1YnVudHUxL2NvbG9yLXRvLWFscGhhXzhjLXNvdXJjZS5odG1sXG4vKlxuICAgIHRvQWxwaGEgcmV0dXJucyBhIGNvbG9yIHdoZXJlIHRoZSB2YWx1ZXMgb2YgdGhlIGFyZ3VtZW50IGhhdmUgYmVlbiBjb252ZXJ0ZWQgdG8gYWxwaGFcbiovXG5PTkVDT0xPUi5pbnN0YWxsTWV0aG9kKCd0b0FscGhhJywgZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgdmFyIG1lID0gdGhpcy5yZ2IoKSxcbiAgICAgICAgb3RoZXIgPSBPTkVDT0xPUihjb2xvcikucmdiKCksXG4gICAgICAgIGVwc2lsb24gPSAxZS0xMCxcbiAgICAgICAgYSA9IG5ldyBPTkVDT0xPUi5SR0IoMCwgMCwgMCwgbWUuX2FscGhhKSxcbiAgICAgICAgY2hhbm5lbHMgPSBbJ19yZWQnLCAnX2dyZWVuJywgJ19ibHVlJ107XG5cbiAgICBjaGFubmVscy5mb3JFYWNoKGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICAgIGlmIChtZVtjaGFubmVsXSA8IGVwc2lsb24pIHtcbiAgICAgICAgICAgIGFbY2hhbm5lbF0gPSBtZVtjaGFubmVsXTtcbiAgICAgICAgfSBlbHNlIGlmIChtZVtjaGFubmVsXSA+IG90aGVyW2NoYW5uZWxdKSB7XG4gICAgICAgICAgICBhW2NoYW5uZWxdID0gKG1lW2NoYW5uZWxdIC0gb3RoZXJbY2hhbm5lbF0pIC8gKDEgLSBvdGhlcltjaGFubmVsXSk7XG4gICAgICAgIH0gZWxzZSBpZiAobWVbY2hhbm5lbF0gPiBvdGhlcltjaGFubmVsXSkge1xuICAgICAgICAgICAgYVtjaGFubmVsXSA9IChvdGhlcltjaGFubmVsXSAtIG1lW2NoYW5uZWxdKSAvIG90aGVyW2NoYW5uZWxdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVtjaGFubmVsXSA9IDA7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChhLl9yZWQgPiBhLl9ncmVlbikge1xuICAgICAgICBpZiAoYS5fcmVkID4gYS5fYmx1ZSkge1xuICAgICAgICAgICAgbWUuX2FscGhhID0gYS5fcmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWUuX2FscGhhID0gYS5fYmx1ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYS5fZ3JlZW4gPiBhLl9ibHVlKSB7XG4gICAgICAgIG1lLl9hbHBoYSA9IGEuX2dyZWVuO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lLl9hbHBoYSA9IGEuX2JsdWU7XG4gICAgfVxuXG4gICAgaWYgKG1lLl9hbHBoYSA8IGVwc2lsb24pIHtcbiAgICAgICAgcmV0dXJuIG1lO1xuICAgIH1cblxuICAgIGNoYW5uZWxzLmZvckVhY2goZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgICAgICAgbWVbY2hhbm5lbF0gPSAobWVbY2hhbm5lbF0gLSBvdGhlcltjaGFubmVsXSkgLyBtZS5fYWxwaGEgKyBvdGhlcltjaGFubmVsXTtcbiAgICB9KTtcbiAgICBtZS5fYWxwaGEgKj0gYS5fYWxwaGE7XG5cbiAgICByZXR1cm4gbWU7XG59KTtcblxuLypnbG9iYWwgb25lKi9cblxuLy8gVGhpcyBmaWxlIGlzIHB1cmVseSBmb3IgdGhlIGJ1aWxkIHN5c3RlbVxuXG4vLyBPcmRlciBpcyBpbXBvcnRhbnQgdG8gcHJldmVudCBjaGFubmVsIG5hbWUgY2xhc2hlcy4gTGFiIDwtPiBoc0xcblxuLy8gQ29udmVuaWVuY2UgZnVuY3Rpb25zXG5cbiIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKVxuXG5mdW5jdGlvbiBCYXRjaGVyICgpIHtcbiAgICB0aGlzLnJlc2V0KClcbn1cblxudmFyIEJhdGNoZXJQcm90byA9IEJhdGNoZXIucHJvdG90eXBlXG5cbkJhdGNoZXJQcm90by5wdXNoID0gZnVuY3Rpb24gKGpvYikge1xuICAgIGlmICgham9iLmlkIHx8ICF0aGlzLmhhc1tqb2IuaWRdKSB7XG4gICAgICAgIHRoaXMucXVldWUucHVzaChqb2IpXG4gICAgICAgIHRoaXMuaGFzW2pvYi5pZF0gPSBqb2JcbiAgICAgICAgaWYgKCF0aGlzLndhaXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMud2FpdGluZyA9IHRydWVcbiAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKHV0aWxzLmJpbmQodGhpcy5mbHVzaCwgdGhpcykpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGpvYi5vdmVycmlkZSkge1xuICAgICAgICB2YXIgb2xkSm9iID0gdGhpcy5oYXNbam9iLmlkXVxuICAgICAgICBvbGRKb2IuY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goam9iKVxuICAgICAgICB0aGlzLmhhc1tqb2IuaWRdID0gam9iXG4gICAgfVxufVxuXG5CYXRjaGVyUHJvdG8uZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYmVmb3JlIGZsdXNoIGhvb2tcbiAgICBpZiAodGhpcy5fcHJlRmx1c2gpIHRoaXMuX3ByZUZsdXNoKClcbiAgICAvLyBkbyBub3QgY2FjaGUgbGVuZ3RoIGJlY2F1c2UgbW9yZSBqb2JzIG1pZ2h0IGJlIHB1c2hlZFxuICAgIC8vIGFzIHdlIGV4ZWN1dGUgZXhpc3Rpbmcgam9ic1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgam9iID0gdGhpcy5xdWV1ZVtpXVxuICAgICAgICBpZiAoIWpvYi5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGpvYi5leGVjdXRlKClcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlc2V0KClcbn1cblxuQmF0Y2hlclByb3RvLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaGFzID0gdXRpbHMuaGFzaCgpXG4gICAgdGhpcy5xdWV1ZSA9IFtdXG4gICAgdGhpcy53YWl0aW5nID0gZmFsc2Vcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXRjaGVyIiwidmFyIEJhdGNoZXIgICAgICAgID0gcmVxdWlyZSgnLi9iYXRjaGVyJyksXG4gICAgYmluZGluZ0JhdGNoZXIgPSBuZXcgQmF0Y2hlcigpLFxuICAgIGJpbmRpbmdJZCAgICAgID0gMVxuXG4vKipcbiAqICBCaW5kaW5nIGNsYXNzLlxuICpcbiAqICBlYWNoIHByb3BlcnR5IG9uIHRoZSB2aWV3bW9kZWwgaGFzIG9uZSBjb3JyZXNwb25kaW5nIEJpbmRpbmcgb2JqZWN0XG4gKiAgd2hpY2ggaGFzIG11bHRpcGxlIGRpcmVjdGl2ZSBpbnN0YW5jZXMgb24gdGhlIERPTVxuICogIGFuZCBtdWx0aXBsZSBjb21wdXRlZCBwcm9wZXJ0eSBkZXBlbmRlbnRzXG4gKi9cbmZ1bmN0aW9uIEJpbmRpbmcgKGNvbXBpbGVyLCBrZXksIGlzRXhwLCBpc0ZuKSB7XG4gICAgdGhpcy5pZCA9IGJpbmRpbmdJZCsrXG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZFxuICAgIHRoaXMuaXNFeHAgPSAhIWlzRXhwXG4gICAgdGhpcy5pc0ZuID0gaXNGblxuICAgIHRoaXMucm9vdCA9ICF0aGlzLmlzRXhwICYmIGtleS5pbmRleE9mKCcuJykgPT09IC0xXG4gICAgdGhpcy5jb21waWxlciA9IGNvbXBpbGVyXG4gICAgdGhpcy5rZXkgPSBrZXlcbiAgICB0aGlzLmRpcnMgPSBbXVxuICAgIHRoaXMuc3VicyA9IFtdXG4gICAgdGhpcy5kZXBzID0gW11cbiAgICB0aGlzLnVuYm91bmQgPSBmYWxzZVxufVxuXG52YXIgQmluZGluZ1Byb3RvID0gQmluZGluZy5wcm90b3R5cGVcblxuLyoqXG4gKiAgVXBkYXRlIHZhbHVlIGFuZCBxdWV1ZSBpbnN0YW5jZSB1cGRhdGVzLlxuICovXG5CaW5kaW5nUHJvdG8udXBkYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZWQgfHwgdGhpcy5pc0ZuKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5kaXJzLmxlbmd0aCB8fCB0aGlzLnN1YnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICBiaW5kaW5nQmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi51bmJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQWN0dWFsbHkgdXBkYXRlIHRoZSBkaXJlY3RpdmVzLlxuICovXG5CaW5kaW5nUHJvdG8uX3VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHRoaXMuZGlycy5sZW5ndGgsXG4gICAgICAgIHZhbHVlID0gdGhpcy52YWwoKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdGhpcy5kaXJzW2ldLiR1cGRhdGUodmFsdWUpXG4gICAgfVxuICAgIHRoaXMucHViKClcbn1cblxuLyoqXG4gKiAgUmV0dXJuIHRoZSB2YWx1YXRlZCB2YWx1ZSByZWdhcmRsZXNzXG4gKiAgb2Ygd2hldGhlciBpdCBpcyBjb21wdXRlZCBvciBub3RcbiAqL1xuQmluZGluZ1Byb3RvLnZhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0NvbXB1dGVkICYmICF0aGlzLmlzRm5cbiAgICAgICAgPyB0aGlzLnZhbHVlLiRnZXQoKVxuICAgICAgICA6IHRoaXMudmFsdWVcbn1cblxuLyoqXG4gKiAgTm90aWZ5IGNvbXB1dGVkIHByb3BlcnRpZXMgdGhhdCBkZXBlbmQgb24gdGhpcyBiaW5kaW5nXG4gKiAgdG8gdXBkYXRlIHRoZW1zZWx2ZXNcbiAqL1xuQmluZGluZ1Byb3RvLnB1YiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHRoaXMuc3Vicy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMuc3Vic1tpXS51cGRhdGUoKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgVW5iaW5kIHRoZSBiaW5kaW5nLCByZW1vdmUgaXRzZWxmIGZyb20gYWxsIG9mIGl0cyBkZXBlbmRlbmNpZXNcbiAqL1xuQmluZGluZ1Byb3RvLnVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJbmRpY2F0ZSB0aGlzIGhhcyBiZWVuIHVuYm91bmQuXG4gICAgLy8gSXQncyBwb3NzaWJsZSB0aGlzIGJpbmRpbmcgd2lsbCBiZSBpblxuICAgIC8vIHRoZSBiYXRjaGVyJ3MgZmx1c2ggcXVldWUgd2hlbiBpdHMgb3duZXJcbiAgICAvLyBjb21waWxlciBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZC5cbiAgICB0aGlzLnVuYm91bmQgPSB0cnVlXG4gICAgdmFyIGkgPSB0aGlzLmRpcnMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICB0aGlzLmRpcnNbaV0uJHVuYmluZCgpXG4gICAgfVxuICAgIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gICAgdmFyIHN1YnNcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHN1YnMgPSB0aGlzLmRlcHNbaV0uc3Vic1xuICAgICAgICB2YXIgaiA9IHN1YnMuaW5kZXhPZih0aGlzKVxuICAgICAgICBpZiAoaiA+IC0xKSBzdWJzLnNwbGljZShqLCAxKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCaW5kaW5nIiwidmFyIEVtaXR0ZXIgICAgID0gcmVxdWlyZSgnLi9lbWl0dGVyJyksXG4gICAgT2JzZXJ2ZXIgICAgPSByZXF1aXJlKCcuL29ic2VydmVyJyksXG4gICAgY29uZmlnICAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIHV0aWxzICAgICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIEJpbmRpbmcgICAgID0gcmVxdWlyZSgnLi9iaW5kaW5nJyksXG4gICAgRGlyZWN0aXZlICAgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpLFxuICAgIFRleHRQYXJzZXIgID0gcmVxdWlyZSgnLi90ZXh0LXBhcnNlcicpLFxuICAgIERlcHNQYXJzZXIgID0gcmVxdWlyZSgnLi9kZXBzLXBhcnNlcicpLFxuICAgIEV4cFBhcnNlciAgID0gcmVxdWlyZSgnLi9leHAtcGFyc2VyJyksXG4gICAgVmlld01vZGVsLFxuICAgIFxuICAgIC8vIGNhY2hlIG1ldGhvZHNcbiAgICBzbGljZSAgICAgICA9IFtdLnNsaWNlLFxuICAgIGV4dGVuZCAgICAgID0gdXRpbHMuZXh0ZW5kLFxuICAgIGhhc093biAgICAgID0gKHt9KS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBkZWYgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcblxuICAgIC8vIGhvb2tzIHRvIHJlZ2lzdGVyXG4gICAgaG9va3MgPSBbXG4gICAgICAgICdjcmVhdGVkJywgJ3JlYWR5JyxcbiAgICAgICAgJ2JlZm9yZURlc3Ryb3knLCAnYWZ0ZXJEZXN0cm95JyxcbiAgICAgICAgJ2F0dGFjaGVkJywgJ2RldGFjaGVkJ1xuICAgIF0sXG5cbiAgICAvLyBsaXN0IG9mIHByaW9yaXR5IGRpcmVjdGl2ZXNcbiAgICAvLyB0aGF0IG5lZWRzIHRvIGJlIGNoZWNrZWQgaW4gc3BlY2lmaWMgb3JkZXJcbiAgICBwcmlvcml0eURpcmVjdGl2ZXMgPSBbXG4gICAgICAgICdpZicsXG4gICAgICAgICdyZXBlYXQnLFxuICAgICAgICAndmlldycsXG4gICAgICAgICdjb21wb25lbnQnXG4gICAgXVxuXG4vKipcbiAqICBUaGUgRE9NIGNvbXBpbGVyXG4gKiAgc2NhbnMgYSBET00gbm9kZSBhbmQgY29tcGlsZSBiaW5kaW5ncyBmb3IgYSBWaWV3TW9kZWxcbiAqL1xuZnVuY3Rpb24gQ29tcGlsZXIgKHZtLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBrZXksIGlcblxuICAgIC8vIGRlZmF1bHQgc3RhdGVcbiAgICBjb21waWxlci5pbml0ICAgICAgID0gdHJ1ZVxuICAgIGNvbXBpbGVyLmRlc3Ryb3llZCAgPSBmYWxzZVxuXG4gICAgLy8gcHJvY2VzcyBhbmQgZXh0ZW5kIG9wdGlvbnNcbiAgICBvcHRpb25zID0gY29tcGlsZXIub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB1dGlscy5wcm9jZXNzT3B0aW9ucyhvcHRpb25zKVxuXG4gICAgLy8gY29weSBjb21waWxlciBvcHRpb25zXG4gICAgZXh0ZW5kKGNvbXBpbGVyLCBvcHRpb25zLmNvbXBpbGVyT3B0aW9ucylcbiAgICAvLyByZXBlYXQgaW5kaWNhdGVzIHRoaXMgaXMgYSB2LXJlcGVhdCBpbnN0YW5jZVxuICAgIGNvbXBpbGVyLnJlcGVhdCAgID0gY29tcGlsZXIucmVwZWF0IHx8IGZhbHNlXG4gICAgLy8gZXhwQ2FjaGUgd2lsbCBiZSBzaGFyZWQgYmV0d2VlbiB2LXJlcGVhdCBpbnN0YW5jZXNcbiAgICBjb21waWxlci5leHBDYWNoZSA9IGNvbXBpbGVyLmV4cENhY2hlIHx8IHt9XG5cbiAgICAvLyBpbml0aWFsaXplIGVsZW1lbnRcbiAgICB2YXIgZWwgPSBjb21waWxlci5lbCA9IGNvbXBpbGVyLnNldHVwRWxlbWVudChvcHRpb25zKVxuICAgIHV0aWxzLmxvZygnXFxubmV3IFZNIGluc3RhbmNlOiAnICsgZWwudGFnTmFtZSArICdcXG4nKVxuXG4gICAgLy8gc2V0IG90aGVyIGNvbXBpbGVyIHByb3BlcnRpZXNcbiAgICBjb21waWxlci52bSAgICAgICA9IGVsLnZ1ZV92bSA9IHZtXG4gICAgY29tcGlsZXIuYmluZGluZ3MgPSB1dGlscy5oYXNoKClcbiAgICBjb21waWxlci5kaXJzICAgICA9IFtdXG4gICAgY29tcGlsZXIuZGVmZXJyZWQgPSBbXVxuICAgIGNvbXBpbGVyLmNvbXB1dGVkID0gW11cbiAgICBjb21waWxlci5jaGlsZHJlbiA9IFtdXG4gICAgY29tcGlsZXIuZW1pdHRlciAgPSBuZXcgRW1pdHRlcih2bSlcblxuICAgIC8vIFZNIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gc2V0IFZNIHByb3BlcnRpZXNcbiAgICB2bS4kICAgICAgICAgPSB7fVxuICAgIHZtLiRlbCAgICAgICA9IGVsXG4gICAgdm0uJG9wdGlvbnMgID0gb3B0aW9uc1xuICAgIHZtLiRjb21waWxlciA9IGNvbXBpbGVyXG4gICAgdm0uJGV2ZW50ICAgID0gbnVsbFxuXG4gICAgLy8gc2V0IHBhcmVudCAmIHJvb3RcbiAgICB2YXIgcGFyZW50Vk0gPSBvcHRpb25zLnBhcmVudFxuICAgIGlmIChwYXJlbnRWTSkge1xuICAgICAgICBjb21waWxlci5wYXJlbnQgPSBwYXJlbnRWTS4kY29tcGlsZXJcbiAgICAgICAgcGFyZW50Vk0uJGNvbXBpbGVyLmNoaWxkcmVuLnB1c2goY29tcGlsZXIpXG4gICAgICAgIHZtLiRwYXJlbnQgPSBwYXJlbnRWTVxuICAgICAgICAvLyBpbmhlcml0IGxhenkgb3B0aW9uXG4gICAgICAgIGlmICghKCdsYXp5JyBpbiBvcHRpb25zKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5sYXp5ID0gY29tcGlsZXIucGFyZW50Lm9wdGlvbnMubGF6eVxuICAgICAgICB9XG4gICAgfVxuICAgIHZtLiRyb290ID0gZ2V0Um9vdChjb21waWxlcikudm1cblxuICAgIC8vIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gc2V0dXAgb2JzZXJ2ZXJcbiAgICAvLyB0aGlzIGlzIG5lY2VzYXJyeSBmb3IgYWxsIGhvb2tzIGFuZCBkYXRhIG9ic2VydmF0aW9uIGV2ZW50c1xuICAgIGNvbXBpbGVyLnNldHVwT2JzZXJ2ZXIoKVxuXG4gICAgLy8gY3JlYXRlIGJpbmRpbmdzIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzXG4gICAgaWYgKG9wdGlvbnMubWV0aG9kcykge1xuICAgICAgICBmb3IgKGtleSBpbiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLmNyZWF0ZUJpbmRpbmcoa2V5KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGJpbmRpbmdzIGZvciBtZXRob2RzXG4gICAgaWYgKG9wdGlvbnMuY29tcHV0ZWQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb3B0aW9ucy5jb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpbml0aWFsaXplIGRhdGFcbiAgICB2YXIgZGF0YSA9IGNvbXBpbGVyLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwge30sXG4gICAgICAgIGRlZmF1bHREYXRhID0gb3B0aW9ucy5kZWZhdWx0RGF0YVxuICAgIGlmIChkZWZhdWx0RGF0YSkge1xuICAgICAgICBmb3IgKGtleSBpbiBkZWZhdWx0RGF0YSkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd24uY2FsbChkYXRhLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtrZXldID0gZGVmYXVsdERhdGFba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29weSBwYXJhbUF0dHJpYnV0ZXNcbiAgICB2YXIgcGFyYW1zID0gb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIGkgPSBwYXJhbXMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGRhdGFbcGFyYW1zW2ldXSA9IHV0aWxzLmNoZWNrTnVtYmVyKFxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmV2YWwoXG4gICAgICAgICAgICAgICAgICAgIGVsLmdldEF0dHJpYnV0ZShwYXJhbXNbaV0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY29weSBkYXRhIHByb3BlcnRpZXMgdG8gdm1cbiAgICAvLyBzbyB1c2VyIGNhbiBhY2Nlc3MgdGhlbSBpbiB0aGUgY3JlYXRlZCBob29rXG4gICAgZXh0ZW5kKHZtLCBkYXRhKVxuICAgIHZtLiRkYXRhID0gZGF0YVxuXG4gICAgLy8gYmVmb3JlQ29tcGlsZSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ2NyZWF0ZWQnKVxuXG4gICAgLy8gdGhlIHVzZXIgbWlnaHQgaGF2ZSBzd2FwcGVkIHRoZSBkYXRhIC4uLlxuICAgIGRhdGEgPSBjb21waWxlci5kYXRhID0gdm0uJGRhdGFcblxuICAgIC8vIHVzZXIgbWlnaHQgYWxzbyBzZXQgc29tZSBwcm9wZXJ0aWVzIG9uIHRoZSB2bVxuICAgIC8vIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIGNvcHkgYmFjayB0byAkZGF0YVxuICAgIHZhciB2bVByb3BcbiAgICBmb3IgKGtleSBpbiB2bSkge1xuICAgICAgICB2bVByb3AgPSB2bVtrZXldXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGtleS5jaGFyQXQoMCkgIT09ICckJyAmJlxuICAgICAgICAgICAgZGF0YVtrZXldICE9PSB2bVByb3AgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2bVByb3AgIT09ICdmdW5jdGlvbidcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB2bVByb3BcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5vdyB3ZSBjYW4gb2JzZXJ2ZSB0aGUgZGF0YS5cbiAgICAvLyB0aGlzIHdpbGwgY29udmVydCBkYXRhIHByb3BlcnRpZXMgdG8gZ2V0dGVyL3NldHRlcnNcbiAgICAvLyBhbmQgZW1pdCB0aGUgZmlyc3QgYmF0Y2ggb2Ygc2V0IGV2ZW50cywgd2hpY2ggd2lsbFxuICAgIC8vIGluIHR1cm4gY3JlYXRlIHRoZSBjb3JyZXNwb25kaW5nIGJpbmRpbmdzLlxuICAgIGNvbXBpbGVyLm9ic2VydmVEYXRhKGRhdGEpXG5cbiAgICAvLyBDT01QSUxFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIGJlZm9yZSBjb21waWxpbmcsIHJlc29sdmUgY29udGVudCBpbnNlcnRpb24gcG9pbnRzXG4gICAgaWYgKG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlQ29udGVudCgpXG4gICAgfVxuXG4gICAgLy8gbm93IHBhcnNlIHRoZSBET00gYW5kIGJpbmQgZGlyZWN0aXZlcy5cbiAgICAvLyBEdXJpbmcgdGhpcyBzdGFnZSwgd2Ugd2lsbCBhbHNvIGNyZWF0ZSBiaW5kaW5ncyBmb3JcbiAgICAvLyBlbmNvdW50ZXJlZCBrZXlwYXRocyB0aGF0IGRvbid0IGhhdmUgYSBiaW5kaW5nIHlldC5cbiAgICBjb21waWxlci5jb21waWxlKGVsLCB0cnVlKVxuXG4gICAgLy8gQW55IGRpcmVjdGl2ZSB0aGF0IGNyZWF0ZXMgY2hpbGQgVk1zIGFyZSBkZWZlcnJlZFxuICAgIC8vIHNvIHRoYXQgd2hlbiB0aGV5IGFyZSBjb21waWxlZCwgYWxsIGJpbmRpbmdzIG9uIHRoZVxuICAgIC8vIHBhcmVudCBWTSBoYXZlIGJlZW4gY3JlYXRlZC5cbiAgICBpID0gY29tcGlsZXIuZGVmZXJyZWQubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb21waWxlci5iaW5kRGlyZWN0aXZlKGNvbXBpbGVyLmRlZmVycmVkW2ldKVxuICAgIH1cbiAgICBjb21waWxlci5kZWZlcnJlZCA9IG51bGxcblxuICAgIC8vIGV4dHJhY3QgZGVwZW5kZW5jaWVzIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzLlxuICAgIC8vIHRoaXMgd2lsbCBldmFsdWF0ZWQgYWxsIGNvbGxlY3RlZCBjb21wdXRlZCBiaW5kaW5nc1xuICAgIC8vIGFuZCBjb2xsZWN0IGdldCBldmVudHMgdGhhdCBhcmUgZW1pdHRlZC5cbiAgICBpZiAodGhpcy5jb21wdXRlZC5sZW5ndGgpIHtcbiAgICAgICAgRGVwc1BhcnNlci5wYXJzZSh0aGlzLmNvbXB1dGVkKVxuICAgIH1cblxuICAgIC8vIGRvbmUhXG4gICAgY29tcGlsZXIuaW5pdCA9IGZhbHNlXG5cbiAgICAvLyBwb3N0IGNvbXBpbGUgLyByZWFkeSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ3JlYWR5Jylcbn1cblxudmFyIENvbXBpbGVyUHJvdG8gPSBDb21waWxlci5wcm90b3R5cGVcblxuLyoqXG4gKiAgSW5pdGlhbGl6ZSB0aGUgVk0vQ29tcGlsZXIncyBlbGVtZW50LlxuICogIEZpbGwgaXQgaW4gd2l0aCB0aGUgdGVtcGxhdGUgaWYgbmVjZXNzYXJ5LlxuICovXG5Db21waWxlclByb3RvLnNldHVwRWxlbWVudCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgLy8gY3JlYXRlIHRoZSBub2RlIGZpcnN0XG4gICAgdmFyIGVsID0gdHlwZW9mIG9wdGlvbnMuZWwgPT09ICdzdHJpbmcnXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmVsKVxuICAgICAgICA6IG9wdGlvbnMuZWwgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRpb25zLnRhZ05hbWUgfHwgJ2RpdicpXG5cbiAgICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlLFxuICAgICAgICBjaGlsZCwgcmVwbGFjZXIsIGksIGF0dHIsIGF0dHJzXG5cbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgLy8gY29sbGVjdCBhbnl0aGluZyBhbHJlYWR5IGluIHRoZXJlXG4gICAgICAgIGlmIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMucmF3Q29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgICAgICAgICAgd2hpbGUgKGNoaWxkID0gZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmF3Q29udGVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZXBsYWNlIG9wdGlvbjogdXNlIHRoZSBmaXJzdCBub2RlIGluXG4gICAgICAgIC8vIHRoZSB0ZW1wbGF0ZSBkaXJlY3RseVxuICAgICAgICBpZiAob3B0aW9ucy5yZXBsYWNlICYmIHRlbXBsYXRlLmZpcnN0Q2hpbGQgPT09IHRlbXBsYXRlLmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgcmVwbGFjZXIgPSB0ZW1wbGF0ZS5maXJzdENoaWxkLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyZXBsYWNlciwgZWwpXG4gICAgICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvcHkgb3ZlciBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgICAgICAgICAgICAgaSA9IGVsLmF0dHJpYnV0ZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyID0gZWwuYXR0cmlidXRlc1tpXVxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlci5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlcGxhY2VcbiAgICAgICAgICAgIGVsID0gcmVwbGFjZXJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gYXBwbHkgZWxlbWVudCBvcHRpb25zXG4gICAgaWYgKG9wdGlvbnMuaWQpIGVsLmlkID0gb3B0aW9ucy5pZFxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkgZWwuY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWVcbiAgICBhdHRycyA9IG9wdGlvbnMuYXR0cmlidXRlc1xuICAgIGlmIChhdHRycykge1xuICAgICAgICBmb3IgKGF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbFxufVxuXG4vKipcbiAqICBEZWFsIHdpdGggPGNvbnRlbnQ+IGluc2VydGlvbiBwb2ludHNcbiAqICBwZXIgdGhlIFdlYiBDb21wb25lbnRzIHNwZWNcbiAqL1xuQ29tcGlsZXJQcm90by5yZXNvbHZlQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBvdXRsZXRzID0gc2xpY2UuY2FsbCh0aGlzLmVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjb250ZW50JykpLFxuICAgICAgICByYXcgPSB0aGlzLnJhd0NvbnRlbnQsXG4gICAgICAgIG91dGxldCwgc2VsZWN0LCBpLCBqLCBtYWluXG5cbiAgICBpID0gb3V0bGV0cy5sZW5ndGhcbiAgICBpZiAoaSkge1xuICAgICAgICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IGNvcnJlc3BvbmRpbmcgY29udGVudFxuICAgICAgICAvLyBmb3IgZWFjaCBvdXRsZXQuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3QgPSBvdXRsZXQuZ2V0QXR0cmlidXRlKCdzZWxlY3QnKVxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3QpIHsgLy8gc2VsZWN0IGNvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgb3V0bGV0LmNvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2UuY2FsbChyYXcucXVlcnlTZWxlY3RvckFsbChzZWxlY3QpKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGRlZmF1bHQgY29udGVudFxuICAgICAgICAgICAgICAgICAgICBtYWluID0gb3V0bGV0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gZmFsbGJhY2sgY29udGVudFxuICAgICAgICAgICAgICAgIG91dGxldC5jb250ZW50ID1cbiAgICAgICAgICAgICAgICAgICAgc2xpY2UuY2FsbChvdXRsZXQuY2hpbGROb2RlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzZWNvbmQgcGFzcywgYWN0dWFsbHkgaW5zZXJ0IHRoZSBjb250ZW50c1xuICAgICAgICBmb3IgKGkgPSAwLCBqID0gb3V0bGV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICAgICAgICAgIGlmIChvdXRsZXQgPT09IG1haW4pIGNvbnRpbnVlXG4gICAgICAgICAgICBpbnNlcnQob3V0bGV0LCBvdXRsZXQuY29udGVudClcbiAgICAgICAgfVxuICAgICAgICAvLyBmaW5hbGx5IGluc2VydCB0aGUgbWFpbiBjb250ZW50XG4gICAgICAgIGlmIChyYXcgJiYgbWFpbikge1xuICAgICAgICAgICAgaW5zZXJ0KG1haW4sIHNsaWNlLmNhbGwocmF3LmNoaWxkTm9kZXMpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zZXJ0IChvdXRsZXQsIGNvbnRlbnRzKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSBvdXRsZXQucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIGkgPSAwLCBqID0gY29udGVudHMubGVuZ3RoXG4gICAgICAgIGZvciAoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnRzW2ldLCBvdXRsZXQpXG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG91dGxldClcbiAgICB9XG5cbiAgICB0aGlzLnJhd0NvbnRlbnQgPSBudWxsXG59XG5cbi8qKlxuICogIFNldHVwIG9ic2VydmVyLlxuICogIFRoZSBvYnNlcnZlciBsaXN0ZW5zIGZvciBnZXQvc2V0L211dGF0ZSBldmVudHMgb24gYWxsIFZNXG4gKiAgdmFsdWVzL29iamVjdHMgYW5kIHRyaWdnZXIgY29ycmVzcG9uZGluZyBiaW5kaW5nIHVwZGF0ZXMuXG4gKiAgSXQgYWxzbyBsaXN0ZW5zIGZvciBsaWZlY3ljbGUgaG9va3MuXG4gKi9cbkNvbXBpbGVyUHJvdG8uc2V0dXBPYnNlcnZlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGJpbmRpbmdzID0gY29tcGlsZXIuYmluZGluZ3MsXG4gICAgICAgIG9wdGlvbnMgID0gY29tcGlsZXIub3B0aW9ucyxcbiAgICAgICAgb2JzZXJ2ZXIgPSBjb21waWxlci5vYnNlcnZlciA9IG5ldyBFbWl0dGVyKGNvbXBpbGVyLnZtKVxuXG4gICAgLy8gYSBoYXNoIHRvIGhvbGQgZXZlbnQgcHJveGllcyBmb3IgZWFjaCByb290IGxldmVsIGtleVxuICAgIC8vIHNvIHRoZXkgY2FuIGJlIHJlZmVyZW5jZWQgYW5kIHJlbW92ZWQgbGF0ZXJcbiAgICBvYnNlcnZlci5wcm94aWVzID0ge31cblxuICAgIC8vIGFkZCBvd24gbGlzdGVuZXJzIHdoaWNoIHRyaWdnZXIgYmluZGluZyB1cGRhdGVzXG4gICAgb2JzZXJ2ZXJcbiAgICAgICAgLm9uKCdnZXQnLCBvbkdldClcbiAgICAgICAgLm9uKCdzZXQnLCBvblNldClcbiAgICAgICAgLm9uKCdtdXRhdGUnLCBvblNldClcblxuICAgIC8vIHJlZ2lzdGVyIGhvb2tzXG4gICAgdmFyIGkgPSBob29rcy5sZW5ndGgsIGosIGhvb2ssIGZuc1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaG9vayA9IGhvb2tzW2ldXG4gICAgICAgIGZucyA9IG9wdGlvbnNbaG9va11cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZm5zKSkge1xuICAgICAgICAgICAgaiA9IGZucy5sZW5ndGhcbiAgICAgICAgICAgIC8vIHNpbmNlIGhvb2tzIHdlcmUgbWVyZ2VkIHdpdGggY2hpbGQgYXQgaGVhZCxcbiAgICAgICAgICAgIC8vIHdlIGxvb3AgcmV2ZXJzZWx5LlxuICAgICAgICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVySG9vayhob29rLCBmbnNbal0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZm5zKSB7XG4gICAgICAgICAgICByZWdpc3Rlckhvb2soaG9vaywgZm5zKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYnJvYWRjYXN0IGF0dGFjaGVkL2RldGFjaGVkIGhvb2tzXG4gICAgb2JzZXJ2ZXJcbiAgICAgICAgLm9uKCdob29rOmF0dGFjaGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnJvYWRjYXN0KDEpXG4gICAgICAgIH0pXG4gICAgICAgIC5vbignaG9vazpkZXRhY2hlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJyb2FkY2FzdCgwKVxuICAgICAgICB9KVxuXG4gICAgZnVuY3Rpb24gb25HZXQgKGtleSkge1xuICAgICAgICBjaGVjayhrZXkpXG4gICAgICAgIERlcHNQYXJzZXIuY2F0Y2hlci5lbWl0KCdnZXQnLCBiaW5kaW5nc1trZXldKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uU2V0IChrZXksIHZhbCwgbXV0YXRpb24pIHtcbiAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnY2hhbmdlOicgKyBrZXksIHZhbCwgbXV0YXRpb24pXG4gICAgICAgIGNoZWNrKGtleSlcbiAgICAgICAgYmluZGluZ3Nba2V5XS51cGRhdGUodmFsKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVySG9vayAoaG9vaywgZm4pIHtcbiAgICAgICAgb2JzZXJ2ZXIub24oJ2hvb2s6JyArIGhvb2ssIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY29tcGlsZXIudm0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnJvYWRjYXN0IChldmVudCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBjb21waWxlci5jaGlsZHJlblxuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCwgaSA9IGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudCA9ICdob29rOicgKyAoZXZlbnQgPyAnYXR0YWNoZWQnIDogJ2RldGFjaGVkJylcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQub2JzZXJ2ZXIuZW1pdChldmVudClcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuZW1pdHRlci5lbWl0KGV2ZW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrIChrZXkpIHtcbiAgICAgICAgaWYgKCFiaW5kaW5nc1trZXldKSB7XG4gICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQ29tcGlsZXJQcm90by5vYnNlcnZlRGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBvYnNlcnZlciA9IGNvbXBpbGVyLm9ic2VydmVyXG5cbiAgICAvLyByZWN1cnNpdmVseSBvYnNlcnZlIG5lc3RlZCBwcm9wZXJ0aWVzXG4gICAgT2JzZXJ2ZXIub2JzZXJ2ZShkYXRhLCAnJywgb2JzZXJ2ZXIpXG5cbiAgICAvLyBhbHNvIGNyZWF0ZSBiaW5kaW5nIGZvciB0b3AgbGV2ZWwgJGRhdGFcbiAgICAvLyBzbyBpdCBjYW4gYmUgdXNlZCBpbiB0ZW1wbGF0ZXMgdG9vXG4gICAgdmFyICRkYXRhQmluZGluZyA9IGNvbXBpbGVyLmJpbmRpbmdzWyckZGF0YSddID0gbmV3IEJpbmRpbmcoY29tcGlsZXIsICckZGF0YScpXG4gICAgJGRhdGFCaW5kaW5nLnVwZGF0ZShkYXRhKVxuXG4gICAgLy8gYWxsb3cgJGRhdGEgdG8gYmUgc3dhcHBlZFxuICAgIGRlZihjb21waWxlci52bSwgJyRkYXRhJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBpbGVyLm9ic2VydmVyLmVtaXQoJ2dldCcsICckZGF0YScpXG4gICAgICAgICAgICByZXR1cm4gY29tcGlsZXIuZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICAgICAgICB2YXIgb2xkRGF0YSA9IGNvbXBpbGVyLmRhdGFcbiAgICAgICAgICAgIE9ic2VydmVyLnVub2JzZXJ2ZShvbGREYXRhLCAnJywgb2JzZXJ2ZXIpXG4gICAgICAgICAgICBjb21waWxlci5kYXRhID0gbmV3RGF0YVxuICAgICAgICAgICAgT2JzZXJ2ZXIuY29weVBhdGhzKG5ld0RhdGEsIG9sZERhdGEpXG4gICAgICAgICAgICBPYnNlcnZlci5vYnNlcnZlKG5ld0RhdGEsICcnLCBvYnNlcnZlcilcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gZW1pdCAkZGF0YSBjaGFuZ2Ugb24gYWxsIGNoYW5nZXNcbiAgICBvYnNlcnZlclxuICAgICAgICAub24oJ3NldCcsIG9uU2V0KVxuICAgICAgICAub24oJ211dGF0ZScsIG9uU2V0KVxuXG4gICAgZnVuY3Rpb24gb25TZXQgKGtleSkge1xuICAgICAgICBpZiAoa2V5ICE9PSAnJGRhdGEnKSB1cGRhdGUoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gICAgICAgICRkYXRhQmluZGluZy51cGRhdGUoY29tcGlsZXIuZGF0YSlcbiAgICAgICAgb2JzZXJ2ZXIuZW1pdCgnY2hhbmdlOiRkYXRhJywgY29tcGlsZXIuZGF0YSlcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgYSBET00gbm9kZSAocmVjdXJzaXZlKVxuICovXG5Db21waWxlclByb3RvLmNvbXBpbGUgPSBmdW5jdGlvbiAobm9kZSwgcm9vdCkge1xuICAgIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGVcbiAgICBpZiAobm9kZVR5cGUgPT09IDEgJiYgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJykgeyAvLyBhIG5vcm1hbCBub2RlXG4gICAgICAgIHRoaXMuY29tcGlsZUVsZW1lbnQobm9kZSwgcm9vdClcbiAgICB9IGVsc2UgaWYgKG5vZGVUeXBlID09PSAzICYmIGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgICB0aGlzLmNvbXBpbGVUZXh0Tm9kZShub2RlKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQ2hlY2sgZm9yIGEgcHJpb3JpdHkgZGlyZWN0aXZlXG4gKiAgSWYgaXQgaXMgcHJlc2VudCBhbmQgdmFsaWQsIHJldHVybiB0cnVlIHRvIHNraXAgdGhlIHJlc3RcbiAqL1xuQ29tcGlsZXJQcm90by5jaGVja1ByaW9yaXR5RGlyID0gZnVuY3Rpb24gKGRpcm5hbWUsIG5vZGUsIHJvb3QpIHtcbiAgICB2YXIgZXhwcmVzc2lvbiwgZGlyZWN0aXZlLCBDdG9yXG4gICAgaWYgKFxuICAgICAgICBkaXJuYW1lID09PSAnY29tcG9uZW50JyAmJlxuICAgICAgICByb290ICE9PSB0cnVlICYmXG4gICAgICAgIChDdG9yID0gdGhpcy5yZXNvbHZlQ29tcG9uZW50KG5vZGUsIHVuZGVmaW5lZCwgdHJ1ZSkpXG4gICAgKSB7XG4gICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoZGlybmFtZSwgJycsIG5vZGUpXG4gICAgICAgIGRpcmVjdGl2ZS5DdG9yID0gQ3RvclxuICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cHJlc3Npb24gPSB1dGlscy5hdHRyKG5vZGUsIGRpcm5hbWUpXG4gICAgICAgIGRpcmVjdGl2ZSA9IGV4cHJlc3Npb24gJiYgdGhpcy5wYXJzZURpcmVjdGl2ZShkaXJuYW1lLCBleHByZXNzaW9uLCBub2RlKVxuICAgIH1cbiAgICBpZiAoZGlyZWN0aXZlKSB7XG4gICAgICAgIGlmIChyb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKFxuICAgICAgICAgICAgICAgICdEaXJlY3RpdmUgdi0nICsgZGlybmFtZSArICcgY2Fubm90IGJlIHVzZWQgb24gYW4gYWxyZWFkeSBpbnN0YW50aWF0ZWQgJyArXG4gICAgICAgICAgICAgICAgJ1ZNXFwncyByb290IG5vZGUuIFVzZSBpdCBmcm9tIHRoZSBwYXJlbnRcXCdzIHRlbXBsYXRlIGluc3RlYWQuJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWZlcnJlZC5wdXNoKGRpcmVjdGl2ZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgbm9ybWFsIGRpcmVjdGl2ZXMgb24gYSBub2RlXG4gKi9cbkNvbXBpbGVyUHJvdG8uY29tcGlsZUVsZW1lbnQgPSBmdW5jdGlvbiAobm9kZSwgcm9vdCkge1xuXG4gICAgLy8gdGV4dGFyZWEgaXMgcHJldHR5IGFubm95aW5nXG4gICAgLy8gYmVjYXVzZSBpdHMgdmFsdWUgY3JlYXRlcyBjaGlsZE5vZGVzIHdoaWNoXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBjb21waWxlLlxuICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdURVhUQVJFQScgJiYgbm9kZS52YWx1ZSkge1xuICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5ldmFsKG5vZGUudmFsdWUpXG4gICAgfVxuXG4gICAgLy8gb25seSBjb21waWxlIGlmIHRoaXMgZWxlbWVudCBoYXMgYXR0cmlidXRlc1xuICAgIC8vIG9yIGl0cyB0YWdOYW1lIGNvbnRhaW5zIGEgaHlwaGVuICh3aGljaCBtZWFucyBpdCBjb3VsZFxuICAgIC8vIHBvdGVudGlhbGx5IGJlIGEgY3VzdG9tIGVsZW1lbnQpXG4gICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlcygpIHx8IG5vZGUudGFnTmFtZS5pbmRleE9mKCctJykgPiAtMSkge1xuXG4gICAgICAgIC8vIHNraXAgYW55dGhpbmcgd2l0aCB2LXByZVxuICAgICAgICBpZiAodXRpbHMuYXR0cihub2RlLCAncHJlJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGksIGwsIGosIGtcblxuICAgICAgICAvLyBjaGVjayBwcmlvcml0eSBkaXJlY3RpdmVzLlxuICAgICAgICAvLyBpZiBhbnkgb2YgdGhlbSBhcmUgcHJlc2VudCwgaXQgd2lsbCB0YWtlIG92ZXIgdGhlIG5vZGUgd2l0aCBhIGNoaWxkVk1cbiAgICAgICAgLy8gc28gd2UgY2FuIHNraXAgdGhlIHJlc3RcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHByaW9yaXR5RGlyZWN0aXZlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUHJpb3JpdHlEaXIocHJpb3JpdHlEaXJlY3RpdmVzW2ldLCBub2RlLCByb290KSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdHJhbnNpdGlvbiAmIGFuaW1hdGlvbiBwcm9wZXJ0aWVzXG4gICAgICAgIG5vZGUudnVlX3RyYW5zICA9IHV0aWxzLmF0dHIobm9kZSwgJ3RyYW5zaXRpb24nKVxuICAgICAgICBub2RlLnZ1ZV9hbmltICAgPSB1dGlscy5hdHRyKG5vZGUsICdhbmltYXRpb24nKVxuICAgICAgICBub2RlLnZ1ZV9lZmZlY3QgPSB0aGlzLmV2YWwodXRpbHMuYXR0cihub2RlLCAnZWZmZWN0JykpXG5cbiAgICAgICAgdmFyIHByZWZpeCA9IGNvbmZpZy5wcmVmaXggKyAnLScsXG4gICAgICAgICAgICBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzLFxuICAgICAgICAgICAgYXR0ciwgYXR0cm5hbWUsIGlzRGlyZWN0aXZlLCBleHAsIGRpcmVjdGl2ZXMsIGRpcmVjdGl2ZSwgZGlybmFtZVxuXG4gICAgICAgIC8vIHYtd2l0aCBoYXMgc3BlY2lhbCBwcmlvcml0eSBhbW9uZyB0aGUgcmVzdFxuICAgICAgICAvLyBpdCBuZWVkcyB0byBwdWxsIGluIHRoZSB2YWx1ZSBmcm9tIHRoZSBwYXJlbnQgYmVmb3JlXG4gICAgICAgIC8vIGNvbXB1dGVkIHByb3BlcnRpZXMgYXJlIGV2YWx1YXRlZCwgYmVjYXVzZSBhdCB0aGlzIHN0YWdlXG4gICAgICAgIC8vIHRoZSBjb21wdXRlZCBwcm9wZXJ0aWVzIGhhdmUgbm90IHNldCB1cCB0aGVpciBkZXBlbmRlbmNpZXMgeWV0LlxuICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgdmFyIHdpdGhFeHAgPSB1dGlscy5hdHRyKG5vZGUsICd3aXRoJylcbiAgICAgICAgICAgIGlmICh3aXRoRXhwKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlcyA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ3dpdGgnLCB3aXRoRXhwLCBub2RlLCB0cnVlKVxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGsgPSBkaXJlY3RpdmVzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREaXJlY3RpdmUoZGlyZWN0aXZlc1tqXSwgdGhpcy5wYXJlbnQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGF0dHJzID0gc2xpY2UuY2FsbChub2RlLmF0dHJpYnV0ZXMpXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblxuICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2ldXG4gICAgICAgICAgICBhdHRybmFtZSA9IGF0dHIubmFtZVxuICAgICAgICAgICAgaXNEaXJlY3RpdmUgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiAoYXR0cm5hbWUuaW5kZXhPZihwcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gYSBkaXJlY3RpdmUgLSBzcGxpdCwgcGFyc2UgYW5kIGJpbmQgaXQuXG4gICAgICAgICAgICAgICAgaXNEaXJlY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgZGlybmFtZSA9IGF0dHJuYW1lLnNsaWNlKHByZWZpeC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgd2l0aCBtdWx0aXBsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKGRpcm5hbWUsIGF0dHIudmFsdWUsIG5vZGUsIHRydWUpXG4gICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGNsYXVzZXMgKHNlcGFyYXRlZCBieSBcIixcIilcbiAgICAgICAgICAgICAgICAvLyBpbnNpZGUgZWFjaCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBrID0gZGlyZWN0aXZlcy5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZXNbal0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcuaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBub24gZGlyZWN0aXZlIGF0dHJpYnV0ZSwgY2hlY2sgaW50ZXJwb2xhdGlvbiB0YWdzXG4gICAgICAgICAgICAgICAgZXhwID0gVGV4dFBhcnNlci5wYXJzZUF0dHIoYXR0ci52YWx1ZSlcbiAgICAgICAgICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHRoaXMucGFyc2VEaXJlY3RpdmUoJ2F0dHInLCBleHAsIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5hcmcgPSBhdHRybmFtZVxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5pbmRleE9mKGF0dHJuYW1lKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIHBhcmFtIGF0dHJpYnV0ZS4uLiB3ZSBzaG91bGQgdXNlIHRoZSBwYXJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgY2lyY3VsYXIgdXBkYXRlcyBsaWtlIHNpemU9e3tzaXplfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERpcmVjdGl2ZShkaXJlY3RpdmUsIHRoaXMucGFyZW50KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzRGlyZWN0aXZlICYmIGRpcm5hbWUgIT09ICdjbG9haycpIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRybmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy8gcmVjdXJzaXZlbHkgY29tcGlsZSBjaGlsZE5vZGVzXG4gICAgaWYgKG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIHNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKHRoaXMuY29tcGlsZSwgdGhpcylcbiAgICB9XG59XG5cbi8qKlxuICogIENvbXBpbGUgYSB0ZXh0IG5vZGVcbiAqL1xuQ29tcGlsZXJQcm90by5jb21waWxlVGV4dE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuXG4gICAgdmFyIHRva2VucyA9IFRleHRQYXJzZXIucGFyc2Uobm9kZS5ub2RlVmFsdWUpXG4gICAgaWYgKCF0b2tlbnMpIHJldHVyblxuICAgIHZhciBlbCwgdG9rZW4sIGRpcmVjdGl2ZVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgICAgZGlyZWN0aXZlID0gbnVsbFxuXG4gICAgICAgIGlmICh0b2tlbi5rZXkpIHsgLy8gYSBiaW5kaW5nXG4gICAgICAgICAgICBpZiAodG9rZW4ua2V5LmNoYXJBdCgwKSA9PT0gJz4nKSB7IC8vIGEgcGFydGlhbFxuICAgICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgncmVmJylcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCdwYXJ0aWFsJywgdG9rZW4ua2V5LnNsaWNlKDEpLCBlbClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbi5odG1sKSB7IC8vIHRleHQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCd0ZXh0JywgdG9rZW4ua2V5LCBlbClcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBodG1sIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KGNvbmZpZy5wcmVmaXggKyAnLWh0bWwnKVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCdodG1sJywgdG9rZW4ua2V5LCBlbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGEgcGxhaW4gc3RyaW5nXG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5zZXJ0IG5vZGVcbiAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgbm9kZSlcbiAgICAgICAgLy8gYmluZCBkaXJlY3RpdmVcbiAgICAgICAgdGhpcy5iaW5kRGlyZWN0aXZlKGRpcmVjdGl2ZSlcblxuICAgIH1cbiAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSlcbn1cblxuLyoqXG4gKiAgUGFyc2UgYSBkaXJlY3RpdmUgbmFtZS92YWx1ZSBwYWlyIGludG8gb25lIG9yIG1vcmVcbiAqICBkaXJlY3RpdmUgaW5zdGFuY2VzXG4gKi9cbkNvbXBpbGVyUHJvdG8ucGFyc2VEaXJlY3RpdmUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGVsLCBtdWx0aXBsZSkge1xuICAgIHZhciBjb21waWxlciA9IHRoaXMsXG4gICAgICAgIGRlZmluaXRpb24gPSBjb21waWxlci5nZXRPcHRpb24oJ2RpcmVjdGl2ZXMnLCBuYW1lKVxuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIC8vIHBhcnNlIGludG8gQVNULWxpa2Ugb2JqZWN0c1xuICAgICAgICB2YXIgYXN0cyA9IERpcmVjdGl2ZS5wYXJzZSh2YWx1ZSlcbiAgICAgICAgcmV0dXJuIG11bHRpcGxlXG4gICAgICAgICAgICA/IGFzdHMubWFwKGJ1aWxkKVxuICAgICAgICAgICAgOiBidWlsZChhc3RzWzBdKVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZCAoYXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgRGlyZWN0aXZlKG5hbWUsIGFzdCwgZGVmaW5pdGlvbiwgY29tcGlsZXIsIGVsKVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQWRkIGEgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBjb3JyZWN0IGJpbmRpbmcgJiB2aWV3bW9kZWxcbiAqL1xuQ29tcGlsZXJQcm90by5iaW5kRGlyZWN0aXZlID0gZnVuY3Rpb24gKGRpcmVjdGl2ZSwgYmluZGluZ093bmVyKSB7XG5cbiAgICBpZiAoIWRpcmVjdGl2ZSkgcmV0dXJuXG5cbiAgICAvLyBrZWVwIHRyYWNrIG9mIGl0IHNvIHdlIGNhbiB1bmJpbmQoKSBsYXRlclxuICAgIHRoaXMuZGlycy5wdXNoKGRpcmVjdGl2ZSlcblxuICAgIC8vIGZvciBlbXB0eSBvciBsaXRlcmFsIGRpcmVjdGl2ZXMsIHNpbXBseSBjYWxsIGl0cyBiaW5kKClcbiAgICAvLyBhbmQgd2UncmUgZG9uZS5cbiAgICBpZiAoZGlyZWN0aXZlLmlzRW1wdHkgfHwgZGlyZWN0aXZlLmlzTGl0ZXJhbCkge1xuICAgICAgICBpZiAoZGlyZWN0aXZlLmJpbmQpIGRpcmVjdGl2ZS5iaW5kKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gb3RoZXJ3aXNlLCB3ZSBnb3QgbW9yZSB3b3JrIHRvIGRvLi4uXG4gICAgdmFyIGJpbmRpbmcsXG4gICAgICAgIGNvbXBpbGVyID0gYmluZGluZ093bmVyIHx8IHRoaXMsXG4gICAgICAgIGtleSAgICAgID0gZGlyZWN0aXZlLmtleVxuXG4gICAgaWYgKGRpcmVjdGl2ZS5pc0V4cCkge1xuICAgICAgICAvLyBleHByZXNzaW9uIGJpbmRpbmdzIGFyZSBhbHdheXMgY3JlYXRlZCBvbiBjdXJyZW50IGNvbXBpbGVyXG4gICAgICAgIGJpbmRpbmcgPSBjb21waWxlci5jcmVhdGVCaW5kaW5nKGtleSwgZGlyZWN0aXZlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGxvY2F0ZSB3aGljaCBjb21waWxlciBvd25zIHRoZSBiaW5kaW5nXG4gICAgICAgIHdoaWxlIChjb21waWxlcikge1xuICAgICAgICAgICAgaWYgKGNvbXBpbGVyLmhhc0tleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21waWxlciA9IGNvbXBpbGVyIHx8IHRoaXNcbiAgICAgICAgYmluZGluZyA9IGNvbXBpbGVyLmJpbmRpbmdzW2tleV0gfHwgY29tcGlsZXIuY3JlYXRlQmluZGluZyhrZXkpXG4gICAgfVxuICAgIGJpbmRpbmcuZGlycy5wdXNoKGRpcmVjdGl2ZSlcbiAgICBkaXJlY3RpdmUuYmluZGluZyA9IGJpbmRpbmdcblxuICAgIHZhciB2YWx1ZSA9IGJpbmRpbmcudmFsKClcbiAgICAvLyBpbnZva2UgYmluZCBob29rIGlmIGV4aXN0c1xuICAgIGlmIChkaXJlY3RpdmUuYmluZCkge1xuICAgICAgICBkaXJlY3RpdmUuYmluZCh2YWx1ZSlcbiAgICB9XG4gICAgLy8gc2V0IGluaXRpYWwgdmFsdWVcbiAgICBkaXJlY3RpdmUuJHVwZGF0ZSh2YWx1ZSwgdHJ1ZSlcbn1cblxuLyoqXG4gKiAgQ3JlYXRlIGJpbmRpbmcgYW5kIGF0dGFjaCBnZXR0ZXIvc2V0dGVyIGZvciBhIGtleSB0byB0aGUgdmlld21vZGVsIG9iamVjdFxuICovXG5Db21waWxlclByb3RvLmNyZWF0ZUJpbmRpbmcgPSBmdW5jdGlvbiAoa2V5LCBkaXJlY3RpdmUpIHtcblxuICAgIHV0aWxzLmxvZygnICBjcmVhdGVkIGJpbmRpbmc6ICcgKyBrZXkpXG5cbiAgICB2YXIgY29tcGlsZXIgPSB0aGlzLFxuICAgICAgICBtZXRob2RzICA9IGNvbXBpbGVyLm9wdGlvbnMubWV0aG9kcyxcbiAgICAgICAgaXNFeHAgICAgPSBkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLmlzRXhwLFxuICAgICAgICBpc0ZuICAgICA9IChkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLmlzRm4pIHx8IChtZXRob2RzICYmIG1ldGhvZHNba2V5XSksXG4gICAgICAgIGJpbmRpbmdzID0gY29tcGlsZXIuYmluZGluZ3MsXG4gICAgICAgIGNvbXB1dGVkID0gY29tcGlsZXIub3B0aW9ucy5jb21wdXRlZCxcbiAgICAgICAgYmluZGluZyAgPSBuZXcgQmluZGluZyhjb21waWxlciwga2V5LCBpc0V4cCwgaXNGbilcblxuICAgIGlmIChpc0V4cCkge1xuICAgICAgICAvLyBleHByZXNzaW9uIGJpbmRpbmdzIGFyZSBhbm9ueW1vdXNcbiAgICAgICAgY29tcGlsZXIuZGVmaW5lRXhwKGtleSwgYmluZGluZywgZGlyZWN0aXZlKVxuICAgIH0gZWxzZSBpZiAoaXNGbikge1xuICAgICAgICBiaW5kaW5nc1trZXldID0gYmluZGluZ1xuICAgICAgICBjb21waWxlci5kZWZpbmVWbVByb3Aoa2V5LCBiaW5kaW5nLCBtZXRob2RzW2tleV0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYmluZGluZ3Nba2V5XSA9IGJpbmRpbmdcbiAgICAgICAgaWYgKGJpbmRpbmcucm9vdCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBhIHJvb3QgbGV2ZWwgYmluZGluZy4gd2UgbmVlZCB0byBkZWZpbmUgZ2V0dGVyL3NldHRlcnMgZm9yIGl0LlxuICAgICAgICAgICAgaWYgKGNvbXB1dGVkICYmIGNvbXB1dGVkW2tleV0pIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlZCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIGNvbXBpbGVyLmRlZmluZUNvbXB1dGVkKGtleSwgYmluZGluZywgY29tcHV0ZWRba2V5XSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5LmNoYXJBdCgwKSAhPT0gJyQnKSB7XG4gICAgICAgICAgICAgICAgLy8gbm9ybWFsIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgY29tcGlsZXIuZGVmaW5lRGF0YVByb3Aoa2V5LCBiaW5kaW5nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIHRoYXQgc3RhcnQgd2l0aCAkIGFyZSBtZXRhIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAvLyB0aGV5IHNob3VsZCBiZSBrZXB0IG9uIHRoZSB2bSBidXQgbm90IGluIHRoZSBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgICAgICBjb21waWxlci5kZWZpbmVWbVByb3Aoa2V5LCBiaW5kaW5nLCBjb21waWxlci5kYXRhW2tleV0pXG4gICAgICAgICAgICAgICAgZGVsZXRlIGNvbXBpbGVyLmRhdGFba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvbXB1dGVkICYmIGNvbXB1dGVkW3V0aWxzLmJhc2VLZXkoa2V5KV0pIHtcbiAgICAgICAgICAgIC8vIG5lc3RlZCBwYXRoIG9uIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICBjb21waWxlci5kZWZpbmVFeHAoa2V5LCBiaW5kaW5nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZW5zdXJlIHBhdGggaW4gZGF0YSBzbyB0aGF0IGNvbXB1dGVkIHByb3BlcnRpZXMgdGhhdFxuICAgICAgICAgICAgLy8gYWNjZXNzIHRoZSBwYXRoIGRvbid0IHRocm93IGFuIGVycm9yIGFuZCBjYW4gY29sbGVjdFxuICAgICAgICAgICAgLy8gZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICBPYnNlcnZlci5lbnN1cmVQYXRoKGNvbXBpbGVyLmRhdGEsIGtleSlcbiAgICAgICAgICAgIHZhciBwYXJlbnRLZXkgPSBrZXkuc2xpY2UoMCwga2V5Lmxhc3RJbmRleE9mKCcuJykpXG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdzW3BhcmVudEtleV0pIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGEgbmVzdGVkIHZhbHVlIGJpbmRpbmcsIGJ1dCB0aGUgYmluZGluZyBmb3IgaXRzIHBhcmVudFxuICAgICAgICAgICAgICAgIC8vIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldC4gV2UgYmV0dGVyIGNyZWF0ZSB0aGF0IG9uZSB0b28uXG4gICAgICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhwYXJlbnRLZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmRpbmdcbn1cblxuLyoqXG4gKiAgRGVmaW5lIHRoZSBnZXR0ZXIvc2V0dGVyIHRvIHByb3h5IGEgcm9vdC1sZXZlbFxuICogIGRhdGEgcHJvcGVydHkgb24gdGhlIFZNXG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lRGF0YVByb3AgPSBmdW5jdGlvbiAoa2V5LCBiaW5kaW5nKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgZGF0YSAgICAgPSBjb21waWxlci5kYXRhLFxuICAgICAgICBvYiAgICAgICA9IGRhdGEuX19lbWl0dGVyX19cblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUga2V5IGlzIHByZXNlbnQgaW4gZGF0YVxuICAgIC8vIHNvIGl0IGNhbiBiZSBvYnNlcnZlZFxuICAgIGlmICghKGhhc093bi5jYWxsKGRhdGEsIGtleSkpKSB7XG4gICAgICAgIGRhdGFba2V5XSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBkYXRhIG9iamVjdCBpcyBhbHJlYWR5IG9ic2VydmVkLCBidXQgdGhlIGtleVxuICAgIC8vIGlzIG5vdCBvYnNlcnZlZCwgd2UgbmVlZCB0byBhZGQgaXQgdG8gdGhlIG9ic2VydmVkIGtleXMuXG4gICAgaWYgKG9iICYmICEoaGFzT3duLmNhbGwob2IudmFsdWVzLCBrZXkpKSkge1xuICAgICAgICBPYnNlcnZlci5jb252ZXJ0S2V5KGRhdGEsIGtleSlcbiAgICB9XG5cbiAgICBiaW5kaW5nLnZhbHVlID0gZGF0YVtrZXldXG5cbiAgICBkZWYoY29tcGlsZXIudm0sIGtleSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21waWxlci5kYXRhW2tleV1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBjb21waWxlci5kYXRhW2tleV0gPSB2YWxcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICogIERlZmluZSBhIHZtIHByb3BlcnR5LCBlLmcuICRpbmRleCwgJGtleSwgb3IgbWl4aW4gbWV0aG9kc1xuICogIHdoaWNoIGFyZSBiaW5kYWJsZSBidXQgb25seSBhY2Nlc3NpYmxlIG9uIHRoZSBWTSxcbiAqICBub3QgaW4gdGhlIGRhdGEuXG4gKi9cbkNvbXBpbGVyUHJvdG8uZGVmaW5lVm1Qcm9wID0gZnVuY3Rpb24gKGtleSwgYmluZGluZywgdmFsdWUpIHtcbiAgICB2YXIgb2IgPSB0aGlzLm9ic2VydmVyXG4gICAgYmluZGluZy52YWx1ZSA9IHZhbHVlXG4gICAgZGVmKHRoaXMudm0sIGtleSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChPYnNlcnZlci5zaG91bGRHZXQpIG9iLmVtaXQoJ2dldCcsIGtleSlcbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nLnZhbHVlXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgb2IuZW1pdCgnc2V0Jywga2V5LCB2YWwpXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqICBEZWZpbmUgYW4gZXhwcmVzc2lvbiBiaW5kaW5nLCB3aGljaCBpcyBlc3NlbnRpYWxseVxuICogIGFuIGFub255bW91cyBjb21wdXRlZCBwcm9wZXJ0eVxuICovXG5Db21waWxlclByb3RvLmRlZmluZUV4cCA9IGZ1bmN0aW9uIChrZXksIGJpbmRpbmcsIGRpcmVjdGl2ZSkge1xuICAgIHZhciBjb21wdXRlZEtleSA9IGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuY29tcHV0ZWRLZXksXG4gICAgICAgIGV4cCAgICAgICAgID0gY29tcHV0ZWRLZXkgPyBkaXJlY3RpdmUuZXhwcmVzc2lvbiA6IGtleSxcbiAgICAgICAgZ2V0dGVyICAgICAgPSB0aGlzLmV4cENhY2hlW2V4cF1cbiAgICBpZiAoIWdldHRlcikge1xuICAgICAgICBnZXR0ZXIgPSB0aGlzLmV4cENhY2hlW2V4cF0gPSBFeHBQYXJzZXIucGFyc2UoY29tcHV0ZWRLZXkgfHwga2V5LCB0aGlzKVxuICAgIH1cbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIHRoaXMubWFya0NvbXB1dGVkKGJpbmRpbmcsIGdldHRlcilcbiAgICB9XG59XG5cbi8qKlxuICogIERlZmluZSBhIGNvbXB1dGVkIHByb3BlcnR5IG9uIHRoZSBWTVxuICovXG5Db21waWxlclByb3RvLmRlZmluZUNvbXB1dGVkID0gZnVuY3Rpb24gKGtleSwgYmluZGluZywgdmFsdWUpIHtcbiAgICB0aGlzLm1hcmtDb21wdXRlZChiaW5kaW5nLCB2YWx1ZSlcbiAgICBkZWYodGhpcy52bSwga2V5LCB7XG4gICAgICAgIGdldDogYmluZGluZy52YWx1ZS4kZ2V0LFxuICAgICAgICBzZXQ6IGJpbmRpbmcudmFsdWUuJHNldFxuICAgIH0pXG59XG5cbi8qKlxuICogIFByb2Nlc3MgYSBjb21wdXRlZCBwcm9wZXJ0eSBiaW5kaW5nXG4gKiAgc28gaXRzIGdldHRlci9zZXR0ZXIgYXJlIGJvdW5kIHRvIHByb3BlciBjb250ZXh0XG4gKi9cbkNvbXBpbGVyUHJvdG8ubWFya0NvbXB1dGVkID0gZnVuY3Rpb24gKGJpbmRpbmcsIHZhbHVlKSB7XG4gICAgYmluZGluZy5pc0NvbXB1dGVkID0gdHJ1ZVxuICAgIC8vIGJpbmQgdGhlIGFjY2Vzc29ycyB0byB0aGUgdm1cbiAgICBpZiAoYmluZGluZy5pc0ZuKSB7XG4gICAgICAgIGJpbmRpbmcudmFsdWUgPSB2YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0geyAkZ2V0OiB2YWx1ZSB9XG4gICAgICAgIH1cbiAgICAgICAgYmluZGluZy52YWx1ZSA9IHtcbiAgICAgICAgICAgICRnZXQ6IHV0aWxzLmJpbmQodmFsdWUuJGdldCwgdGhpcy52bSksXG4gICAgICAgICAgICAkc2V0OiB2YWx1ZS4kc2V0XG4gICAgICAgICAgICAgICAgPyB1dGlscy5iaW5kKHZhbHVlLiRzZXQsIHRoaXMudm0pXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBrZWVwIHRyYWNrIGZvciBkZXAgcGFyc2luZyBsYXRlclxuICAgIHRoaXMuY29tcHV0ZWQucHVzaChiaW5kaW5nKVxufVxuXG4vKipcbiAqICBSZXRyaXZlIGFuIG9wdGlvbiBmcm9tIHRoZSBjb21waWxlclxuICovXG5Db21waWxlclByb3RvLmdldE9wdGlvbiA9IGZ1bmN0aW9uICh0eXBlLCBpZCwgc2lsZW50KSB7XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHBhcmVudCA9IHRoaXMucGFyZW50LFxuICAgICAgICBnbG9iYWxBc3NldHMgPSBjb25maWcuZ2xvYmFsQXNzZXRzLFxuICAgICAgICByZXMgPSAob3B0c1t0eXBlXSAmJiBvcHRzW3R5cGVdW2lkXSkgfHwgKFxuICAgICAgICAgICAgcGFyZW50XG4gICAgICAgICAgICAgICAgPyBwYXJlbnQuZ2V0T3B0aW9uKHR5cGUsIGlkLCBzaWxlbnQpXG4gICAgICAgICAgICAgICAgOiBnbG9iYWxBc3NldHNbdHlwZV0gJiYgZ2xvYmFsQXNzZXRzW3R5cGVdW2lkXVxuICAgICAgICApXG4gICAgaWYgKCFyZXMgJiYgIXNpbGVudCAmJiB0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ1Vua25vd24gJyArIHR5cGUuc2xpY2UoMCwgLTEpICsgJzogJyArIGlkKVxuICAgIH1cbiAgICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogIEVtaXQgbGlmZWN5Y2xlIGV2ZW50cyB0byB0cmlnZ2VyIGhvb2tzXG4gKi9cbkNvbXBpbGVyUHJvdG8uZXhlY0hvb2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudCA9ICdob29rOicgKyBldmVudFxuICAgIHRoaXMub2JzZXJ2ZXIuZW1pdChldmVudClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChldmVudClcbn1cblxuLyoqXG4gKiAgQ2hlY2sgaWYgYSBjb21waWxlcidzIGRhdGEgY29udGFpbnMgYSBrZXlwYXRoXG4gKi9cbkNvbXBpbGVyUHJvdG8uaGFzS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBiYXNlS2V5ID0gdXRpbHMuYmFzZUtleShrZXkpXG4gICAgcmV0dXJuIGhhc093bi5jYWxsKHRoaXMuZGF0YSwgYmFzZUtleSkgfHxcbiAgICAgICAgaGFzT3duLmNhbGwodGhpcy52bSwgYmFzZUtleSlcbn1cblxuLyoqXG4gKiAgRG8gYSBvbmUtdGltZSBldmFsIG9mIGEgc3RyaW5nIHRoYXQgcG90ZW50aWFsbHlcbiAqICBpbmNsdWRlcyBiaW5kaW5ncy4gSXQgYWNjZXB0cyBhZGRpdGlvbmFsIHJhdyBkYXRhXG4gKiAgYmVjYXVzZSB3ZSBuZWVkIHRvIGR5bmFtaWNhbGx5IHJlc29sdmUgdi1jb21wb25lbnRcbiAqICBiZWZvcmUgYSBjaGlsZFZNIGlzIGV2ZW4gY29tcGlsZWQuLi5cbiAqL1xuQ29tcGlsZXJQcm90by5ldmFsID0gZnVuY3Rpb24gKGV4cCwgZGF0YSkge1xuICAgIHZhciBwYXJzZWQgPSBUZXh0UGFyc2VyLnBhcnNlQXR0cihleHApXG4gICAgcmV0dXJuIHBhcnNlZFxuICAgICAgICA/IEV4cFBhcnNlci5ldmFsKHBhcnNlZCwgdGhpcywgZGF0YSlcbiAgICAgICAgOiBleHBcbn1cblxuLyoqXG4gKiAgUmVzb2x2ZSBhIENvbXBvbmVudCBjb25zdHJ1Y3RvciBmb3IgYW4gZWxlbWVudFxuICogIHdpdGggdGhlIGRhdGEgdG8gYmUgdXNlZFxuICovXG5Db21waWxlclByb3RvLnJlc29sdmVDb21wb25lbnQgPSBmdW5jdGlvbiAobm9kZSwgZGF0YSwgdGVzdCkge1xuXG4gICAgLy8gbGF0ZSByZXF1aXJlIHRvIGF2b2lkIGNpcmN1bGFyIGRlcHNcbiAgICBWaWV3TW9kZWwgPSBWaWV3TW9kZWwgfHwgcmVxdWlyZSgnLi92aWV3bW9kZWwnKVxuXG4gICAgdmFyIGV4cCAgICAgPSB1dGlscy5hdHRyKG5vZGUsICdjb21wb25lbnQnKSxcbiAgICAgICAgdGFnTmFtZSA9IG5vZGUudGFnTmFtZSxcbiAgICAgICAgaWQgICAgICA9IHRoaXMuZXZhbChleHAsIGRhdGEpLFxuICAgICAgICB0YWdJZCAgID0gKHRhZ05hbWUuaW5kZXhPZignLScpID4gMCAmJiB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICBDdG9yICAgID0gdGhpcy5nZXRPcHRpb24oJ2NvbXBvbmVudHMnLCBpZCB8fCB0YWdJZCwgdHJ1ZSlcblxuICAgIGlmIChpZCAmJiAhQ3Rvcikge1xuICAgICAgICB1dGlscy53YXJuKCdVbmtub3duIGNvbXBvbmVudDogJyArIGlkKVxuICAgIH1cblxuICAgIHJldHVybiB0ZXN0XG4gICAgICAgID8gZXhwID09PSAnJ1xuICAgICAgICAgICAgPyBWaWV3TW9kZWxcbiAgICAgICAgICAgIDogQ3RvclxuICAgICAgICA6IEN0b3IgfHwgVmlld01vZGVsXG59XG5cbi8qKlxuICogIFVuYmluZCBhbmQgcmVtb3ZlIGVsZW1lbnRcbiAqL1xuQ29tcGlsZXJQcm90by5kZXN0cm95ID0gZnVuY3Rpb24gKG5vUmVtb3ZlKSB7XG5cbiAgICAvLyBhdm9pZCBiZWluZyBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcbiAgICAvLyB0aGlzIGlzIGlycmV2ZXJzaWJsZSFcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHJldHVyblxuXG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcyxcbiAgICAgICAgaSwgaiwga2V5LCBkaXIsIGRpcnMsIGJpbmRpbmcsXG4gICAgICAgIHZtICAgICAgICAgID0gY29tcGlsZXIudm0sXG4gICAgICAgIGVsICAgICAgICAgID0gY29tcGlsZXIuZWwsXG4gICAgICAgIGRpcmVjdGl2ZXMgID0gY29tcGlsZXIuZGlycyxcbiAgICAgICAgY29tcHV0ZWQgICAgPSBjb21waWxlci5jb21wdXRlZCxcbiAgICAgICAgYmluZGluZ3MgICAgPSBjb21waWxlci5iaW5kaW5ncyxcbiAgICAgICAgY2hpbGRyZW4gICAgPSBjb21waWxlci5jaGlsZHJlbixcbiAgICAgICAgcGFyZW50ICAgICAgPSBjb21waWxlci5wYXJlbnRcblxuICAgIGNvbXBpbGVyLmV4ZWNIb29rKCdiZWZvcmVEZXN0cm95JylcblxuICAgIC8vIHVub2JzZXJ2ZSBkYXRhXG4gICAgT2JzZXJ2ZXIudW5vYnNlcnZlKGNvbXBpbGVyLmRhdGEsICcnLCBjb21waWxlci5vYnNlcnZlcilcblxuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWxkcmVuXG4gICAgLy8gZG8gbm90IHJlbW92ZSB0aGVpciBlbGVtZW50cyBzaW5jZSB0aGUgcGFyZW50XG4gICAgLy8gbWF5IGhhdmUgdHJhbnNpdGlvbnMgYW5kIHRoZSBjaGlsZHJlbiBtYXkgbm90XG4gICAgaSA9IGNoaWxkcmVuLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY2hpbGRyZW5baV0uZGVzdHJveSh0cnVlKVxuICAgIH1cblxuICAgIC8vIHVuYmluZCBhbGwgZGlyZWNpdHZlc1xuICAgIGkgPSBkaXJlY3RpdmVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgZGlyID0gZGlyZWN0aXZlc1tpXVxuICAgICAgICAvLyBpZiB0aGlzIGRpcmVjdGl2ZSBpcyBhbiBpbnN0YW5jZSBvZiBhbiBleHRlcm5hbCBiaW5kaW5nXG4gICAgICAgIC8vIGUuZy4gYSBkaXJlY3RpdmUgdGhhdCByZWZlcnMgdG8gYSB2YXJpYWJsZSBvbiB0aGUgcGFyZW50IFZNXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gcmVtb3ZlIGl0IGZyb20gdGhhdCBiaW5kaW5nJ3MgZGlyZWN0aXZlc1xuICAgICAgICAvLyAqIGVtcHR5IGFuZCBsaXRlcmFsIGJpbmRpbmdzIGRvIG5vdCBoYXZlIGJpbmRpbmcuXG4gICAgICAgIGlmIChkaXIuYmluZGluZyAmJiBkaXIuYmluZGluZy5jb21waWxlciAhPT0gY29tcGlsZXIpIHtcbiAgICAgICAgICAgIGRpcnMgPSBkaXIuYmluZGluZy5kaXJzXG4gICAgICAgICAgICBpZiAoZGlycykge1xuICAgICAgICAgICAgICAgIGogPSBkaXJzLmluZGV4T2YoZGlyKVxuICAgICAgICAgICAgICAgIGlmIChqID4gLTEpIGRpcnMuc3BsaWNlKGosIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGlyLiR1bmJpbmQoKVxuICAgIH1cblxuICAgIC8vIHVuYmluZCBhbGwgY29tcHV0ZWQsIGFub255bW91cyBiaW5kaW5nc1xuICAgIGkgPSBjb21wdXRlZC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbXB1dGVkW2ldLnVuYmluZCgpXG4gICAgfVxuXG4gICAgLy8gdW5iaW5kIGFsbCBrZXlwYXRoIGJpbmRpbmdzXG4gICAgZm9yIChrZXkgaW4gYmluZGluZ3MpIHtcbiAgICAgICAgYmluZGluZyA9IGJpbmRpbmdzW2tleV1cbiAgICAgICAgaWYgKGJpbmRpbmcpIHtcbiAgICAgICAgICAgIGJpbmRpbmcudW5iaW5kKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gcGFyZW50XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBqID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YoY29tcGlsZXIpXG4gICAgICAgIGlmIChqID4gLTEpIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaiwgMSlcbiAgICB9XG5cbiAgICAvLyBmaW5hbGx5IHJlbW92ZSBkb20gZWxlbWVudFxuICAgIGlmICghbm9SZW1vdmUpIHtcbiAgICAgICAgaWYgKGVsID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uJHJlbW92ZSgpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWwudnVlX3ZtID0gbnVsbFxuXG4gICAgY29tcGlsZXIuZGVzdHJveWVkID0gdHJ1ZVxuICAgIC8vIGVtaXQgZGVzdHJveSBob29rXG4gICAgY29tcGlsZXIuZXhlY0hvb2soJ2FmdGVyRGVzdHJveScpXG5cbiAgICAvLyBmaW5hbGx5LCB1bnJlZ2lzdGVyIGFsbCBsaXN0ZW5lcnNcbiAgICBjb21waWxlci5vYnNlcnZlci5vZmYoKVxuICAgIGNvbXBpbGVyLmVtaXR0ZXIub2ZmKClcbn1cblxuLy8gSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBzaG9ydGhhbmQgZm9yIGdldHRpbmcgcm9vdCBjb21waWxlclxuICovXG5mdW5jdGlvbiBnZXRSb290IChjb21waWxlcikge1xuICAgIHdoaWxlIChjb21waWxlci5wYXJlbnQpIHtcbiAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGVyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGlsZXIiLCJ2YXIgVGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vdGV4dC1wYXJzZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwcmVmaXggICAgICAgICA6ICd2JyxcbiAgICBkZWJ1ZyAgICAgICAgICA6IGZhbHNlLFxuICAgIHNpbGVudCAgICAgICAgIDogZmFsc2UsXG4gICAgZW50ZXJDbGFzcyAgICAgOiAndi1lbnRlcicsXG4gICAgbGVhdmVDbGFzcyAgICAgOiAndi1sZWF2ZScsXG4gICAgaW50ZXJwb2xhdGUgICAgOiB0cnVlXG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2RlbGltaXRlcnMnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBUZXh0UGFyc2VyLmRlbGltaXRlcnNcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKGRlbGltaXRlcnMpIHtcbiAgICAgICAgVGV4dFBhcnNlci5zZXREZWxpbWl0ZXJzKGRlbGltaXRlcnMpXG4gICAgfVxufSkiLCJ2YXIgRW1pdHRlciAgPSByZXF1aXJlKCcuL2VtaXR0ZXInKSxcbiAgICB1dGlscyAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKSxcbiAgICBjYXRjaGVyICA9IG5ldyBFbWl0dGVyKClcblxuLyoqXG4gKiAgQXV0by1leHRyYWN0IHRoZSBkZXBlbmRlbmNpZXMgb2YgYSBjb21wdXRlZCBwcm9wZXJ0eVxuICogIGJ5IHJlY29yZGluZyB0aGUgZ2V0dGVycyB0cmlnZ2VyZWQgd2hlbiBldmFsdWF0aW5nIGl0LlxuICovXG5mdW5jdGlvbiBjYXRjaERlcHMgKGJpbmRpbmcpIHtcbiAgICBpZiAoYmluZGluZy5pc0ZuKSByZXR1cm5cbiAgICB1dGlscy5sb2coJ1xcbi0gJyArIGJpbmRpbmcua2V5KVxuICAgIHZhciBnb3QgPSB1dGlscy5oYXNoKClcbiAgICBiaW5kaW5nLmRlcHMgPSBbXVxuICAgIGNhdGNoZXIub24oJ2dldCcsIGZ1bmN0aW9uIChkZXApIHtcbiAgICAgICAgdmFyIGhhcyA9IGdvdFtkZXAua2V5XVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyBhdm9pZCBkdXBsaWNhdGUgYmluZGluZ3NcbiAgICAgICAgICAgIChoYXMgJiYgaGFzLmNvbXBpbGVyID09PSBkZXAuY29tcGlsZXIpIHx8XG4gICAgICAgICAgICAvLyBhdm9pZCByZXBlYXRlZCBpdGVtcyBhcyBkZXBlbmRlbmN5XG4gICAgICAgICAgICAvLyBvbmx5IHdoZW4gdGhlIGJpbmRpbmcgaXMgZnJvbSBzZWxmIG9yIHRoZSBwYXJlbnQgY2hhaW5cbiAgICAgICAgICAgIChkZXAuY29tcGlsZXIucmVwZWF0ICYmICFpc1BhcmVudE9mKGRlcC5jb21waWxlciwgYmluZGluZy5jb21waWxlcikpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgZ290W2RlcC5rZXldID0gZGVwXG4gICAgICAgIHV0aWxzLmxvZygnICAtICcgKyBkZXAua2V5KVxuICAgICAgICBiaW5kaW5nLmRlcHMucHVzaChkZXApXG4gICAgICAgIGRlcC5zdWJzLnB1c2goYmluZGluZylcbiAgICB9KVxuICAgIGJpbmRpbmcudmFsdWUuJGdldCgpXG4gICAgY2F0Y2hlci5vZmYoJ2dldCcpXG59XG5cbi8qKlxuICogIFRlc3QgaWYgQSBpcyBhIHBhcmVudCBvZiBvciBlcXVhbHMgQlxuICovXG5mdW5jdGlvbiBpc1BhcmVudE9mIChhLCBiKSB7XG4gICAgd2hpbGUgKGIpIHtcbiAgICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgYiA9IGIucGFyZW50XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8qKlxuICAgICAqICB0aGUgb2JzZXJ2ZXIgdGhhdCBjYXRjaGVzIGV2ZW50cyB0cmlnZ2VyZWQgYnkgZ2V0dGVyc1xuICAgICAqL1xuICAgIGNhdGNoZXI6IGNhdGNoZXIsXG5cbiAgICAvKipcbiAgICAgKiAgcGFyc2UgYSBsaXN0IG9mIGNvbXB1dGVkIHByb3BlcnR5IGJpbmRpbmdzXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChiaW5kaW5ncykge1xuICAgICAgICB1dGlscy5sb2coJ1xcbnBhcnNpbmcgZGVwZW5kZW5jaWVzLi4uJylcbiAgICAgICAgT2JzZXJ2ZXIuc2hvdWxkR2V0ID0gdHJ1ZVxuICAgICAgICBiaW5kaW5ncy5mb3JFYWNoKGNhdGNoRGVwcylcbiAgICAgICAgT2JzZXJ2ZXIuc2hvdWxkR2V0ID0gZmFsc2VcbiAgICAgICAgdXRpbHMubG9nKCdcXG5kb25lLicpXG4gICAgfVxuICAgIFxufSIsInZhciBkaXJJZCAgICAgICAgICAgPSAxLFxuICAgIEFSR19SRSAgICAgICAgICA9IC9eW1xcd1xcJC1dKyQvLFxuICAgIEZJTFRFUl9UT0tFTl9SRSA9IC9bXlxccydcIl0rfCdbXiddKyd8XCJbXlwiXStcIi9nLFxuICAgIE5FU1RJTkdfUkUgICAgICA9IC9eXFwkKHBhcmVudHxyb290KVxcLi8sXG4gICAgU0lOR0xFX1ZBUl9SRSAgID0gL15bXFx3XFwuJF0rJC8sXG4gICAgUVVPVEVfUkUgICAgICAgID0gL1wiL2csXG4gICAgVGV4dFBhcnNlciAgICAgID0gcmVxdWlyZSgnLi90ZXh0LXBhcnNlcicpXG5cbi8qKlxuICogIERpcmVjdGl2ZSBjbGFzc1xuICogIHJlcHJlc2VudHMgYSBzaW5nbGUgZGlyZWN0aXZlIGluc3RhbmNlIGluIHRoZSBET01cbiAqL1xuZnVuY3Rpb24gRGlyZWN0aXZlIChuYW1lLCBhc3QsIGRlZmluaXRpb24sIGNvbXBpbGVyLCBlbCkge1xuXG4gICAgdGhpcy5pZCAgICAgICAgICAgICA9IGRpcklkKytcbiAgICB0aGlzLm5hbWUgICAgICAgICAgID0gbmFtZVxuICAgIHRoaXMuY29tcGlsZXIgICAgICAgPSBjb21waWxlclxuICAgIHRoaXMudm0gICAgICAgICAgICAgPSBjb21waWxlci52bVxuICAgIHRoaXMuZWwgICAgICAgICAgICAgPSBlbFxuICAgIHRoaXMuY29tcHV0ZUZpbHRlcnMgPSBmYWxzZVxuICAgIHRoaXMua2V5ICAgICAgICAgICAgPSBhc3Qua2V5XG4gICAgdGhpcy5hcmcgICAgICAgICAgICA9IGFzdC5hcmdcbiAgICB0aGlzLmV4cHJlc3Npb24gICAgID0gYXN0LmV4cHJlc3Npb25cblxuICAgIHZhciBpc0VtcHR5ID0gdGhpcy5leHByZXNzaW9uID09PSAnJ1xuXG4gICAgLy8gbWl4IGluIHByb3BlcnRpZXMgZnJvbSB0aGUgZGlyZWN0aXZlIGRlZmluaXRpb25cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1tpc0VtcHR5ID8gJ2JpbmQnIDogJ3VwZGF0ZSddID0gZGVmaW5pdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgdGhpc1twcm9wXSA9IGRlZmluaXRpb25bcHJvcF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVtcHR5IGV4cHJlc3Npb24sIHdlJ3JlIGRvbmUuXG4gICAgaWYgKGlzRW1wdHkgfHwgdGhpcy5pc0VtcHR5KSB7XG4gICAgICAgIHRoaXMuaXNFbXB0eSA9IHRydWVcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKFRleHRQYXJzZXIuUmVnZXgudGVzdCh0aGlzLmtleSkpIHtcbiAgICAgICAgdGhpcy5rZXkgPSBjb21waWxlci5ldmFsKHRoaXMua2V5KVxuICAgICAgICBpZiAodGhpcy5pc0xpdGVyYWwpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMua2V5XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZmlsdGVycyA9IGFzdC5maWx0ZXJzLFxuICAgICAgICBmaWx0ZXIsIGZuLCBpLCBsLCBjb21wdXRlZFxuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyc1tpXVxuICAgICAgICAgICAgZm4gPSB0aGlzLmNvbXBpbGVyLmdldE9wdGlvbignZmlsdGVycycsIGZpbHRlci5uYW1lKVxuICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyLmFwcGx5ID0gZm5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcnMucHVzaChmaWx0ZXIpXG4gICAgICAgICAgICAgICAgaWYgKGZuLmNvbXB1dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5maWx0ZXJzIHx8ICF0aGlzLmZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgdGhpcy5jb21wdXRlZEtleSA9IERpcmVjdGl2ZS5pbmxpbmVGaWx0ZXJzKHRoaXMua2V5LCB0aGlzLmZpbHRlcnMpXG4gICAgICAgIHRoaXMuZmlsdGVycyA9IG51bGxcbiAgICB9XG5cbiAgICB0aGlzLmlzRXhwID1cbiAgICAgICAgY29tcHV0ZWQgfHxcbiAgICAgICAgIVNJTkdMRV9WQVJfUkUudGVzdCh0aGlzLmtleSkgfHxcbiAgICAgICAgTkVTVElOR19SRS50ZXN0KHRoaXMua2V5KVxuXG59XG5cbnZhciBEaXJQcm90byA9IERpcmVjdGl2ZS5wcm90b3R5cGVcblxuLyoqXG4gKiAgY2FsbGVkIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2V0IFxuICogIGZvciBjb21wdXRlZCBwcm9wZXJ0aWVzLCB0aGlzIHdpbGwgb25seSBiZSBjYWxsZWQgb25jZVxuICogIGR1cmluZyBpbml0aWFsaXphdGlvbi5cbiAqL1xuRGlyUHJvdG8uJHVwZGF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSwgaW5pdCkge1xuICAgIGlmICh0aGlzLiRsb2NrKSByZXR1cm5cbiAgICBpZiAoaW5pdCB8fCB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fCAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJzICYmICF0aGlzLmNvbXB1dGVGaWx0ZXJzXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy4kYXBwbHlGaWx0ZXJzKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGluaXRcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgcGlwZSB0aGUgdmFsdWUgdGhyb3VnaCBmaWx0ZXJzXG4gKi9cbkRpclByb3RvLiRhcHBseUZpbHRlcnMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgZmlsdGVyZWQgPSB2YWx1ZSwgZmlsdGVyXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGZpbHRlciA9IHRoaXMuZmlsdGVyc1tpXVxuICAgICAgICBmaWx0ZXJlZCA9IGZpbHRlci5hcHBseS5hcHBseSh0aGlzLnZtLCBbZmlsdGVyZWRdLmNvbmNhdChmaWx0ZXIuYXJncykpXG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZFxufVxuXG4vKipcbiAqICBVbmJpbmQgZGlyZXRpdmVcbiAqL1xuRGlyUHJvdG8uJHVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0aGlzIGNhbiBiZSBjYWxsZWQgYmVmb3JlIHRoZSBlbCBpcyBldmVuIGFzc2lnbmVkLi4uXG4gICAgaWYgKCF0aGlzLmVsIHx8ICF0aGlzLnZtKSByZXR1cm5cbiAgICBpZiAodGhpcy51bmJpbmQpIHRoaXMudW5iaW5kKClcbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuYmluZGluZyA9IHRoaXMuY29tcGlsZXIgPSBudWxsXG59XG5cbi8vIEV4cG9zZWQgc3RhdGljIG1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgUGFyc2UgYSBkaXJlY3RpdmUgc3RyaW5nIGludG8gYW4gQXJyYXkgb2ZcbiAqICBBU1QtbGlrZSBvYmplY3RzIHJlcHJlc2VudGluZyBkaXJlY3RpdmVzXG4gKi9cbkRpcmVjdGl2ZS5wYXJzZSA9IGZ1bmN0aW9uIChzdHIpIHtcblxuICAgIHZhciBpblNpbmdsZSA9IGZhbHNlLFxuICAgICAgICBpbkRvdWJsZSA9IGZhbHNlLFxuICAgICAgICBjdXJseSAgICA9IDAsXG4gICAgICAgIHNxdWFyZSAgID0gMCxcbiAgICAgICAgcGFyZW4gICAgPSAwLFxuICAgICAgICBiZWdpbiAgICA9IDAsXG4gICAgICAgIGFyZ0luZGV4ID0gMCxcbiAgICAgICAgZGlycyAgICAgPSBbXSxcbiAgICAgICAgZGlyICAgICAgPSB7fSxcbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gMCxcbiAgICAgICAgYXJnXG5cbiAgICBmb3IgKHZhciBjLCBpID0gMCwgbCA9IHN0ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgYyA9IHN0ci5jaGFyQXQoaSlcbiAgICAgICAgaWYgKGluU2luZ2xlKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBzaW5nbGUgcXVvdGVcbiAgICAgICAgICAgIGlmIChjID09PSBcIidcIikgaW5TaW5nbGUgPSAhaW5TaW5nbGVcbiAgICAgICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xuICAgICAgICAgICAgLy8gY2hlY2sgZG91YmxlIHF1b3RlXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1wiJykgaW5Eb3VibGUgPSAhaW5Eb3VibGVcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnLCcgJiYgIXBhcmVuICYmICFjdXJseSAmJiAhc3F1YXJlKSB7XG4gICAgICAgICAgICAvLyByZWFjaGVkIHRoZSBlbmQgb2YgYSBkaXJlY3RpdmVcbiAgICAgICAgICAgIHB1c2hEaXIoKVxuICAgICAgICAgICAgLy8gcmVzZXQgJiBza2lwIHRoZSBjb21tYVxuICAgICAgICAgICAgZGlyID0ge31cbiAgICAgICAgICAgIGJlZ2luID0gYXJnSW5kZXggPSBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc6JyAmJiAhZGlyLmtleSAmJiAhZGlyLmFyZykge1xuICAgICAgICAgICAgLy8gYXJndW1lbnRcbiAgICAgICAgICAgIGFyZyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAgICAgICBpZiAoQVJHX1JFLnRlc3QoYXJnKSkge1xuICAgICAgICAgICAgICAgIGFyZ0luZGV4ID0gaSArIDFcbiAgICAgICAgICAgICAgICBkaXIuYXJnID0gYXJnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ3wnICYmIHN0ci5jaGFyQXQoaSArIDEpICE9PSAnfCcgJiYgc3RyLmNoYXJBdChpIC0gMSkgIT09ICd8Jykge1xuICAgICAgICAgICAgaWYgKGRpci5rZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGZpbHRlciwgZW5kIG9mIGtleVxuICAgICAgICAgICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgICAgICAgICAgICAgZGlyLmtleSA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgaGFzIGZpbHRlclxuICAgICAgICAgICAgICAgIHB1c2hGaWx0ZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICdcIicpIHtcbiAgICAgICAgICAgIGluRG91YmxlID0gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICBpblNpbmdsZSA9IHRydWVcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnKCcpIHtcbiAgICAgICAgICAgIHBhcmVuKytcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnKScpIHtcbiAgICAgICAgICAgIHBhcmVuLS1cbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAnWycpIHtcbiAgICAgICAgICAgIHNxdWFyZSsrXG4gICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ10nKSB7XG4gICAgICAgICAgICBzcXVhcmUtLVxuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd7Jykge1xuICAgICAgICAgICAgY3VybHkrK1xuICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd9Jykge1xuICAgICAgICAgICAgY3VybHktLVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpID09PSAwIHx8IGJlZ2luICE9PSBpKSB7XG4gICAgICAgIHB1c2hEaXIoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHB1c2hEaXIgKCkge1xuICAgICAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAgIGlmIChkaXIua2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRpci5rZXkgPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICAgICAgICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gYmVnaW4pIHtcbiAgICAgICAgICAgIHB1c2hGaWx0ZXIoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAwIHx8IGRpci5rZXkpIHtcbiAgICAgICAgICAgIGRpcnMucHVzaChkaXIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXNoRmlsdGVyICgpIHtcbiAgICAgICAgdmFyIGV4cCA9IHN0ci5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKSxcbiAgICAgICAgICAgIGZpbHRlclxuICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgICBmaWx0ZXIgPSB7fVxuICAgICAgICAgICAgdmFyIHRva2VucyA9IGV4cC5tYXRjaChGSUxURVJfVE9LRU5fUkUpXG4gICAgICAgICAgICBmaWx0ZXIubmFtZSA9IHRva2Vuc1swXVxuICAgICAgICAgICAgZmlsdGVyLmFyZ3MgPSB0b2tlbnMubGVuZ3RoID4gMSA/IHRva2Vucy5zbGljZSgxKSA6IG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyKSB7XG4gICAgICAgICAgICAoZGlyLmZpbHRlcnMgPSBkaXIuZmlsdGVycyB8fCBbXSkucHVzaChmaWx0ZXIpXG4gICAgICAgIH1cbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyc1xufVxuXG4vKipcbiAqICBJbmxpbmUgY29tcHV0ZWQgZmlsdGVycyBzbyB0aGV5IGJlY29tZSBwYXJ0XG4gKiAgb2YgdGhlIGV4cHJlc3Npb25cbiAqL1xuRGlyZWN0aXZlLmlubGluZUZpbHRlcnMgPSBmdW5jdGlvbiAoa2V5LCBmaWx0ZXJzKSB7XG4gICAgdmFyIGFyZ3MsIGZpbHRlclxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgZmlsdGVyID0gZmlsdGVyc1tpXVxuICAgICAgICBhcmdzID0gZmlsdGVyLmFyZ3NcbiAgICAgICAgICAgID8gJyxcIicgKyBmaWx0ZXIuYXJncy5tYXAoZXNjYXBlUXVvdGUpLmpvaW4oJ1wiLFwiJykgKyAnXCInXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgIGtleSA9ICd0aGlzLiRjb21waWxlci5nZXRPcHRpb24oXCJmaWx0ZXJzXCIsIFwiJyArXG4gICAgICAgICAgICAgICAgZmlsdGVyLm5hbWUgK1xuICAgICAgICAgICAgJ1wiKS5jYWxsKHRoaXMsJyArXG4gICAgICAgICAgICAgICAga2V5ICsgYXJncyArXG4gICAgICAgICAgICAnKSdcbiAgICB9XG4gICAgcmV0dXJuIGtleVxufVxuXG4vKipcbiAqICBDb252ZXJ0IGRvdWJsZSBxdW90ZXMgdG8gc2luZ2xlIHF1b3Rlc1xuICogIHNvIHRoZXkgZG9uJ3QgbWVzcyB1cCB0aGUgZ2VuZXJhdGVkIGZ1bmN0aW9uIGJvZHlcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUXVvdGUgKHYpIHtcbiAgICByZXR1cm4gdi5pbmRleE9mKCdcIicpID4gLTFcbiAgICAgICAgPyB2LnJlcGxhY2UoUVVPVEVfUkUsICdcXCcnKVxuICAgICAgICA6IHZcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmUiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIHNsaWNlID0gW10uc2xpY2VcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgaW5uZXJIVE1MXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBhIGNvbW1lbnQgbm9kZSBtZWFucyB0aGlzIGlzIGEgYmluZGluZyBmb3JcbiAgICAgICAgLy8ge3t7IGlubGluZSB1bmVzY2FwZWQgaHRtbCB9fX1cbiAgICAgICAgaWYgKHRoaXMuZWwubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgICAgICAgIC8vIGhvbGQgbm9kZXNcbiAgICAgICAgICAgIHRoaXMubm9kZXMgPSBbXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdXRpbHMuZ3VhcmQodmFsdWUpXG4gICAgICAgIGlmICh0aGlzLm5vZGVzKSB7XG4gICAgICAgICAgICB0aGlzLnN3YXAodmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3dhcDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmVsLnBhcmVudE5vZGUsXG4gICAgICAgICAgICBub2RlcyAgPSB0aGlzLm5vZGVzLFxuICAgICAgICAgICAgaSAgICAgID0gbm9kZXMubGVuZ3RoXG4gICAgICAgIC8vIHJlbW92ZSBvbGQgbm9kZXNcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGVzW2ldKVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnZlcnQgbmV3IHZhbHVlIHRvIGEgZnJhZ21lbnRcbiAgICAgICAgdmFyIGZyYWcgPSB1dGlscy50b0ZyYWdtZW50KHZhbHVlKVxuICAgICAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIHRvIHRoZXNlIG5vZGVzIHNvIHdlIGNhbiByZW1vdmUgbGF0ZXJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHNsaWNlLmNhbGwoZnJhZy5jaGlsZE5vZGVzKVxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGZyYWcsIHRoaXMuZWwpXG4gICAgfVxufSIsInZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgTWFuYWdlcyBhIGNvbmRpdGlvbmFsIGNoaWxkIFZNXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJlbnQgPSB0aGlzLmVsLnBhcmVudE5vZGVcbiAgICAgICAgdGhpcy5yZWYgICAgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2dWUtaWYnKVxuICAgICAgICB0aGlzLkN0b3IgICA9IHRoaXMuY29tcGlsZXIucmVzb2x2ZUNvbXBvbmVudCh0aGlzLmVsKVxuXG4gICAgICAgIC8vIGluc2VydCByZWZcbiAgICAgICAgdGhpcy5wYXJlbnQuaW5zZXJ0QmVmb3JlKHRoaXMucmVmLCB0aGlzLmVsKVxuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLmVsKVxuXG4gICAgICAgIGlmICh1dGlscy5hdHRyKHRoaXMuZWwsICd2aWV3JykpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oXG4gICAgICAgICAgICAgICAgJ0NvbmZsaWN0OiB2LWlmIGNhbm5vdCBiZSB1c2VkIHRvZ2V0aGVyIHdpdGggdi12aWV3LiAnICtcbiAgICAgICAgICAgICAgICAnSnVzdCBzZXQgdi12aWV3XFwncyBiaW5kaW5nIHZhbHVlIHRvIGVtcHR5IHN0cmluZyB0byBlbXB0eSBpdC4nXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzLmF0dHIodGhpcy5lbCwgJ3JlcGVhdCcpKSB7XG4gICAgICAgICAgICB1dGlscy53YXJuKFxuICAgICAgICAgICAgICAgICdDb25mbGljdDogdi1pZiBjYW5ub3QgYmUgdXNlZCB0b2dldGhlciB3aXRoIHYtcmVwZWF0LiAnICtcbiAgICAgICAgICAgICAgICAnVXNlIGB2LXNob3dgIG9yIHRoZSBgZmlsdGVyQnlgIGZpbHRlciBpbnN0ZWFkLidcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kKClcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0gPSBuZXcgdGhpcy5DdG9yKHtcbiAgICAgICAgICAgICAgICBlbDogdGhpcy5lbC5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLmNoaWxkVk0uJGVsLCB0aGlzLnJlZilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkVk0uJGRlc3Ryb3koKVxuICAgICAgICAgICAgdGhpcy5jaGlsZFZNID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxufSIsInZhciB1dGlscyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMnKSxcbiAgICBjb25maWcgICAgID0gcmVxdWlyZSgnLi4vY29uZmlnJyksXG4gICAgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4uL3RyYW5zaXRpb24nKSxcbiAgICBkaXJlY3RpdmVzID0gbW9kdWxlLmV4cG9ydHMgPSB1dGlscy5oYXNoKClcblxuLyoqXG4gKiAgTmVzdCBhbmQgbWFuYWdlIGEgQ2hpbGQgVk1cbiAqL1xuZGlyZWN0aXZlcy5jb21wb25lbnQgPSB7XG4gICAgaXNMaXRlcmFsOiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVsLnZ1ZV92bSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNID0gbmV3IHRoaXMuQ3Rvcih7XG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuZWwsXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRkZXN0cm95KClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgQmluZGluZyBIVE1MIGF0dHJpYnV0ZXNcbiAqL1xuZGlyZWN0aXZlcy5hdHRyID0ge1xuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMudm0uJG9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzXG4gICAgICAgIHRoaXMuaXNQYXJhbSA9IHBhcmFtcyAmJiBwYXJhbXMuaW5kZXhPZih0aGlzLmFyZykgPiAtMVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSh0aGlzLmFyZywgdmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmFyZylcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1BhcmFtKSB7XG4gICAgICAgICAgICB0aGlzLnZtW3RoaXMuYXJnXSA9IHV0aWxzLmNoZWNrTnVtYmVyKHZhbHVlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBCaW5kaW5nIHRleHRDb250ZW50XG4gKi9cbmRpcmVjdGl2ZXMudGV4dCA9IHtcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYXR0ciA9IHRoaXMuZWwubm9kZVR5cGUgPT09IDNcbiAgICAgICAgICAgID8gJ25vZGVWYWx1ZSdcbiAgICAgICAgICAgIDogJ3RleHRDb250ZW50J1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5lbFt0aGlzLmF0dHJdID0gdXRpbHMuZ3VhcmQodmFsdWUpXG4gICAgfVxufVxuXG4vKipcbiAqICBCaW5kaW5nIENTUyBkaXNwbGF5IHByb3BlcnR5XG4gKi9cbmRpcmVjdGl2ZXMuc2hvdyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBlbCA9IHRoaXMuZWwsXG4gICAgICAgIHRhcmdldCA9IHZhbHVlID8gJycgOiAnbm9uZScsXG4gICAgICAgIGNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB0YXJnZXRcbiAgICAgICAgfVxuICAgIHRyYW5zaXRpb24oZWwsIHZhbHVlID8gMSA6IC0xLCBjaGFuZ2UsIHRoaXMuY29tcGlsZXIpXG59XG5cbi8qKlxuICogIEJpbmRpbmcgQ1NTIGNsYXNzZXNcbiAqL1xuZGlyZWN0aXZlc1snY2xhc3MnXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgICB1dGlsc1t2YWx1ZSA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSh0aGlzLmVsLCB0aGlzLmFyZylcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0VmFsKSB7XG4gICAgICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyh0aGlzLmVsLCB0aGlzLmxhc3RWYWwpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB1dGlscy5hZGRDbGFzcyh0aGlzLmVsLCB2YWx1ZSlcbiAgICAgICAgICAgIHRoaXMubGFzdFZhbCA9IHZhbHVlXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIE9ubHkgcmVtb3ZlZCBhZnRlciB0aGUgb3duZXIgVk0gaXMgcmVhZHlcbiAqL1xuZGlyZWN0aXZlcy5jbG9hayA9IHtcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbFxuICAgICAgICB0aGlzLmNvbXBpbGVyLm9ic2VydmVyLm9uY2UoJ2hvb2s6cmVhZHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArICctY2xvYWsnKVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuLyoqXG4gKiAgU3RvcmUgYSByZWZlcmVuY2UgdG8gc2VsZiBpbiBwYXJlbnQgVk0ncyAkXG4gKi9cbmRpcmVjdGl2ZXMucmVmID0ge1xuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvblxuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHRoaXMudm0uJHBhcmVudC4kW2lkXSA9IHRoaXMudm1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuZXhwcmVzc2lvblxuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZtLiRwYXJlbnQuJFtpZF1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZGlyZWN0aXZlcy5vbiAgICAgID0gcmVxdWlyZSgnLi9vbicpXG5kaXJlY3RpdmVzLnJlcGVhdCAgPSByZXF1aXJlKCcuL3JlcGVhdCcpXG5kaXJlY3RpdmVzLm1vZGVsICAgPSByZXF1aXJlKCcuL21vZGVsJylcbmRpcmVjdGl2ZXNbJ2lmJ10gICA9IHJlcXVpcmUoJy4vaWYnKVxuZGlyZWN0aXZlc1snd2l0aCddID0gcmVxdWlyZSgnLi93aXRoJylcbmRpcmVjdGl2ZXMuaHRtbCAgICA9IHJlcXVpcmUoJy4vaHRtbCcpXG5kaXJlY3RpdmVzLnN0eWxlICAgPSByZXF1aXJlKCcuL3N0eWxlJylcbmRpcmVjdGl2ZXMucGFydGlhbCA9IHJlcXVpcmUoJy4vcGFydGlhbCcpXG5kaXJlY3RpdmVzLnZpZXcgICAgPSByZXF1aXJlKCcuL3ZpZXcnKSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyksXG4gICAgaXNJRTkgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgOS4wJykgPiAwLFxuICAgIGZpbHRlciA9IFtdLmZpbHRlclxuXG4vKipcbiAqICBSZXR1cm5zIGFuIGFycmF5IG9mIHZhbHVlcyBmcm9tIGEgbXVsdGlwbGUgc2VsZWN0XG4gKi9cbmZ1bmN0aW9uIGdldE11bHRpcGxlU2VsZWN0T3B0aW9ucyAoc2VsZWN0KSB7XG4gICAgcmV0dXJuIGZpbHRlclxuICAgICAgICAuY2FsbChzZWxlY3Qub3B0aW9ucywgZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi5zZWxlY3RlZFxuICAgICAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHRcbiAgICAgICAgfSlcbn1cblxuLyoqXG4gKiAgVHdvLXdheSBiaW5kaW5nIGZvciBmb3JtIGlucHV0IGVsZW1lbnRzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGVsICAgPSBzZWxmLmVsLFxuICAgICAgICAgICAgdHlwZSA9IGVsLnR5cGUsXG4gICAgICAgICAgICB0YWcgID0gZWwudGFnTmFtZVxuXG4gICAgICAgIHNlbGYubG9jayA9IGZhbHNlXG4gICAgICAgIHNlbGYub3duZXJWTSA9IHNlbGYuYmluZGluZy5jb21waWxlci52bVxuXG4gICAgICAgIC8vIGRldGVybWluZSB3aGF0IGV2ZW50IHRvIGxpc3RlbiB0b1xuICAgICAgICBzZWxmLmV2ZW50ID1cbiAgICAgICAgICAgIChzZWxmLmNvbXBpbGVyLm9wdGlvbnMubGF6eSB8fFxuICAgICAgICAgICAgdGFnID09PSAnU0VMRUNUJyB8fFxuICAgICAgICAgICAgdHlwZSA9PT0gJ2NoZWNrYm94JyB8fCB0eXBlID09PSAncmFkaW8nKVxuICAgICAgICAgICAgICAgID8gJ2NoYW5nZSdcbiAgICAgICAgICAgICAgICA6ICdpbnB1dCdcblxuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIGF0dHJpYnV0ZSB0byBjaGFuZ2Ugd2hlbiB1cGRhdGluZ1xuICAgICAgICBzZWxmLmF0dHIgPSB0eXBlID09PSAnY2hlY2tib3gnXG4gICAgICAgICAgICA/ICdjaGVja2VkJ1xuICAgICAgICAgICAgOiAodGFnID09PSAnSU5QVVQnIHx8IHRhZyA9PT0gJ1NFTEVDVCcgfHwgdGFnID09PSAnVEVYVEFSRUEnKVxuICAgICAgICAgICAgICAgID8gJ3ZhbHVlJ1xuICAgICAgICAgICAgICAgIDogJ2lubmVySFRNTCdcblxuICAgICAgICAvLyBzZWxlY3RbbXVsdGlwbGVdIHN1cHBvcnRcbiAgICAgICAgaWYodGFnID09PSAnU0VMRUNUJyAmJiBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHRoaXMubXVsdGkgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9zaXRpb25Mb2NrID0gZmFsc2VcbiAgICAgICAgc2VsZi5jTG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uTG9jayA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmNVbmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21wb3NpdGlvbkxvY2sgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNMb2NrKVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY1VubG9jaylcblxuICAgICAgICAvLyBhdHRhY2ggbGlzdGVuZXJcbiAgICAgICAgc2VsZi5zZXQgPSBzZWxmLmZpbHRlcnNcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb3NpdGlvbkxvY2spIHJldHVyblxuICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgZGlyZWN0aXZlIGhhcyBmaWx0ZXJzXG4gICAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBsZXQgdGhlIHZtLiRzZXQgdHJpZ2dlclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSgpIHNvIGZpbHRlcnMgYXJlIGFwcGxpZWQuXG4gICAgICAgICAgICAgICAgLy8gdGhlcmVmb3JlIHdlIGhhdmUgdG8gcmVjb3JkIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgICAgICAgIC8vIHNvIHRoYXQgYWZ0ZXIgdm0uJHNldCBjaGFuZ2VzIHRoZSBpbnB1dFxuICAgICAgICAgICAgICAgIC8vIHZhbHVlIHdlIGNhbiBwdXQgdGhlIGN1cnNvciBiYWNrIGF0IHdoZXJlIGl0IGlzXG4gICAgICAgICAgICAgICAgdmFyIGN1cnNvclBvc1xuICAgICAgICAgICAgICAgIHRyeSB7IGN1cnNvclBvcyA9IGVsLnNlbGVjdGlvblN0YXJ0IH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9zZXQoKVxuXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgdXBkYXRlcyBhcmUgYXN5bmNcbiAgICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHJlc2V0IGN1cnNvciBwb3NpdGlvbiBhc3luYyB0b29cbiAgICAgICAgICAgICAgICB1dGlscy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJzb3JQb3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvc2l0aW9uTG9jaykgcmV0dXJuXG4gICAgICAgICAgICAgICAgLy8gbm8gZmlsdGVycywgZG9uJ3QgbGV0IGl0IHRyaWdnZXIgdXBkYXRlKClcbiAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICBzZWxmLl9zZXQoKVxuXG4gICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoc2VsZi5ldmVudCwgc2VsZi5zZXQpXG5cbiAgICAgICAgLy8gZml4IHNoaXQgZm9yIElFOVxuICAgICAgICAvLyBzaW5jZSBpdCBkb2Vzbid0IGZpcmUgaW5wdXQgb24gYmFja3NwYWNlIC8gZGVsIC8gY3V0XG4gICAgICAgIGlmIChpc0lFOSkge1xuICAgICAgICAgICAgc2VsZi5vbkN1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjdXQgZXZlbnQgZmlyZXMgYmVmb3JlIHRoZSB2YWx1ZSBhY3R1YWxseSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgdXRpbHMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYub25EZWwgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQ2IHx8IGUua2V5Q29kZSA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY3V0Jywgc2VsZi5vbkN1dClcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc2VsZi5vbkRlbClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3duZXJWTS4kc2V0KFxuICAgICAgICAgICAgdGhpcy5rZXksIHRoaXMubXVsdGlcbiAgICAgICAgICAgICAgICA/IGdldE11bHRpcGxlU2VsZWN0T3B0aW9ucyh0aGlzLmVsKVxuICAgICAgICAgICAgICAgIDogdGhpcy5lbFt0aGlzLmF0dHJdXG4gICAgICAgIClcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUsIGluaXQpIHtcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgLy8gc3luYyBiYWNrIGlubGluZSB2YWx1ZSBpZiBpbml0aWFsIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgIGlmIChpbml0ICYmIHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXQoKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxvY2spIHJldHVyblxuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICAgIGlmIChlbC50YWdOYW1lID09PSAnU0VMRUNUJykgeyAvLyBzZWxlY3QgZHJvcGRvd25cbiAgICAgICAgICAgIGVsLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICAgICAgaWYodGhpcy5tdWx0aSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2godGhpcy51cGRhdGVTZWxlY3QsIHRoaXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0KHZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHsgLy8gcmFkaW8gYnV0dG9uXG4gICAgICAgICAgICBlbC5jaGVja2VkID0gdmFsdWUgPT0gZWwudmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChlbC50eXBlID09PSAnY2hlY2tib3gnKSB7IC8vIGNoZWNrYm94XG4gICAgICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxbdGhpcy5hdHRyXSA9IHV0aWxzLmd1YXJkKHZhbHVlKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZVNlbGVjdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIC8vIHNldHRpbmcgPHNlbGVjdD4ncyB2YWx1ZSBpbiBJRTkgZG9lc24ndCB3b3JrXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gbWFudWFsbHkgbG9vcCB0aHJvdWdoIHRoZSBvcHRpb25zXG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5lbC5vcHRpb25zLFxuICAgICAgICAgICAgaSA9IG9wdGlvbnMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zW2ldLnZhbHVlID09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uc1tpXS5zZWxlY3RlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5ldmVudCwgdGhpcy5zZXQpXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNMb2NrKVxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY1VubG9jaylcbiAgICAgICAgaWYgKGlzSUU5KSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjdXQnLCB0aGlzLm9uQ3V0KVxuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgICAgICB9XG4gICAgfVxufSIsInZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgaXNGbjogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5iaW5kaW5nLmlzRXhwXG4gICAgICAgICAgICA/IHRoaXMudm1cbiAgICAgICAgICAgIDogdGhpcy5iaW5kaW5nLmNvbXBpbGVyLnZtXG4gICAgICAgIGlmICh0aGlzLmVsLnRhZ05hbWUgPT09ICdJRlJBTUUnICYmIHRoaXMuYXJnICE9PSAnbG9hZCcpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVCaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuZWwuY29udGVudFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKHNlbGYuYXJnLCBzZWxmLmhhbmRsZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLmlmcmFtZUJpbmQpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oJ0RpcmVjdGl2ZSBcInYtb246JyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBleHBlY3RzIGEgbWV0aG9kLicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0KClcbiAgICAgICAgdmFyIHZtID0gdGhpcy52bSxcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzLmNvbnRleHRcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUudGFyZ2V0Vk0gPSB2bVxuICAgICAgICAgICAgY29udGV4dC4kZXZlbnQgPSBlXG4gICAgICAgICAgICB2YXIgcmVzID0gaGFuZGxlci5jYWxsKGNvbnRleHQsIGUpXG4gICAgICAgICAgICBjb250ZXh0LiRldmVudCA9IG51bGxcbiAgICAgICAgICAgIHJldHVybiByZXNcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pZnJhbWVCaW5kKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZUJpbmQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5pZnJhbWVCaW5kXG4gICAgICAgICAgICA/IHRoaXMuZWwuY29udGVudFdpbmRvd1xuICAgICAgICAgICAgOiB0aGlzLmVsXG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5hcmcsIHRoaXMuaGFuZGxlcilcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICB9XG59IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG4vKipcbiAqICBCaW5kaW5nIGZvciBwYXJ0aWFsc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgaWQgPSB0aGlzLmV4cHJlc3Npb25cbiAgICAgICAgaWYgKCFpZCkgcmV0dXJuXG5cbiAgICAgICAgdmFyIGVsICAgICAgID0gdGhpcy5lbCxcbiAgICAgICAgICAgIGNvbXBpbGVyID0gdGhpcy5jb21waWxlcixcbiAgICAgICAgICAgIHBhcnRpYWwgID0gY29tcGlsZXIuZ2V0T3B0aW9uKCdwYXJ0aWFscycsIGlkKVxuXG4gICAgICAgIGlmICghcGFydGlhbCkge1xuICAgICAgICAgICAgaWYgKGlkID09PSAneWllbGQnKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMud2Fybigne3s+eWllbGR9fSBzeW50YXggaGFzIGJlZW4gZGVwcmVjYXRlZC4gVXNlIDxjb250ZW50PiB0YWcgaW5zdGVhZC4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBwYXJ0aWFsID0gcGFydGlhbC5jbG9uZU5vZGUodHJ1ZSlcblxuICAgICAgICAvLyBjb21tZW50IHJlZiBub2RlIG1lYW5zIGlubGluZSBwYXJ0aWFsXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSA9PT0gOCkge1xuXG4gICAgICAgICAgICAvLyBrZWVwIGEgcmVmIGZvciB0aGUgcGFydGlhbCdzIGNvbnRlbnQgbm9kZXNcbiAgICAgICAgICAgIHZhciBub2RlcyA9IFtdLnNsaWNlLmNhbGwocGFydGlhbC5jaGlsZE5vZGVzKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBlbC5wYXJlbnROb2RlXG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHBhcnRpYWwsIGVsKVxuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICAgICAgLy8gY29tcGlsZSBwYXJ0aWFsIGFmdGVyIGFwcGVuZGluZywgYmVjYXVzZSBpdHMgY2hpbGRyZW4ncyBwYXJlbnROb2RlXG4gICAgICAgICAgICAvLyB3aWxsIGNoYW5nZSBmcm9tIHRoZSBmcmFnbWVudCB0byB0aGUgY29ycmVjdCBwYXJlbnROb2RlLlxuICAgICAgICAgICAgLy8gVGhpcyBjb3VsZCBhZmZlY3QgZGlyZWN0aXZlcyB0aGF0IG5lZWQgYWNjZXNzIHRvIGl0cyBlbGVtZW50J3MgcGFyZW50Tm9kZS5cbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goY29tcGlsZXIuY29tcGlsZSwgY29tcGlsZXIpXG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8ganVzdCBzZXQgaW5uZXJIVE1MLi4uXG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQocGFydGlhbClcblxuICAgICAgICB9XG4gICAgfVxuXG59IiwidmFyIHV0aWxzICAgICAgPSByZXF1aXJlKCcuLi91dGlscycpLFxuICAgIGNvbmZpZyAgICAgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqICBCaW5kaW5nIHRoYXQgbWFuYWdlcyBWTXMgYmFzZWQgb24gYW4gQXJyYXlcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5pZGVudGlmaWVyID0gJyRyJyArIHRoaXMuaWRcblxuICAgICAgICAvLyBhIGhhc2ggdG8gY2FjaGUgdGhlIHNhbWUgZXhwcmVzc2lvbnMgb24gcmVwZWF0ZWQgaW5zdGFuY2VzXG4gICAgICAgIC8vIHNvIHRoZXkgZG9uJ3QgaGF2ZSB0byBiZSBjb21waWxlZCBmb3IgZXZlcnkgc2luZ2xlIGluc3RhbmNlXG4gICAgICAgIHRoaXMuZXhwQ2FjaGUgPSB1dGlscy5oYXNoKClcblxuICAgICAgICB2YXIgZWwgICA9IHRoaXMuZWwsXG4gICAgICAgICAgICBjdG4gID0gdGhpcy5jb250YWluZXIgPSBlbC5wYXJlbnROb2RlXG5cbiAgICAgICAgLy8gZXh0cmFjdCBjaGlsZCBJZCwgaWYgYW55XG4gICAgICAgIHRoaXMuY2hpbGRJZCA9IHRoaXMuY29tcGlsZXIuZXZhbCh1dGlscy5hdHRyKGVsLCAncmVmJykpXG5cbiAgICAgICAgLy8gY3JlYXRlIGEgY29tbWVudCBub2RlIGFzIGEgcmVmZXJlbmNlIG5vZGUgZm9yIERPTSBpbnNlcnRpb25zXG4gICAgICAgIHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudChjb25maWcucHJlZml4ICsgJy1yZXBlYXQtJyArIHRoaXMua2V5KVxuICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHRoaXMucmVmLCBlbClcbiAgICAgICAgY3RuLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG51bGxcbiAgICAgICAgdGhpcy52bXMgPSBudWxsXG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgaWYgKHV0aWxzLmlzT2JqZWN0KGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IHV0aWxzLm9iamVjdFRvQXJyYXkoY29sbGVjdGlvbilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbHMud2Fybigndi1yZXBlYXQgb25seSBhY2NlcHRzIEFycmF5IG9yIE9iamVjdCB2YWx1ZXMuJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGtlZXAgcmVmZXJlbmNlIG9mIG9sZCBkYXRhIGFuZCBWTXNcbiAgICAgICAgLy8gc28gd2UgY2FuIHJldXNlIHRoZW0gaWYgcG9zc2libGVcbiAgICAgICAgdGhpcy5vbGRWTXMgPSB0aGlzLnZtc1xuICAgICAgICB0aGlzLm9sZENvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb25cbiAgICAgICAgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24gfHwgW11cblxuICAgICAgICB2YXIgaXNPYmplY3QgPSBjb2xsZWN0aW9uWzBdICYmIHV0aWxzLmlzT2JqZWN0KGNvbGxlY3Rpb25bMF0pXG4gICAgICAgIHRoaXMudm1zID0gdGhpcy5vbGRDb2xsZWN0aW9uXG4gICAgICAgICAgICA/IHRoaXMuZGlmZihjb2xsZWN0aW9uLCBpc09iamVjdClcbiAgICAgICAgICAgIDogdGhpcy5pbml0KGNvbGxlY3Rpb24sIGlzT2JqZWN0KVxuXG4gICAgICAgIGlmICh0aGlzLmNoaWxkSWQpIHtcbiAgICAgICAgICAgIHRoaXMudm0uJFt0aGlzLmNoaWxkSWRdID0gdGhpcy52bXNcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBpc09iamVjdCkge1xuICAgICAgICB2YXIgdm0sIHZtcyA9IFtdXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY29sbGVjdGlvbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZtID0gdGhpcy5idWlsZChjb2xsZWN0aW9uW2ldLCBpLCBpc09iamVjdClcbiAgICAgICAgICAgIHZtcy5wdXNoKHZtKVxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGlsZXIuaW5pdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh2bS4kZWwsIHRoaXMucmVmKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIERpZmYgdGhlIG5ldyBhcnJheSB3aXRoIHRoZSBvbGRcbiAgICAgKiAgYW5kIGRldGVybWluZSB0aGUgbWluaW11bSBhbW91bnQgb2YgRE9NIG1hbmlwdWxhdGlvbnMuXG4gICAgICovXG4gICAgZGlmZjogZnVuY3Rpb24gKG5ld0NvbGxlY3Rpb24sIGlzT2JqZWN0KSB7XG5cbiAgICAgICAgdmFyIGksIGwsIGl0ZW0sIHZtLFxuICAgICAgICAgICAgb2xkSW5kZXgsXG4gICAgICAgICAgICB0YXJnZXROZXh0LFxuICAgICAgICAgICAgY3VycmVudE5leHQsXG4gICAgICAgICAgICBuZXh0RWwsXG4gICAgICAgICAgICBjdG4gICAgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgICAgIG9sZFZNcyA9IHRoaXMub2xkVk1zLFxuICAgICAgICAgICAgdm1zICAgID0gW11cblxuICAgICAgICB2bXMubGVuZ3RoID0gbmV3Q29sbGVjdGlvbi5sZW5ndGhcblxuICAgICAgICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IG5ldyByZXVzZWQgYW5kIG5ldyBjcmVhdGVkXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBuZXdDb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaXRlbSA9IG5ld0NvbGxlY3Rpb25baV1cbiAgICAgICAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICAgICAgICAgIGl0ZW0uJGluZGV4ID0gaVxuICAgICAgICAgICAgICAgIGlmIChpdGVtLl9fZW1pdHRlcl9fICYmIGl0ZW0uX19lbWl0dGVyX19bdGhpcy5pZGVudGlmaWVyXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHBpZWNlIG9mIGRhdGEgaXMgYmVpbmcgcmV1c2VkLlxuICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgaXRzIGZpbmFsIHBvc2l0aW9uIGluIHJldXNlZCB2bXNcbiAgICAgICAgICAgICAgICAgICAgaXRlbS4kcmV1c2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZtc1tpXSA9IHRoaXMuYnVpbGQoaXRlbSwgaSwgaXNPYmplY3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBjYW4ndCBhdHRhY2ggYW4gaWRlbnRpZmllciB0byBwcmltaXRpdmUgdmFsdWVzXG4gICAgICAgICAgICAgICAgLy8gc28gaGF2ZSB0byBkbyBhbiBpbmRleE9mLi4uXG4gICAgICAgICAgICAgICAgb2xkSW5kZXggPSBpbmRleE9mKG9sZFZNcywgaXRlbSlcbiAgICAgICAgICAgICAgICBpZiAob2xkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGhlIHBvc2l0aW9uIG9uIHRoZSBleGlzdGluZyB2bVxuICAgICAgICAgICAgICAgICAgICBvbGRWTXNbb2xkSW5kZXhdLiRyZXVzZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIG9sZFZNc1tvbGRJbmRleF0uJGRhdGEuJGluZGV4ID0gaVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZtc1tpXSA9IHRoaXMuYnVpbGQoaXRlbSwgaSwgaXNPYmplY3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2Vjb25kIHBhc3MsIGNvbGxlY3Qgb2xkIHJldXNlZCBhbmQgZGVzdHJveSB1bnVzZWRcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IG9sZFZNcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZtID0gb2xkVk1zW2ldXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5hcmdcbiAgICAgICAgICAgICAgICA/IHZtLiRkYXRhW3RoaXMuYXJnXVxuICAgICAgICAgICAgICAgIDogdm0uJGRhdGFcbiAgICAgICAgICAgIGlmIChpdGVtLiRyZXVzZWQpIHtcbiAgICAgICAgICAgICAgICB2bS4kcmV1c2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLiRyZXVzZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2bS4kcmV1c2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBpbmRleCB0byBsYXRlc3RcbiAgICAgICAgICAgICAgICB2bS4kaW5kZXggPSBpdGVtLiRpbmRleFxuICAgICAgICAgICAgICAgIC8vIHRoZSBpdGVtIGNvdWxkIGhhdmUgaGFkIGEgbmV3IGtleVxuICAgICAgICAgICAgICAgIGlmIChpdGVtLiRrZXkgJiYgaXRlbS4ka2V5ICE9PSB2bS4ka2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLiRrZXkgPSBpdGVtLiRrZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm1zW3ZtLiRpbmRleF0gPSB2bVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIG9uZSBjYW4gYmUgZGVzdHJveWVkLlxuICAgICAgICAgICAgICAgIGlmIChpdGVtLl9fZW1pdHRlcl9fKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLl9fZW1pdHRlcl9fW3RoaXMuaWRlbnRpZmllcl1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uJGRlc3Ryb3koKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmluYWwgcGFzcywgbW92ZS9pbnNlcnQgRE9NIGVsZW1lbnRzXG4gICAgICAgIGkgPSB2bXMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHZtID0gdm1zW2ldXG4gICAgICAgICAgICBpdGVtID0gdm0uJGRhdGFcbiAgICAgICAgICAgIHRhcmdldE5leHQgPSB2bXNbaSArIDFdXG4gICAgICAgICAgICBpZiAodm0uJHJldXNlZCkge1xuICAgICAgICAgICAgICAgIG5leHRFbCA9IHZtLiRlbC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3llZCBWTXMnIGVsZW1lbnQgbWlnaHQgc3RpbGwgYmUgaW4gdGhlIERPTVxuICAgICAgICAgICAgICAgIC8vIGR1ZSB0byB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgICAgIHdoaWxlICghbmV4dEVsLnZ1ZV92bSAmJiBuZXh0RWwgIT09IHRoaXMucmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRFbCA9IG5leHRFbC5uZXh0U2libGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50TmV4dCA9IG5leHRFbC52dWVfdm1cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5leHQgIT09IHRhcmdldE5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXROZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHZtLiRlbCwgdGhpcy5yZWYpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0RWwgPSB0YXJnZXROZXh0LiRlbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV3IFZNcycgZWxlbWVudCBtaWdodCBub3QgYmUgaW4gdGhlIERPTSB5ZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGR1ZSB0byB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFuZXh0RWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE5leHQgPSB2bXNbbmV4dEVsLnZ1ZV92bS4kaW5kZXggKyAxXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRFbCA9IHRhcmdldE5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0YXJnZXROZXh0LiRlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucmVmXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG4uaW5zZXJ0QmVmb3JlKHZtLiRlbCwgbmV4dEVsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB2bS4kcmV1c2VkXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uJGluZGV4XG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uJGtleVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gYSBuZXcgdm1cbiAgICAgICAgICAgICAgICB2bS4kYmVmb3JlKHRhcmdldE5leHQgPyB0YXJnZXROZXh0LiRlbCA6IHRoaXMucmVmKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZtc1xuICAgIH0sXG5cbiAgICBidWlsZDogZnVuY3Rpb24gKGRhdGEsIGluZGV4LCBpc09iamVjdCkge1xuXG4gICAgICAgIC8vIHdyYXAgbm9uLW9iamVjdCB2YWx1ZXNcbiAgICAgICAgdmFyIHJhdywgYWxpYXMsXG4gICAgICAgICAgICB3cmFwID0gIWlzT2JqZWN0IHx8IHRoaXMuYXJnXG4gICAgICAgIGlmICh3cmFwKSB7XG4gICAgICAgICAgICByYXcgPSBkYXRhXG4gICAgICAgICAgICBhbGlhcyA9IHRoaXMuYXJnIHx8ICckdmFsdWUnXG4gICAgICAgICAgICBkYXRhID0ge31cbiAgICAgICAgICAgIGRhdGFbYWxpYXNdID0gcmF3XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS4kaW5kZXggPSBpbmRleFxuXG4gICAgICAgIHZhciBlbCA9IHRoaXMuZWwuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgQ3RvciA9IHRoaXMuY29tcGlsZXIucmVzb2x2ZUNvbXBvbmVudChlbCwgZGF0YSksXG4gICAgICAgICAgICB2bSA9IG5ldyBDdG9yKHtcbiAgICAgICAgICAgICAgICBlbDogZWwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMudm0sXG4gICAgICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGVhdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhwQ2FjaGU6IHRoaXMuZXhwQ2FjaGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGlmIChpc09iamVjdCkge1xuICAgICAgICAgICAgLy8gYXR0YWNoIGFuIGllbnVtZXJhYmxlIGlkZW50aWZpZXIgdG8gdGhlIHJhdyBkYXRhXG4gICAgICAgICAgICAocmF3IHx8IGRhdGEpLl9fZW1pdHRlcl9fW3RoaXMuaWRlbnRpZmllcl0gPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdm1cblxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRJZCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudm0uJFt0aGlzLmNoaWxkSWRdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudm1zKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMudm1zLmxlbmd0aFxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIHRoaXMudm1zW2ldLiRkZXN0cm95KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBGaW5kIGFuIG9iamVjdCBvciBhIHdyYXBwZWQgZGF0YSBvYmplY3RcbiAqICBmcm9tIGFuIEFycmF5XG4gKi9cbmZ1bmN0aW9uIGluZGV4T2YgKHZtcywgb2JqKSB7XG4gICAgZm9yICh2YXIgdm0sIGkgPSAwLCBsID0gdm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2bSA9IHZtc1tpXVxuICAgICAgICBpZiAoIXZtLiRyZXVzZWQgJiYgdm0uJHZhbHVlID09PSBvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG59IiwidmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICctbXMtJ11cblxuLyoqXG4gKiAgQmluZGluZyBmb3IgQ1NTIHN0eWxlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmFyZ1xuICAgICAgICBpZiAoIXByb3ApIHJldHVyblxuICAgICAgICBpZiAocHJvcC5jaGFyQXQoMCkgPT09ICckJykge1xuICAgICAgICAgICAgLy8gcHJvcGVydGllcyB0aGF0IHN0YXJ0IHdpdGggJCB3aWxsIGJlIGF1dG8tcHJlZml4ZWRcbiAgICAgICAgICAgIHByb3AgPSBwcm9wLnNsaWNlKDEpXG4gICAgICAgICAgICB0aGlzLnByZWZpeGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvcCA9IHByb3BcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLnByb3AsXG4gICAgICAgICAgICBpc0ltcG9ydGFudFxuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiB0cnVlICovXG4gICAgICAgIC8vIGNhc3QgcG9zc2libGUgbnVtYmVycy9ib29sZWFucyBpbnRvIHN0cmluZ3NcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHZhbHVlICs9ICcnXG4gICAgICAgIGlmIChwcm9wKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpc0ltcG9ydGFudCA9IHZhbHVlLnNsaWNlKC0xMCkgPT09ICchaW1wb3J0YW50J1xuICAgICAgICAgICAgICAgICAgICA/ICdpbXBvcnRhbnQnXG4gICAgICAgICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgICAgICBpZiAoaXNJbXBvcnRhbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCAtMTApLnRyaW0oKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcCwgdmFsdWUsIGlzSW1wb3J0YW50KVxuICAgICAgICAgICAgaWYgKHRoaXMucHJlZml4ZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcmVmaXhlc1tpXSArIHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiLyoqXG4gKiAgTWFuYWdlcyBhIGNvbmRpdGlvbmFsIGNoaWxkIFZNIHVzaW5nIHRoZVxuICogIGJpbmRpbmcncyB2YWx1ZSBhcyB0aGUgY29tcG9uZW50IElELlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyB0cmFjayBwb3NpdGlvbiBpbiBET00gd2l0aCBhIHJlZiBub2RlXG4gICAgICAgIHZhciBlbCAgICAgICA9IHRoaXMucmF3ID0gdGhpcy5lbCxcbiAgICAgICAgICAgIHBhcmVudCAgID0gZWwucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIHJlZiAgICAgID0gdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXZpZXcnKVxuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHJlZiwgZWwpXG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICAvLyBjYWNoZSBvcmlnaW5hbCBjb250ZW50XG4gICAgICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgICAgIHZhciBub2RlLFxuICAgICAgICAgICAgZnJhZyA9IHRoaXMuaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB3aGlsZSAobm9kZSA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQobm9kZSlcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24odmFsdWUpIHtcblxuICAgICAgICB0aGlzLnVuYmluZCgpXG5cbiAgICAgICAgdmFyIEN0b3IgID0gdGhpcy5jb21waWxlci5nZXRPcHRpb24oJ2NvbXBvbmVudHMnLCB2YWx1ZSlcbiAgICAgICAgaWYgKCFDdG9yKSByZXR1cm5cblxuICAgICAgICB0aGlzLmNoaWxkVk0gPSBuZXcgQ3Rvcih7XG4gICAgICAgICAgICBlbDogdGhpcy5yYXcuY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgICAgcGFyZW50OiB0aGlzLnZtLFxuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmF3Q29udGVudDogdGhpcy5pbm5lci5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmVsID0gdGhpcy5jaGlsZFZNLiRlbFxuICAgICAgICBpZiAodGhpcy5jb21waWxlci5pbml0KSB7XG4gICAgICAgICAgICB0aGlzLnJlZi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRWTS4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRWTSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFZNLiRkZXN0cm95KClcbiAgICAgICAgfVxuICAgIH1cblxufSIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxuLyoqXG4gKiAgQmluZGluZyBmb3IgaW5oZXJpdGluZyBkYXRhIGZyb20gcGFyZW50IFZNcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgICAgICA9IHRoaXMsXG4gICAgICAgICAgICBjaGlsZEtleSAgPSBzZWxmLmFyZyxcbiAgICAgICAgICAgIHBhcmVudEtleSA9IHNlbGYua2V5LFxuICAgICAgICAgICAgY29tcGlsZXIgID0gc2VsZi5jb21waWxlcixcbiAgICAgICAgICAgIG93bmVyICAgICA9IHNlbGYuYmluZGluZy5jb21waWxlclxuXG4gICAgICAgIGlmIChjb21waWxlciA9PT0gb3duZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYWxvbmUgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGlsZEtleSkge1xuICAgICAgICAgICAgaWYgKCFjb21waWxlci5iaW5kaW5nc1tjaGlsZEtleV0pIHtcbiAgICAgICAgICAgICAgICBjb21waWxlci5jcmVhdGVCaW5kaW5nKGNoaWxkS2V5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc3luYyBjaGFuZ2VzIG9uIGNoaWxkIGJhY2sgdG8gcGFyZW50XG4gICAgICAgICAgICBjb21waWxlci5vYnNlcnZlci5vbignY2hhbmdlOicgKyBjaGlsZEtleSwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21waWxlci5pbml0KSByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYubG9jaykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvY2sgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubG9jayA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG93bmVyLnZtLiRzZXQocGFyZW50S2V5LCB2YWwpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIHN5bmMgZnJvbSBwYXJlbnRcbiAgICAgICAgaWYgKCF0aGlzLmFsb25lICYmICF0aGlzLmxvY2spIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgICAgICAgICAgIHRoaXMudm0uJHNldCh0aGlzLmFyZywgdmFsdWUpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudm0uJGRhdGEgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52bS4kZGF0YSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJ2YXIgc2xpY2UgPSBbXS5zbGljZVxuXG5mdW5jdGlvbiBFbWl0dGVyIChjdHgpIHtcbiAgICB0aGlzLl9jdHggPSBjdHggfHwgdGhpc1xufVxuXG52YXIgRW1pdHRlclByb3RvID0gRW1pdHRlci5wcm90b3R5cGVcblxuRW1pdHRlclByb3RvLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuICAgIDsodGhpcy5fY2JzW2V2ZW50XSA9IHRoaXMuX2Nic1tldmVudF0gfHwgW10pXG4gICAgICAgIC5wdXNoKGZuKVxuICAgIHJldHVybiB0aGlzXG59XG5cbkVtaXR0ZXJQcm90by5vbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHRoaXMuX2NicyA9IHRoaXMuX2NicyB8fCB7fVxuXG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgICBzZWxmLm9mZihldmVudCwgb24pXG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBvbi5mbiA9IGZuXG4gICAgdGhpcy5vbihldmVudCwgb24pXG4gICAgcmV0dXJuIHRoaXNcbn1cblxuRW1pdHRlclByb3RvLm9mZiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cblxuICAgIC8vIGFsbFxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9jYnMgPSB7fVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vIHNwZWNpZmljIGV2ZW50XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2Nic1tldmVudF1cbiAgICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXNcblxuICAgIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY2JzW2V2ZW50XVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gICAgdmFyIGNiXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2IgPSBjYWxsYmFja3NbaV1cbiAgICAgICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgVGhlIGludGVybmFsLCBmYXN0ZXIgZW1pdCB3aXRoIGZpeGVkIGFtb3VudCBvZiBhcmd1bWVudHNcbiAqICB1c2luZyBGdW5jdGlvbi5jYWxsXG4gKi9cbkVtaXR0ZXJQcm90by5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50LCBhLCBiLCBjKSB7XG4gICAgdGhpcy5fY2JzID0gdGhpcy5fY2JzIHx8IHt9XG4gICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2Nic1tldmVudF1cblxuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc1tpXS5jYWxsKHRoaXMuX2N0eCwgYSwgYiwgYylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogIFRoZSBleHRlcm5hbCBlbWl0IHVzaW5nIEZ1bmN0aW9uLmFwcGx5XG4gKi9cbkVtaXR0ZXJQcm90by5hcHBseUVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB0aGlzLl9jYnMgPSB0aGlzLl9jYnMgfHwge31cbiAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2JzW2V2ZW50XSwgYXJnc1xuXG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICAgICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcy5fY3R4LCBhcmdzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyIiwidmFyIHV0aWxzICAgICAgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICBTVFJfU0FWRV9SRSAgICAgPSAvXCIoPzpbXlwiXFxcXF18XFxcXC4pKlwifCcoPzpbXidcXFxcXXxcXFxcLikqJy9nLFxuICAgIFNUUl9SRVNUT1JFX1JFICA9IC9cIihcXGQrKVwiL2csXG4gICAgTkVXTElORV9SRSAgICAgID0gL1xcbi9nLFxuICAgIENUT1JfUkUgICAgICAgICA9IG5ldyBSZWdFeHAoJ2NvbnN0cnVjdG9yJy5zcGxpdCgnJykuam9pbignW1xcJ1wiKywgXSonKSksXG4gICAgVU5JQ09ERV9SRSAgICAgID0gL1xcXFx1XFxkXFxkXFxkXFxkL1xuXG4vLyBWYXJpYWJsZSBleHRyYWN0aW9uIHNjb29wZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vUnVieUxvdXZyZS9hdmFsb25cblxudmFyIEtFWVdPUkRTID1cbiAgICAgICAgLy8ga2V5d29yZHNcbiAgICAgICAgJ2JyZWFrLGNhc2UsY2F0Y2gsY29udGludWUsZGVidWdnZXIsZGVmYXVsdCxkZWxldGUsZG8sZWxzZSxmYWxzZScgK1xuICAgICAgICAnLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLGluLGluc3RhbmNlb2YsbmV3LG51bGwscmV0dXJuLHN3aXRjaCx0aGlzJyArXG4gICAgICAgICcsdGhyb3csdHJ1ZSx0cnksdHlwZW9mLHZhcix2b2lkLHdoaWxlLHdpdGgsdW5kZWZpbmVkJyArXG4gICAgICAgIC8vIHJlc2VydmVkXG4gICAgICAgICcsYWJzdHJhY3QsYm9vbGVhbixieXRlLGNoYXIsY2xhc3MsY29uc3QsZG91YmxlLGVudW0sZXhwb3J0LGV4dGVuZHMnICtcbiAgICAgICAgJyxmaW5hbCxmbG9hdCxnb3RvLGltcGxlbWVudHMsaW1wb3J0LGludCxpbnRlcmZhY2UsbG9uZyxuYXRpdmUnICtcbiAgICAgICAgJyxwYWNrYWdlLHByaXZhdGUscHJvdGVjdGVkLHB1YmxpYyxzaG9ydCxzdGF0aWMsc3VwZXIsc3luY2hyb25pemVkJyArXG4gICAgICAgICcsdGhyb3dzLHRyYW5zaWVudCx2b2xhdGlsZScgK1xuICAgICAgICAvLyBFQ01BIDUgLSB1c2Ugc3RyaWN0XG4gICAgICAgICcsYXJndW1lbnRzLGxldCx5aWVsZCcgK1xuICAgICAgICAvLyBhbGxvdyB1c2luZyBNYXRoIGluIGV4cHJlc3Npb25zXG4gICAgICAgICcsTWF0aCcsXG4gICAgICAgIFxuICAgIEtFWVdPUkRTX1JFID0gbmV3IFJlZ0V4cChbXCJcXFxcYlwiICsgS0VZV09SRFMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8XFxcXGInKSArIFwiXFxcXGJcIl0uam9pbignfCcpLCAnZycpLFxuICAgIFJFTU9WRV9SRSAgID0gL1xcL1xcKig/Oi58XFxuKSo/XFwqXFwvfFxcL1xcL1teXFxuXSpcXG58XFwvXFwvW15cXG5dKiR8J1teJ10qJ3xcIlteXCJdKlwifFtcXHNcXHRcXG5dKlxcLltcXHNcXHRcXG5dKlskXFx3XFwuXSt8W1xceyxdXFxzKltcXHdcXCRfXStcXHMqOi9nLFxuICAgIFNQTElUX1JFICAgID0gL1teXFx3JF0rL2csXG4gICAgTlVNQkVSX1JFICAgPSAvXFxiXFxkW14sXSovZyxcbiAgICBCT1VOREFSWV9SRSA9IC9eLCt8LCskL2dcblxuLyoqXG4gKiAgU3RyaXAgdG9wIGxldmVsIHZhcmlhYmxlIG5hbWVzIGZyb20gYSBzbmlwcGV0IG9mIEpTIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVzIChjb2RlKSB7XG4gICAgY29kZSA9IGNvZGVcbiAgICAgICAgLnJlcGxhY2UoUkVNT1ZFX1JFLCAnJylcbiAgICAgICAgLnJlcGxhY2UoU1BMSVRfUkUsICcsJylcbiAgICAgICAgLnJlcGxhY2UoS0VZV09SRFNfUkUsICcnKVxuICAgICAgICAucmVwbGFjZShOVU1CRVJfUkUsICcnKVxuICAgICAgICAucmVwbGFjZShCT1VOREFSWV9SRSwgJycpXG4gICAgcmV0dXJuIGNvZGVcbiAgICAgICAgPyBjb2RlLnNwbGl0KC8sKy8pXG4gICAgICAgIDogW11cbn1cblxuLyoqXG4gKiAgQSBnaXZlbiBwYXRoIGNvdWxkIHBvdGVudGlhbGx5IGV4aXN0IG5vdCBvbiB0aGVcbiAqICBjdXJyZW50IGNvbXBpbGVyLCBidXQgdXAgaW4gdGhlIHBhcmVudCBjaGFpbiBzb21ld2hlcmUuXG4gKiAgVGhpcyBmdW5jdGlvbiBnZW5lcmF0ZXMgYW4gYWNjZXNzIHJlbGF0aW9uc2hpcCBzdHJpbmdcbiAqICB0aGF0IGNhbiBiZSB1c2VkIGluIHRoZSBnZXR0ZXIgZnVuY3Rpb24gYnkgd2Fsa2luZyB1cFxuICogIHRoZSBwYXJlbnQgY2hhaW4gdG8gY2hlY2sgZm9yIGtleSBleGlzdGVuY2UuXG4gKlxuICogIEl0IHN0b3BzIGF0IHRvcCBwYXJlbnQgaWYgbm8gdm0gaW4gdGhlIGNoYWluIGhhcyB0aGVcbiAqICBrZXkuIEl0IHRoZW4gY3JlYXRlcyBhbnkgbWlzc2luZyBiaW5kaW5ncyBvbiB0aGVcbiAqICBmaW5hbCByZXNvbHZlZCB2bS5cbiAqL1xuZnVuY3Rpb24gdHJhY2VTY29wZSAocGF0aCwgY29tcGlsZXIsIGRhdGEpIHtcbiAgICB2YXIgcmVsICA9ICcnLFxuICAgICAgICBkaXN0ID0gMCxcbiAgICAgICAgc2VsZiA9IGNvbXBpbGVyXG5cbiAgICBpZiAoZGF0YSAmJiB1dGlscy5nZXQoZGF0YSwgcGF0aCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBoYWNrOiB0ZW1wb3JhcmlseSBhdHRhY2hlZCBkYXRhXG4gICAgICAgIHJldHVybiAnJHRlbXAuJ1xuICAgIH1cblxuICAgIHdoaWxlIChjb21waWxlcikge1xuICAgICAgICBpZiAoY29tcGlsZXIuaGFzS2V5KHBhdGgpKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGlsZXIgPSBjb21waWxlci5wYXJlbnRcbiAgICAgICAgICAgIGRpc3QrK1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjb21waWxlcikge1xuICAgICAgICB3aGlsZSAoZGlzdC0tKSB7XG4gICAgICAgICAgICByZWwgKz0gJyRwYXJlbnQuJ1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29tcGlsZXIuYmluZGluZ3NbcGF0aF0gJiYgcGF0aC5jaGFyQXQoMCkgIT09ICckJykge1xuICAgICAgICAgICAgY29tcGlsZXIuY3JlYXRlQmluZGluZyhwYXRoKVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5jcmVhdGVCaW5kaW5nKHBhdGgpXG4gICAgfVxuICAgIHJldHVybiByZWxcbn1cblxuLyoqXG4gKiAgQ3JlYXRlIGEgZnVuY3Rpb24gZnJvbSBhIHN0cmluZy4uLlxuICogIHRoaXMgbG9va3MgbGlrZSBldmlsIG1hZ2ljIGJ1dCBzaW5jZSBhbGwgdmFyaWFibGVzIGFyZSBsaW1pdGVkXG4gKiAgdG8gdGhlIFZNJ3MgZGF0YSBpdCdzIGFjdHVhbGx5IHByb3Blcmx5IHNhbmRib3hlZFxuICovXG5mdW5jdGlvbiBtYWtlR2V0dGVyIChleHAsIHJhdykge1xuICAgIHZhciBmblxuICAgIHRyeSB7XG4gICAgICAgIGZuID0gbmV3IEZ1bmN0aW9uKGV4cClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHV0aWxzLndhcm4oJ0Vycm9yIHBhcnNpbmcgZXhwcmVzc2lvbjogJyArIHJhdylcbiAgICB9XG4gICAgcmV0dXJuIGZuXG59XG5cbi8qKlxuICogIEVzY2FwZSBhIGxlYWRpbmcgZG9sbGFyIHNpZ24gZm9yIHJlZ2V4IGNvbnN0cnVjdGlvblxuICovXG5mdW5jdGlvbiBlc2NhcGVEb2xsYXIgKHYpIHtcbiAgICByZXR1cm4gdi5jaGFyQXQoMCkgPT09ICckJ1xuICAgICAgICA/ICdcXFxcJyArIHZcbiAgICAgICAgOiB2XG59XG5cbi8qKlxuICogIFBhcnNlIGFuZCByZXR1cm4gYW4gYW5vbnltb3VzIGNvbXB1dGVkIHByb3BlcnR5IGdldHRlciBmdW5jdGlvblxuICogIGZyb20gYW4gYXJiaXRyYXJ5IGV4cHJlc3Npb24sIHRvZ2V0aGVyIHdpdGggYSBsaXN0IG9mIHBhdGhzIHRvIGJlXG4gKiAgY3JlYXRlZCBhcyBiaW5kaW5ncy5cbiAqL1xuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChleHAsIGNvbXBpbGVyLCBkYXRhKSB7XG4gICAgLy8gdW5pY29kZSBhbmQgJ2NvbnN0cnVjdG9yJyBhcmUgbm90IGFsbG93ZWQgZm9yIFhTUyBzZWN1cml0eS5cbiAgICBpZiAoVU5JQ09ERV9SRS50ZXN0KGV4cCkgfHwgQ1RPUl9SRS50ZXN0KGV4cCkpIHtcbiAgICAgICAgdXRpbHMud2FybignVW5zYWZlIGV4cHJlc3Npb246ICcgKyBleHApXG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBleHRyYWN0IHZhcmlhYmxlIG5hbWVzXG4gICAgdmFyIHZhcnMgPSBnZXRWYXJpYWJsZXMoZXhwKVxuICAgIGlmICghdmFycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VHZXR0ZXIoJ3JldHVybiAnICsgZXhwLCBleHApXG4gICAgfVxuICAgIHZhcnMgPSB1dGlscy51bmlxdWUodmFycylcblxuICAgIHZhciBhY2Nlc3NvcnMgPSAnJyxcbiAgICAgICAgaGFzICAgICAgID0gdXRpbHMuaGFzaCgpLFxuICAgICAgICBzdHJpbmdzICAgPSBbXSxcbiAgICAgICAgLy8gY29uc3RydWN0IGEgcmVnZXggdG8gZXh0cmFjdCBhbGwgdmFsaWQgdmFyaWFibGUgcGF0aHNcbiAgICAgICAgLy8gb25lcyB0aGF0IGJlZ2luIHdpdGggXCIkXCIgYXJlIHBhcnRpY3VsYXJseSB0cmlja3lcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSBjYW4ndCB1c2UgXFxiIGZvciB0aGVtXG4gICAgICAgIHBhdGhSRSA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICBcIlteJFxcXFx3XFxcXC5dKFwiICtcbiAgICAgICAgICAgIHZhcnMubWFwKGVzY2FwZURvbGxhcikuam9pbignfCcpICtcbiAgICAgICAgICAgIFwiKVskXFxcXHdcXFxcLl0qXFxcXGJcIiwgJ2cnXG4gICAgICAgICksXG4gICAgICAgIGJvZHkgPSAoJyAnICsgZXhwKVxuICAgICAgICAgICAgLnJlcGxhY2UoU1RSX1NBVkVfUkUsIHNhdmVTdHJpbmdzKVxuICAgICAgICAgICAgLnJlcGxhY2UocGF0aFJFLCByZXBsYWNlUGF0aClcbiAgICAgICAgICAgIC5yZXBsYWNlKFNUUl9SRVNUT1JFX1JFLCByZXN0b3JlU3RyaW5ncylcblxuICAgIGJvZHkgPSBhY2Nlc3NvcnMgKyAncmV0dXJuICcgKyBib2R5XG5cbiAgICBmdW5jdGlvbiBzYXZlU3RyaW5ncyAoc3RyKSB7XG4gICAgICAgIHZhciBpID0gc3RyaW5ncy5sZW5ndGhcbiAgICAgICAgLy8gZXNjYXBlIG5ld2xpbmVzIGluIHN0cmluZ3Mgc28gdGhlIGV4cHJlc3Npb25cbiAgICAgICAgLy8gY2FuIGJlIGNvcnJlY3RseSBldmFsdWF0ZWRcbiAgICAgICAgc3RyaW5nc1tpXSA9IHN0ci5yZXBsYWNlKE5FV0xJTkVfUkUsICdcXFxcbicpXG4gICAgICAgIHJldHVybiAnXCInICsgaSArICdcIidcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlUGF0aCAocGF0aCkge1xuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBmaXJzdCBjaGFyXG4gICAgICAgIHZhciBjID0gcGF0aC5jaGFyQXQoMClcbiAgICAgICAgcGF0aCA9IHBhdGguc2xpY2UoMSlcbiAgICAgICAgdmFyIHZhbCA9ICd0aGlzLicgKyB0cmFjZVNjb3BlKHBhdGgsIGNvbXBpbGVyLCBkYXRhKSArIHBhdGhcbiAgICAgICAgaWYgKCFoYXNbcGF0aF0pIHtcbiAgICAgICAgICAgIGFjY2Vzc29ycyArPSB2YWwgKyAnOydcbiAgICAgICAgICAgIGhhc1twYXRoXSA9IDFcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCBmb3JnZXQgdG8gcHV0IHRoYXQgZmlyc3QgY2hhciBiYWNrXG4gICAgICAgIHJldHVybiBjICsgdmFsXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzdG9yZVN0cmluZ3MgKHN0ciwgaSkge1xuICAgICAgICByZXR1cm4gc3RyaW5nc1tpXVxuICAgIH1cblxuICAgIHJldHVybiBtYWtlR2V0dGVyKGJvZHksIGV4cClcbn1cblxuLyoqXG4gKiAgRXZhbHVhdGUgYW4gZXhwcmVzc2lvbiBpbiB0aGUgY29udGV4dCBvZiBhIGNvbXBpbGVyLlxuICogIEFjY2VwdHMgYWRkaXRpb25hbCBkYXRhLlxuICovXG5leHBvcnRzLmV2YWwgPSBmdW5jdGlvbiAoZXhwLCBjb21waWxlciwgZGF0YSkge1xuICAgIHZhciBnZXR0ZXIgPSBleHBvcnRzLnBhcnNlKGV4cCwgY29tcGlsZXIsIGRhdGEpLCByZXNcbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgIC8vIGhhY2s6IHRlbXBvcmFyaWx5IGF0dGFjaCB0aGUgYWRkaXRpb25hbCBkYXRhIHNvXG4gICAgICAgIC8vIGl0IGNhbiBiZSBhY2Nlc3NlZCBpbiB0aGUgZ2V0dGVyXG4gICAgICAgIGNvbXBpbGVyLnZtLiR0ZW1wID0gZGF0YVxuICAgICAgICByZXMgPSBnZXR0ZXIuY2FsbChjb21waWxlci52bSlcbiAgICAgICAgZGVsZXRlIGNvbXBpbGVyLnZtLiR0ZW1wXG4gICAgfVxuICAgIHJldHVybiByZXNcbn0iLCJ2YXIgdXRpbHMgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgZ2V0ICAgICAgPSB1dGlscy5nZXQsXG4gICAgc2xpY2UgICAgPSBbXS5zbGljZSxcbiAgICBRVU9URV9SRSA9IC9eJy4qJyQvLFxuICAgIGZpbHRlcnMgID0gbW9kdWxlLmV4cG9ydHMgPSB1dGlscy5oYXNoKClcblxuLyoqXG4gKiAgJ2FiYycgPT4gJ0FiYydcbiAqL1xuZmlsdGVycy5jYXBpdGFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiAgJ2FiYycgPT4gJ0FCQydcbiAqL1xuZmlsdGVycy51cHBlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgICAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKVxuICAgICAgICA6ICcnXG59XG5cbi8qKlxuICogICdBYkMnID0+ICdhYmMnXG4gKi9cbmZpbHRlcnMubG93ZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICAgICAgPyB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgOiAnJ1xufVxuXG4vKipcbiAqICAxMjM0NSA9PiAkMTIsMzQ1LjAwXG4gKi9cbmZpbHRlcnMuY3VycmVuY3kgPSBmdW5jdGlvbiAodmFsdWUsIHNpZ24pIHtcbiAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnXG4gICAgc2lnbiA9IHNpZ24gfHwgJyQnXG4gICAgdmFyIHMgPSBNYXRoLmZsb29yKHZhbHVlKS50b1N0cmluZygpLFxuICAgICAgICBpID0gcy5sZW5ndGggJSAzLFxuICAgICAgICBoID0gaSA+IDAgPyAocy5zbGljZSgwLCBpKSArIChzLmxlbmd0aCA+IDMgPyAnLCcgOiAnJykpIDogJycsXG4gICAgICAgIGYgPSAnLicgKyB2YWx1ZS50b0ZpeGVkKDIpLnNsaWNlKC0yKVxuICAgIHJldHVybiBzaWduICsgaCArIHMuc2xpY2UoaSkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csICckMSwnKSArIGZcbn1cblxuLyoqXG4gKiAgYXJnczogYW4gYXJyYXkgb2Ygc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvXG4gKiAgdGhlIHNpbmdsZSwgZG91YmxlLCB0cmlwbGUgLi4uIGZvcm1zIG9mIHRoZSB3b3JkIHRvXG4gKiAgYmUgcGx1cmFsaXplZC4gV2hlbiB0aGUgbnVtYmVyIHRvIGJlIHBsdXJhbGl6ZWRcbiAqICBleGNlZWRzIHRoZSBsZW5ndGggb2YgdGhlIGFyZ3MsIGl0IHdpbGwgdXNlIHRoZSBsYXN0XG4gKiAgZW50cnkgaW4gdGhlIGFycmF5LlxuICpcbiAqICBlLmcuIFsnc2luZ2xlJywgJ2RvdWJsZScsICd0cmlwbGUnLCAnbXVsdGlwbGUnXVxuICovXG5maWx0ZXJzLnBsdXJhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMVxuICAgICAgICA/IChhcmdzW3ZhbHVlIC0gMV0gfHwgYXJnc1thcmdzLmxlbmd0aCAtIDFdKVxuICAgICAgICA6IChhcmdzW3ZhbHVlIC0gMV0gfHwgYXJnc1swXSArICdzJylcbn1cblxuLyoqXG4gKiAgQSBzcGVjaWFsIGZpbHRlciB0aGF0IHRha2VzIGEgaGFuZGxlciBmdW5jdGlvbixcbiAqICB3cmFwcyBpdCBzbyBpdCBvbmx5IGdldHMgdHJpZ2dlcmVkIG9uIHNwZWNpZmljIGtleXByZXNzZXMuXG4gKlxuICogIHYtb24gb25seVxuICovXG5cbnZhciBrZXlDb2RlcyA9IHtcbiAgICBlbnRlciAgICA6IDEzLFxuICAgIHRhYiAgICAgIDogOSxcbiAgICAnZGVsZXRlJyA6IDQ2LFxuICAgIHVwICAgICAgIDogMzgsXG4gICAgbGVmdCAgICAgOiAzNyxcbiAgICByaWdodCAgICA6IDM5LFxuICAgIGRvd24gICAgIDogNDAsXG4gICAgZXNjICAgICAgOiAyN1xufVxuXG5maWx0ZXJzLmtleSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBrZXkpIHtcbiAgICBpZiAoIWhhbmRsZXIpIHJldHVyblxuICAgIHZhciBjb2RlID0ga2V5Q29kZXNba2V5XVxuICAgIGlmICghY29kZSkge1xuICAgICAgICBjb2RlID0gcGFyc2VJbnQoa2V5LCAxMClcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqL1xuZmlsdGVycy5maWx0ZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNlYXJjaEtleSwgZGVsaW1pdGVyLCBkYXRhS2V5KSB7XG5cbiAgICAvLyBhbGxvdyBvcHRpb25hbCBgaW5gIGRlbGltaXRlclxuICAgIC8vIGJlY2F1c2Ugd2h5IG5vdFxuICAgIGlmIChkZWxpbWl0ZXIgJiYgZGVsaW1pdGVyICE9PSAnaW4nKSB7XG4gICAgICAgIGRhdGFLZXkgPSBkZWxpbWl0ZXJcbiAgICB9XG5cbiAgICAvLyBnZXQgdGhlIHNlYXJjaCBzdHJpbmdcbiAgICB2YXIgc2VhcmNoID0gc3RyaXBRdW90ZXMoc2VhcmNoS2V5KSB8fCB0aGlzLiRnZXQoc2VhcmNoS2V5KVxuICAgIGlmICghc2VhcmNoKSByZXR1cm4gYXJyXG4gICAgc2VhcmNoID0gc2VhcmNoLnRvTG93ZXJDYXNlKClcblxuICAgIC8vIGdldCB0aGUgb3B0aW9uYWwgZGF0YUtleVxuICAgIGRhdGFLZXkgPSBkYXRhS2V5ICYmIChzdHJpcFF1b3RlcyhkYXRhS2V5KSB8fCB0aGlzLiRnZXQoZGF0YUtleSkpXG5cbiAgICAvLyBjb252ZXJ0IG9iamVjdCB0byBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IHV0aWxzLm9iamVjdFRvQXJyYXkoYXJyKVxuICAgIH1cblxuICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBkYXRhS2V5XG4gICAgICAgICAgICA/IGNvbnRhaW5zKGdldChpdGVtLCBkYXRhS2V5KSwgc2VhcmNoKVxuICAgICAgICAgICAgOiBjb250YWlucyhpdGVtLCBzZWFyY2gpXG4gICAgfSlcblxufVxuXG5maWx0ZXJzLmZpbHRlckJ5LmNvbXB1dGVkID0gdHJ1ZVxuXG4vKipcbiAqICBTb3J0IGZpdGxlciBmb3Igdi1yZXBlYXRcbiAqL1xuZmlsdGVycy5vcmRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc29ydEtleSwgcmV2ZXJzZUtleSkge1xuXG4gICAgdmFyIGtleSA9IHN0cmlwUXVvdGVzKHNvcnRLZXkpIHx8IHRoaXMuJGdldChzb3J0S2V5KVxuICAgIGlmICgha2V5KSByZXR1cm4gYXJyXG5cbiAgICAvLyBjb252ZXJ0IG9iamVjdCB0byBhcnJheVxuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IHV0aWxzLm9iamVjdFRvQXJyYXkoYXJyKVxuICAgIH1cblxuICAgIHZhciBvcmRlciA9IDFcbiAgICBpZiAocmV2ZXJzZUtleSkge1xuICAgICAgICBpZiAocmV2ZXJzZUtleSA9PT0gJy0xJykge1xuICAgICAgICAgICAgb3JkZXIgPSAtMVxuICAgICAgICB9IGVsc2UgaWYgKHJldmVyc2VLZXkuY2hhckF0KDApID09PSAnIScpIHtcbiAgICAgICAgICAgIHJldmVyc2VLZXkgPSByZXZlcnNlS2V5LnNsaWNlKDEpXG4gICAgICAgICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IDEgOiAtMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAtMSA6IDFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNvcnQgb24gYSBjb3B5IHRvIGF2b2lkIG11dGF0aW5nIG9yaWdpbmFsIGFycmF5XG4gICAgcmV0dXJuIGFyci5zbGljZSgpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgYSA9IGdldChhLCBrZXkpXG4gICAgICAgIGIgPSBnZXQoYiwga2V5KVxuICAgICAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhID4gYiA/IG9yZGVyIDogLW9yZGVyXG4gICAgfSlcblxufVxuXG5maWx0ZXJzLm9yZGVyQnkuY29tcHV0ZWQgPSB0cnVlXG5cbi8vIEFycmF5IGZpbHRlciBoZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiAgU3RyaW5nIGNvbnRhaW4gaGVscGVyXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zICh2YWwsIHNlYXJjaCkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgaWYgKHV0aWxzLmlzT2JqZWN0KHZhbCkpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5zKHZhbFtrZXldLCBzZWFyY2gpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHZhbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTFcbiAgICB9XG59XG5cbi8qKlxuICogIFRlc3Qgd2hldGhlciBhIHN0cmluZyBpcyBpbiBxdW90ZXMsXG4gKiAgaWYgeWVzIHJldHVybiBzdHJpcHBlZCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gc3RyaXBRdW90ZXMgKHN0cikge1xuICAgIGlmIChRVU9URV9SRS50ZXN0KHN0cikpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zbGljZSgxLCAtMSlcbiAgICB9XG59IiwiLy8gc3RyaW5nIC0+IERPTSBjb252ZXJzaW9uXG4vLyB3cmFwcGVycyBvcmlnaW5hbGx5IGZyb20galF1ZXJ5LCBzY29vcGVkIGZyb20gY29tcG9uZW50L2RvbWlmeVxudmFyIG1hcCA9IHtcbiAgICBsZWdlbmQgICA6IFsxLCAnPGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PiddLFxuICAgIHRyICAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gICAgY29sICAgICAgOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXSxcbiAgICBfZGVmYXVsdCA6IFswLCAnJywgJyddXG59XG5cbm1hcC50ZCA9XG5tYXAudGggPSBbMywgJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXVxuXG5tYXAub3B0aW9uID1cbm1hcC5vcHRncm91cCA9IFsxLCAnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JywgJzwvc2VsZWN0PiddXG5cbm1hcC50aGVhZCA9XG5tYXAudGJvZHkgPVxubWFwLmNvbGdyb3VwID1cbm1hcC5jYXB0aW9uID1cbm1hcC50Zm9vdCA9IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddXG5cbm1hcC50ZXh0ID1cbm1hcC5jaXJjbGUgPVxubWFwLmVsbGlwc2UgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnBvbHlnb24gPVxubWFwLnBvbHlsaW5lID1cbm1hcC5yZWN0ID0gWzEsICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCI+JywnPC9zdmc+J11cblxudmFyIFRBR19SRSA9IC88KFtcXHc6XSspL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVN0cmluZykge1xuICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICBtID0gVEFHX1JFLmV4ZWModGVtcGxhdGVTdHJpbmcpXG4gICAgLy8gdGV4dCBvbmx5XG4gICAgaWYgKCFtKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGVtcGxhdGVTdHJpbmcpKVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgIH1cblxuICAgIHZhciB0YWcgPSBtWzFdLFxuICAgICAgICB3cmFwID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0LFxuICAgICAgICBkZXB0aCA9IHdyYXBbMF0sXG4gICAgICAgIHByZWZpeCA9IHdyYXBbMV0sXG4gICAgICAgIHN1ZmZpeCA9IHdyYXBbMl0sXG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZy50cmltKCkgKyBzdWZmaXhcbiAgICB3aGlsZSAoZGVwdGgtLSkgbm9kZSA9IG5vZGUubGFzdENoaWxkXG5cbiAgICAvLyBvbmUgZWxlbWVudFxuICAgIGlmIChub2RlLmZpcnN0Q2hpbGQgPT09IG5vZGUubGFzdENoaWxkKSB7XG4gICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQobm9kZS5maXJzdENoaWxkKVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgIH1cblxuICAgIC8vIG11bHRpcGxlIG5vZGVzLCByZXR1cm4gYSBmcmFnbWVudFxuICAgIHZhciBjaGlsZFxuICAgIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gICAgd2hpbGUgKGNoaWxkID0gbm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmcmFnXG59IiwidmFyIGNvbmZpZyAgICAgID0gcmVxdWlyZSgnLi9jb25maWcnKSxcbiAgICBWaWV3TW9kZWwgICA9IHJlcXVpcmUoJy4vdmlld21vZGVsJyksXG4gICAgdXRpbHMgICAgICAgPSByZXF1aXJlKCcuL3V0aWxzJyksXG4gICAgbWFrZUhhc2ggICAgPSB1dGlscy5oYXNoLFxuICAgIGFzc2V0VHlwZXMgID0gWydkaXJlY3RpdmUnLCAnZmlsdGVyJywgJ3BhcnRpYWwnLCAnZWZmZWN0JywgJ2NvbXBvbmVudCddLFxuICAgIC8vIEludGVybmFsIG1vZHVsZXMgdGhhdCBhcmUgZXhwb3NlZCBmb3IgcGx1Z2luc1xuICAgIHBsdWdpbkFQSSAgID0ge1xuICAgICAgICB1dGlsczogdXRpbHMsXG4gICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICB0cmFuc2l0aW9uOiByZXF1aXJlKCcuL3RyYW5zaXRpb24nKSxcbiAgICAgICAgb2JzZXJ2ZXI6IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKVxuICAgIH1cblxuVmlld01vZGVsLm9wdGlvbnMgPSBjb25maWcuZ2xvYmFsQXNzZXRzID0ge1xuICAgIGRpcmVjdGl2ZXMgIDogcmVxdWlyZSgnLi9kaXJlY3RpdmVzJyksXG4gICAgZmlsdGVycyAgICAgOiByZXF1aXJlKCcuL2ZpbHRlcnMnKSxcbiAgICBwYXJ0aWFscyAgICA6IG1ha2VIYXNoKCksXG4gICAgZWZmZWN0cyAgICAgOiBtYWtlSGFzaCgpLFxuICAgIGNvbXBvbmVudHMgIDogbWFrZUhhc2goKVxufVxuXG4vKipcbiAqICBFeHBvc2UgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHNcbiAqL1xuYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgVmlld01vZGVsW3R5cGVdID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuICAgICAgICB2YXIgaGFzaCA9IHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVxuICAgICAgICBpZiAoIWhhc2gpIHtcbiAgICAgICAgICAgIGhhc2ggPSB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ10gPSBtYWtlSGFzaCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGhhc2hbaWRdXG4gICAgICAgIGlmICh0eXBlID09PSAncGFydGlhbCcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdXRpbHMucGFyc2VUZW1wbGF0ZU9wdGlvbih2YWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY29tcG9uZW50Jykge1xuICAgICAgICAgICAgdmFsdWUgPSB1dGlscy50b0NvbnN0cnVjdG9yKHZhbHVlKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmaWx0ZXInKSB7XG4gICAgICAgICAgICB1dGlscy5jaGVja0ZpbHRlcih2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBoYXNoW2lkXSA9IHZhbHVlXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufSlcblxuLyoqXG4gKiAgU2V0IGNvbmZpZyBvcHRpb25zXG4gKi9cblZpZXdNb2RlbC5jb25maWcgPSBmdW5jdGlvbiAob3B0cywgdmFsKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWdbb3B0c11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ1tvcHRzXSA9IHZhbFxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdXRpbHMuZXh0ZW5kKGNvbmZpZywgb3B0cylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiAgRXhwb3NlIGFuIGludGVyZmFjZSBmb3IgcGx1Z2luc1xuICovXG5WaWV3TW9kZWwudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGx1Z2luID0gcmVxdWlyZShwbHVnaW4pXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHV0aWxzLndhcm4oJ0Nhbm5vdCBmaW5kIHBsdWdpbjogJyArIHBsdWdpbilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICBhcmdzLnVuc2hpZnQodGhpcylcblxuICAgIGlmICh0eXBlb2YgcGx1Z2luLmluc3RhbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqICBFeHBvc2UgaW50ZXJuYWwgbW9kdWxlcyBmb3IgcGx1Z2luc1xuICovXG5WaWV3TW9kZWwucmVxdWlyZSA9IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICByZXR1cm4gcGx1Z2luQVBJW21vZHVsZV1cbn1cblxuVmlld01vZGVsLmV4dGVuZCA9IGV4dGVuZFxuVmlld01vZGVsLm5leHRUaWNrID0gdXRpbHMubmV4dFRpY2tcblxuLyoqXG4gKiAgRXhwb3NlIHRoZSBtYWluIFZpZXdNb2RlbCBjbGFzc1xuICogIGFuZCBhZGQgZXh0ZW5kIG1ldGhvZFxuICovXG5mdW5jdGlvbiBleHRlbmQgKG9wdGlvbnMpIHtcblxuICAgIHZhciBQYXJlbnRWTSA9IHRoaXNcblxuICAgIC8vIGV4dGVuZCBkYXRhIG9wdGlvbnMgbmVlZCB0byBiZSBjb3BpZWRcbiAgICAvLyBvbiBpbnN0YW50aWF0aW9uXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgICBvcHRpb25zLmRlZmF1bHREYXRhID0gb3B0aW9ucy5kYXRhXG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLmRhdGFcbiAgICB9XG5cbiAgICAvLyBpbmhlcml0IG9wdGlvbnNcbiAgICAvLyBidXQgb25seSB3aGVuIHRoZSBzdXBlciBjbGFzcyBpcyBub3QgdGhlIG5hdGl2ZSBWdWUuXG4gICAgaWYgKFBhcmVudFZNICE9PSBWaWV3TW9kZWwpIHtcbiAgICAgICAgb3B0aW9ucyA9IGluaGVyaXRPcHRpb25zKG9wdGlvbnMsIFBhcmVudFZNLm9wdGlvbnMsIHRydWUpXG4gICAgfVxuICAgIHV0aWxzLnByb2Nlc3NPcHRpb25zKG9wdGlvbnMpXG5cbiAgICB2YXIgRXh0ZW5kZWRWTSA9IGZ1bmN0aW9uIChvcHRzLCBhc1BhcmVudCkge1xuICAgICAgICBpZiAoIWFzUGFyZW50KSB7XG4gICAgICAgICAgICBvcHRzID0gaW5oZXJpdE9wdGlvbnMob3B0cywgb3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBQYXJlbnRWTS5jYWxsKHRoaXMsIG9wdHMsIHRydWUpXG4gICAgfVxuXG4gICAgLy8gaW5oZXJpdCBwcm90b3R5cGUgcHJvcHNcbiAgICB2YXIgcHJvdG8gPSBFeHRlbmRlZFZNLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGFyZW50Vk0ucHJvdG90eXBlKVxuICAgIHV0aWxzLmRlZlByb3RlY3RlZChwcm90bywgJ2NvbnN0cnVjdG9yJywgRXh0ZW5kZWRWTSlcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIGJlIGZ1cnRoZXIgZXh0ZW5kZWRcbiAgICBFeHRlbmRlZFZNLmV4dGVuZCAgPSBleHRlbmRcbiAgICBFeHRlbmRlZFZNLnN1cGVyICAgPSBQYXJlbnRWTVxuICAgIEV4dGVuZGVkVk0ub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIGFkZCBpdHMgb3duIGFzc2V0c1xuICAgIGFzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBFeHRlbmRlZFZNW3R5cGVdID0gVmlld01vZGVsW3R5cGVdXG4gICAgfSlcblxuICAgIC8vIGFsbG93IGV4dGVuZGVkIFZNIHRvIHVzZSBwbHVnaW5zXG4gICAgRXh0ZW5kZWRWTS51c2UgICAgID0gVmlld01vZGVsLnVzZVxuICAgIEV4dGVuZGVkVk0ucmVxdWlyZSA9IFZpZXdNb2RlbC5yZXF1aXJlXG5cbiAgICByZXR1cm4gRXh0ZW5kZWRWTVxufVxuXG4vKipcbiAqICBJbmhlcml0IG9wdGlvbnNcbiAqXG4gKiAgRm9yIG9wdGlvbnMgc3VjaCBhcyBgZGF0YWAsIGB2bXNgLCBgZGlyZWN0aXZlc2AsICdwYXJ0aWFscycsXG4gKiAgdGhleSBzaG91bGQgYmUgZnVydGhlciBleHRlbmRlZC4gSG93ZXZlciBleHRlbmRpbmcgc2hvdWxkIG9ubHlcbiAqICBiZSBkb25lIGF0IHRvcCBsZXZlbC5cbiAqICBcbiAqICBgcHJvdG9gIGlzIGFuIGV4Y2VwdGlvbiBiZWNhdXNlIGl0J3MgaGFuZGxlZCBkaXJlY3RseSBvbiB0aGVcbiAqICBwcm90b3R5cGUuXG4gKlxuICogIGBlbGAgaXMgYW4gZXhjZXB0aW9uIGJlY2F1c2UgaXQncyBub3QgYWxsb3dlZCBhcyBhblxuICogIGV4dGVuc2lvbiBvcHRpb24sIGJ1dCBvbmx5IGFzIGFuIGluc3RhbmNlIG9wdGlvbi5cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdE9wdGlvbnMgKGNoaWxkLCBwYXJlbnQsIHRvcExldmVsKSB7XG4gICAgY2hpbGQgPSBjaGlsZCB8fCB7fVxuICAgIGlmICghcGFyZW50KSByZXR1cm4gY2hpbGRcbiAgICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdlbCcpIGNvbnRpbnVlXG4gICAgICAgIHZhciB2YWwgPSBjaGlsZFtrZXldLFxuICAgICAgICAgICAgcGFyZW50VmFsID0gcGFyZW50W2tleV1cbiAgICAgICAgaWYgKHRvcExldmVsICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgJiYgcGFyZW50VmFsKSB7XG4gICAgICAgICAgICAvLyBtZXJnZSBob29rIGZ1bmN0aW9ucyBpbnRvIGFuIGFycmF5XG4gICAgICAgICAgICBjaGlsZFtrZXldID0gW3ZhbF1cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudFZhbCkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFtrZXldID0gY2hpbGRba2V5XS5jb25jYXQocGFyZW50VmFsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjaGlsZFtrZXldLnB1c2gocGFyZW50VmFsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdG9wTGV2ZWwgJiZcbiAgICAgICAgICAgICh1dGlscy5pc1RydWVPYmplY3QodmFsKSB8fCB1dGlscy5pc1RydWVPYmplY3QocGFyZW50VmFsKSlcbiAgICAgICAgICAgICYmICEocGFyZW50VmFsIGluc3RhbmNlb2YgVmlld01vZGVsKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHRvcGxldmVsIG9iamVjdCBvcHRpb25zXG4gICAgICAgICAgICBjaGlsZFtrZXldID0gaW5oZXJpdE9wdGlvbnModmFsLCBwYXJlbnRWYWwpXG4gICAgICAgIH0gZWxzZSBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGluaGVyaXQgaWYgY2hpbGQgZG9lc24ndCBvdmVycmlkZVxuICAgICAgICAgICAgY2hpbGRba2V5XSA9IHBhcmVudFZhbFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjaGlsZFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2RlbCIsIi8qIGpzaGludCBwcm90bzp0cnVlICovXG5cbnZhciBFbWl0dGVyICA9IHJlcXVpcmUoJy4vZW1pdHRlcicpLFxuICAgIHV0aWxzICAgID0gcmVxdWlyZSgnLi91dGlscycpLFxuICAgIC8vIGNhY2hlIG1ldGhvZHNcbiAgICBkZWYgICAgICA9IHV0aWxzLmRlZlByb3RlY3RlZCxcbiAgICBpc09iamVjdCA9IHV0aWxzLmlzT2JqZWN0LFxuICAgIGlzQXJyYXkgID0gQXJyYXkuaXNBcnJheSxcbiAgICBoYXNPd24gICA9ICh7fSkuaGFzT3duUHJvcGVydHksXG4gICAgb0RlZiAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgc2xpY2UgICAgPSBbXS5zbGljZSxcbiAgICAvLyBmaXggZm9yIElFICsgX19wcm90b19fIHByb2JsZW1cbiAgICAvLyBkZWZpbmUgbWV0aG9kcyBhcyBpbmVudW1lcmFibGUgaWYgX19wcm90b19fIGlzIHByZXNlbnQsXG4gICAgLy8gb3RoZXJ3aXNlIGVudW1lcmFibGUgc28gd2UgY2FuIGxvb3AgdGhyb3VnaCBhbmQgbWFudWFsbHlcbiAgICAvLyBhdHRhY2ggdG8gYXJyYXkgaW5zdGFuY2VzXG4gICAgaGFzUHJvdG8gPSAoe30pLl9fcHJvdG9fX1xuXG4vLyBBcnJheSBNdXRhdGlvbiBIYW5kbGVycyAmIEF1Z21lbnRhdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRoZSBwcm94eSBwcm90b3R5cGUgdG8gcmVwbGFjZSB0aGUgX19wcm90b19fIG9mXG4vLyBhbiBvYnNlcnZlZCBhcnJheVxudmFyIEFycmF5UHJveHkgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSlcblxuLy8gaW50ZXJjZXB0IG11dGF0aW9uIG1ldGhvZHNcbjtbXG4gICAgJ3B1c2gnLFxuICAgICdwb3AnLFxuICAgICdzaGlmdCcsXG4gICAgJ3Vuc2hpZnQnLFxuICAgICdzcGxpY2UnLFxuICAgICdzb3J0JyxcbiAgICAncmV2ZXJzZSdcbl0uZm9yRWFjaCh3YXRjaE11dGF0aW9uKVxuXG4vLyBBdWdtZW50IHRoZSBBcnJheVByb3h5IHdpdGggY29udmVuaWVuY2UgbWV0aG9kc1xuZGVmKEFycmF5UHJveHksICckc2V0JywgZnVuY3Rpb24gKGluZGV4LCBkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxLCBkYXRhKVswXVxufSwgIWhhc1Byb3RvKVxuXG5kZWYoQXJyYXlQcm94eSwgJyRyZW1vdmUnLCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhPZihpbmRleClcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxKVswXVxuICAgIH1cbn0sICFoYXNQcm90bylcblxuLyoqXG4gKiAgSW50ZXJjZXAgYSBtdXRhdGlvbiBldmVudCBzbyB3ZSBjYW4gZW1pdCB0aGUgbXV0YXRpb24gaW5mby5cbiAqICB3ZSBhbHNvIGFuYWx5emUgd2hhdCBlbGVtZW50cyBhcmUgYWRkZWQvcmVtb3ZlZCBhbmQgbGluay91bmxpbmtcbiAqICB0aGVtIHdpdGggdGhlIHBhcmVudCBBcnJheS5cbiAqL1xuZnVuY3Rpb24gd2F0Y2hNdXRhdGlvbiAobWV0aG9kKSB7XG4gICAgZGVmKEFycmF5UHJveHksIG1ldGhvZCwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpLFxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyksXG4gICAgICAgICAgICBpbnNlcnRlZCwgcmVtb3ZlZFxuXG4gICAgICAgIC8vIGRldGVybWluZSBuZXcgLyByZW1vdmVkIGVsZW1lbnRzXG4gICAgICAgIGlmIChtZXRob2QgPT09ICdwdXNoJyB8fCBtZXRob2QgPT09ICd1bnNoaWZ0Jykge1xuICAgICAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSAncG9wJyB8fCBtZXRob2QgPT09ICdzaGlmdCcpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSBbcmVzdWx0XVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gJ3NwbGljZScpIHtcbiAgICAgICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKVxuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlc3VsdFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBsaW5rICYgdW5saW5rXG4gICAgICAgIGxpbmtBcnJheUVsZW1lbnRzKHRoaXMsIGluc2VydGVkKVxuICAgICAgICB1bmxpbmtBcnJheUVsZW1lbnRzKHRoaXMsIHJlbW92ZWQpXG5cbiAgICAgICAgLy8gZW1pdCB0aGUgbXV0YXRpb24gZXZlbnRcbiAgICAgICAgdGhpcy5fX2VtaXR0ZXJfXy5lbWl0KCdtdXRhdGUnLCAnJywgdGhpcywge1xuICAgICAgICAgICAgbWV0aG9kICAgOiBtZXRob2QsXG4gICAgICAgICAgICBhcmdzICAgICA6IGFyZ3MsXG4gICAgICAgICAgICByZXN1bHQgICA6IHJlc3VsdCxcbiAgICAgICAgICAgIGluc2VydGVkIDogaW5zZXJ0ZWQsXG4gICAgICAgICAgICByZW1vdmVkICA6IHJlbW92ZWRcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgIH0sICFoYXNQcm90bylcbn1cblxuLyoqXG4gKiAgTGluayBuZXcgZWxlbWVudHMgdG8gYW4gQXJyYXksIHNvIHdoZW4gdGhleSBjaGFuZ2VcbiAqICBhbmQgZW1pdCBldmVudHMsIHRoZSBvd25lciBBcnJheSBjYW4gYmUgbm90aWZpZWQuXG4gKi9cbmZ1bmN0aW9uIGxpbmtBcnJheUVsZW1lbnRzIChhcnIsIGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gaXRlbXMubGVuZ3RoLCBpdGVtLCBvd25lcnNcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zW2ldXG4gICAgICAgICAgICBpZiAoaXNXYXRjaGFibGUoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBvYmplY3QgaXMgbm90IGNvbnZlcnRlZCBmb3Igb2JzZXJ2aW5nXG4gICAgICAgICAgICAgICAgLy8gY29udmVydCBpdC4uLlxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5fX2VtaXR0ZXJfXykge1xuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0KGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIHdhdGNoKGl0ZW0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG93bmVycyA9IGl0ZW0uX19lbWl0dGVyX18ub3duZXJzXG4gICAgICAgICAgICAgICAgaWYgKG93bmVycy5pbmRleE9mKGFycikgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVycy5wdXNoKGFycilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogIFVubGluayByZW1vdmVkIGVsZW1lbnRzIGZyb20gdGhlIGV4LW93bmVyIEFycmF5LlxuICovXG5mdW5jdGlvbiB1bmxpbmtBcnJheUVsZW1lbnRzIChhcnIsIGl0ZW1zKSB7XG4gICAgaWYgKGl0ZW1zKSB7XG4gICAgICAgIHZhciBpID0gaXRlbXMubGVuZ3RoLCBpdGVtXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpXVxuICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5fX2VtaXR0ZXJfXykge1xuICAgICAgICAgICAgICAgIHZhciBvd25lcnMgPSBpdGVtLl9fZW1pdHRlcl9fLm93bmVyc1xuICAgICAgICAgICAgICAgIGlmIChvd25lcnMpIG93bmVycy5zcGxpY2Uob3duZXJzLmluZGV4T2YoYXJyKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gT2JqZWN0IGFkZC9kZWxldGUga2V5IGF1Z21lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgT2JqUHJveHkgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUpXG5cbmRlZihPYmpQcm94eSwgJyRhZGQnLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICBpZiAoaGFzT3duLmNhbGwodGhpcywga2V5KSkgcmV0dXJuXG4gICAgdGhpc1trZXldID0gdmFsXG4gICAgY29udmVydEtleSh0aGlzLCBrZXksIHRydWUpXG59LCAhaGFzUHJvdG8pXG5cbmRlZihPYmpQcm94eSwgJyRkZWxldGUnLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoaGFzT3duLmNhbGwodGhpcywga2V5KSkpIHJldHVyblxuICAgIC8vIHRyaWdnZXIgc2V0IGV2ZW50c1xuICAgIHRoaXNba2V5XSA9IHVuZGVmaW5lZFxuICAgIGRlbGV0ZSB0aGlzW2tleV1cbiAgICB0aGlzLl9fZW1pdHRlcl9fLmVtaXQoJ2RlbGV0ZScsIGtleSlcbn0sICFoYXNQcm90bylcblxuLy8gV2F0Y2ggSGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqICBDaGVjayBpZiBhIHZhbHVlIGlzIHdhdGNoYWJsZVxuICovXG5mdW5jdGlvbiBpc1dhdGNoYWJsZSAob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAmJiAhb2JqLiRjb21waWxlclxufVxuXG4vKipcbiAqICBDb252ZXJ0IGFuIE9iamVjdC9BcnJheSB0byBnaXZlIGl0IGEgY2hhbmdlIGVtaXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnQgKG9iaikge1xuICAgIGlmIChvYmouX19lbWl0dGVyX18pIHJldHVybiB0cnVlXG4gICAgdmFyIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgZGVmKG9iaiwgJ19fZW1pdHRlcl9fJywgZW1pdHRlcilcbiAgICBlbWl0dGVyXG4gICAgICAgIC5vbignc2V0JywgZnVuY3Rpb24gKGtleSwgdmFsLCBwcm9wYWdhdGUpIHtcbiAgICAgICAgICAgIGlmIChwcm9wYWdhdGUpIHByb3BhZ2F0ZUNoYW5nZShvYmopXG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbXV0YXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJvcGFnYXRlQ2hhbmdlKG9iailcbiAgICAgICAgfSlcbiAgICBlbWl0dGVyLnZhbHVlcyA9IHV0aWxzLmhhc2goKVxuICAgIGVtaXR0ZXIub3duZXJzID0gW11cbiAgICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiAgUHJvcGFnYXRlIGFuIGFycmF5IGVsZW1lbnQncyBjaGFuZ2UgdG8gaXRzIG93bmVyIGFycmF5c1xuICovXG5mdW5jdGlvbiBwcm9wYWdhdGVDaGFuZ2UgKG9iaikge1xuICAgIHZhciBvd25lcnMgPSBvYmouX19lbWl0dGVyX18ub3duZXJzLFxuICAgICAgICBpID0gb3duZXJzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgb3duZXJzW2ldLl9fZW1pdHRlcl9fLmVtaXQoJ3NldCcsICcnLCAnJywgdHJ1ZSlcbiAgICB9XG59XG5cbi8qKlxuICogIFdhdGNoIHRhcmdldCBiYXNlZCBvbiBpdHMgdHlwZVxuICovXG5mdW5jdGlvbiB3YXRjaCAob2JqKSB7XG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICB3YXRjaEFycmF5KG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXRjaE9iamVjdChvYmopXG4gICAgfVxufVxuXG4vKipcbiAqICBBdWdtZW50IHRhcmdldCBvYmplY3RzIHdpdGggbW9kaWZpZWRcbiAqICBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIGF1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gICAgaWYgKGhhc1Byb3RvKSB7XG4gICAgICAgIHRhcmdldC5fX3Byb3RvX18gPSBzcmNcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICAgICAgICBkZWYodGFyZ2V0LCBrZXksIHNyY1trZXldKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICBXYXRjaCBhbiBPYmplY3QsIHJlY3Vyc2l2ZS5cbiAqL1xuZnVuY3Rpb24gd2F0Y2hPYmplY3QgKG9iaikge1xuICAgIGF1Z21lbnQob2JqLCBPYmpQcm94eSlcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGNvbnZlcnRLZXkob2JqLCBrZXkpXG4gICAgfVxufVxuXG4vKipcbiAqICBXYXRjaCBhbiBBcnJheSwgb3ZlcmxvYWQgbXV0YXRpb24gbWV0aG9kc1xuICogIGFuZCBhZGQgYXVnbWVudGF0aW9ucyBieSBpbnRlcmNlcHRpbmcgdGhlIHByb3RvdHlwZSBjaGFpblxuICovXG5mdW5jdGlvbiB3YXRjaEFycmF5IChhcnIpIHtcbiAgICBhdWdtZW50KGFyciwgQXJyYXlQcm94eSlcbiAgICBsaW5rQXJyYXlFbGVtZW50cyhhcnIsIGFycilcbn1cblxuLyoqXG4gKiAgRGVmaW5lIGFjY2Vzc29ycyBmb3IgYSBwcm9wZXJ0eSBvbiBhbiBPYmplY3RcbiAqICBzbyBpdCBlbWl0cyBnZXQvc2V0IGV2ZW50cy5cbiAqICBUaGVuIHdhdGNoIHRoZSB2YWx1ZSBpdHNlbGYuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRLZXkgKG9iaiwga2V5LCBwcm9wYWdhdGUpIHtcbiAgICB2YXIga2V5UHJlZml4ID0ga2V5LmNoYXJBdCgwKVxuICAgIGlmIChrZXlQcmVmaXggPT09ICckJyB8fCBrZXlQcmVmaXggPT09ICdfJykge1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gZW1pdCBzZXQgb24gYmluZFxuICAgIC8vIHRoaXMgbWVhbnMgd2hlbiBhbiBvYmplY3QgaXMgb2JzZXJ2ZWQgaXQgd2lsbCBlbWl0XG4gICAgLy8gYSBmaXJzdCBiYXRjaCBvZiBzZXQgZXZlbnRzLlxuICAgIHZhciBlbWl0dGVyID0gb2JqLl9fZW1pdHRlcl9fLFxuICAgICAgICB2YWx1ZXMgID0gZW1pdHRlci52YWx1ZXNcblxuICAgIGluaXQob2JqW2tleV0sIHByb3BhZ2F0ZSlcblxuICAgIG9EZWYob2JqLCBrZXksIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1trZXldXG4gICAgICAgICAgICAvLyBvbmx5IGVtaXQgZ2V0IG9uIHRpcCB2YWx1ZXNcbiAgICAgICAgICAgIGlmIChwdWIuc2hvdWxkR2V0KSB7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdnZXQnLCBrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICAgICAgICB2YXIgb2xkVmFsID0gdmFsdWVzW2tleV1cbiAgICAgICAgICAgIHVub2JzZXJ2ZShvbGRWYWwsIGtleSwgZW1pdHRlcilcbiAgICAgICAgICAgIGNvcHlQYXRocyhuZXdWYWwsIG9sZFZhbClcbiAgICAgICAgICAgIC8vIGFuIGltbWVkaWF0ZSBwcm9wZXJ0eSBzaG91bGQgbm90aWZ5IGl0cyBwYXJlbnRcbiAgICAgICAgICAgIC8vIHRvIGVtaXQgc2V0IGZvciBpdHNlbGYgdG9vXG4gICAgICAgICAgICBpbml0KG5ld1ZhbCwgdHJ1ZSlcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBpbml0ICh2YWwsIHByb3BhZ2F0ZSkge1xuICAgICAgICB2YWx1ZXNba2V5XSA9IHZhbFxuICAgICAgICBlbWl0dGVyLmVtaXQoJ3NldCcsIGtleSwgdmFsLCBwcm9wYWdhdGUpXG4gICAgICAgIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0Jywga2V5ICsgJy5sZW5ndGgnLCB2YWwubGVuZ3RoLCBwcm9wYWdhdGUpXG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZSh2YWwsIGtleSwgZW1pdHRlcilcbiAgICB9XG59XG5cbi8qKlxuICogIFdoZW4gYSB2YWx1ZSB0aGF0IGlzIGFscmVhZHkgY29udmVydGVkIGlzXG4gKiAgb2JzZXJ2ZWQgYWdhaW4gYnkgYW5vdGhlciBvYnNlcnZlciwgd2UgY2FuIHNraXBcbiAqICB0aGUgd2F0Y2ggY29udmVyc2lvbiBhbmQgc2ltcGx5IGVtaXQgc2V0IGV2ZW50IGZvclxuICogIGFsbCBvZiBpdHMgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gZW1pdFNldCAob2JqKSB7XG4gICAgdmFyIGVtaXR0ZXIgPSBvYmogJiYgb2JqLl9fZW1pdHRlcl9fXG4gICAgaWYgKCFlbWl0dGVyKSByZXR1cm5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0JywgJ2xlbmd0aCcsIG9iai5sZW5ndGgpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleSwgdmFsXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgdmFsID0gb2JqW2tleV1cbiAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnc2V0Jywga2V5LCB2YWwpXG4gICAgICAgICAgICBlbWl0U2V0KHZhbClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgTWFrZSBzdXJlIGFsbCB0aGUgcGF0aHMgaW4gYW4gb2xkIG9iamVjdCBleGlzdHNcbiAqICBpbiBhIG5ldyBvYmplY3QuXG4gKiAgU28gd2hlbiBhbiBvYmplY3QgY2hhbmdlcywgYWxsIG1pc3Npbmcga2V5cyB3aWxsXG4gKiAgZW1pdCBhIHNldCBldmVudCB3aXRoIHVuZGVmaW5lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gY29weVBhdGhzIChuZXdPYmosIG9sZE9iaikge1xuICAgIGlmICghaXNPYmplY3QobmV3T2JqKSB8fCAhaXNPYmplY3Qob2xkT2JqKSkge1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIHBhdGgsIG9sZFZhbCwgbmV3VmFsXG4gICAgZm9yIChwYXRoIGluIG9sZE9iaikge1xuICAgICAgICBpZiAoIShoYXNPd24uY2FsbChuZXdPYmosIHBhdGgpKSkge1xuICAgICAgICAgICAgb2xkVmFsID0gb2xkT2JqW3BhdGhdXG4gICAgICAgICAgICBpZiAoaXNBcnJheShvbGRWYWwpKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqW3BhdGhdID0gW11cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob2xkVmFsKSkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbCA9IG5ld09ialtwYXRoXSA9IHt9XG4gICAgICAgICAgICAgICAgY29weVBhdGhzKG5ld1ZhbCwgb2xkVmFsKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmpbcGF0aF0gPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiAgd2FsayBhbG9uZyBhIHBhdGggYW5kIG1ha2Ugc3VyZSBpdCBjYW4gYmUgYWNjZXNzZWRcbiAqICBhbmQgZW51bWVyYXRlZCBpbiB0aGF0IG9iamVjdFxuICovXG5mdW5jdGlvbiBlbnN1cmVQYXRoIChvYmosIGtleSkge1xuICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyksIHNlY1xuICAgIGZvciAodmFyIGkgPSAwLCBkID0gcGF0aC5sZW5ndGggLSAxOyBpIDwgZDsgaSsrKSB7XG4gICAgICAgIHNlYyA9IHBhdGhbaV1cbiAgICAgICAgaWYgKCFvYmpbc2VjXSkge1xuICAgICAgICAgICAgb2JqW3NlY10gPSB7fVxuICAgICAgICAgICAgaWYgKG9iai5fX2VtaXR0ZXJfXykgY29udmVydEtleShvYmosIHNlYylcbiAgICAgICAgfVxuICAgICAgICBvYmogPSBvYmpbc2VjXVxuICAgIH1cbiAgICBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgICBzZWMgPSBwYXRoW2ldXG4gICAgICAgIGlmICghKGhhc093bi5jYWxsKG9iaiwgc2VjKSkpIHtcbiAgICAgICAgICAgIG9ialtzZWNdID0gdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAob2JqLl9fZW1pdHRlcl9fKSBjb252ZXJ0S2V5KG9iaiwgc2VjKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBNYWluIEFQSSBNZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogIE9ic2VydmUgYW4gb2JqZWN0IHdpdGggYSBnaXZlbiBwYXRoLFxuICogIGFuZCBwcm94eSBnZXQvc2V0L211dGF0ZSBldmVudHMgdG8gdGhlIHByb3ZpZGVkIG9ic2VydmVyLlxuICovXG5mdW5jdGlvbiBvYnNlcnZlIChvYmosIHJhd1BhdGgsIG9ic2VydmVyKSB7XG5cbiAgICBpZiAoIWlzV2F0Y2hhYmxlKG9iaikpIHJldHVyblxuXG4gICAgdmFyIHBhdGggPSByYXdQYXRoID8gcmF3UGF0aCArICcuJyA6ICcnLFxuICAgICAgICBhbHJlYWR5Q29udmVydGVkID0gY29udmVydChvYmopLFxuICAgICAgICBlbWl0dGVyID0gb2JqLl9fZW1pdHRlcl9fXG5cbiAgICAvLyBzZXR1cCBwcm94eSBsaXN0ZW5lcnMgb24gdGhlIHBhcmVudCBvYnNlcnZlci5cbiAgICAvLyB3ZSBuZWVkIHRvIGtlZXAgcmVmZXJlbmNlIHRvIHRoZW0gc28gdGhhdCB0aGV5XG4gICAgLy8gY2FuIGJlIHJlbW92ZWQgd2hlbiB0aGUgb2JqZWN0IGlzIHVuLW9ic2VydmVkLlxuICAgIG9ic2VydmVyLnByb3hpZXMgPSBvYnNlcnZlci5wcm94aWVzIHx8IHt9XG4gICAgdmFyIHByb3hpZXMgPSBvYnNlcnZlci5wcm94aWVzW3BhdGhdID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ2dldCcsIHBhdGggKyBrZXkpXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsLCBwcm9wYWdhdGUpIHtcbiAgICAgICAgICAgIGlmIChrZXkpIG9ic2VydmVyLmVtaXQoJ3NldCcsIHBhdGggKyBrZXksIHZhbClcbiAgICAgICAgICAgIC8vIGFsc28gbm90aWZ5IG9ic2VydmVyIHRoYXQgdGhlIG9iamVjdCBpdHNlbGYgY2hhbmdlZFxuICAgICAgICAgICAgLy8gYnV0IG9ubHkgZG8gc28gd2hlbiBpdCdzIGEgaW1tZWRpYXRlIHByb3BlcnR5LiB0aGlzXG4gICAgICAgICAgICAvLyBhdm9pZHMgZHVwbGljYXRlIGV2ZW50IGZpcmluZy5cbiAgICAgICAgICAgIGlmIChyYXdQYXRoICYmIHByb3BhZ2F0ZSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ3NldCcsIHJhd1BhdGgsIG9iaiwgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbXV0YXRlOiBmdW5jdGlvbiAoa2V5LCB2YWwsIG11dGF0aW9uKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgQXJyYXkgaXMgYSByb290IHZhbHVlXG4gICAgICAgICAgICAvLyB0aGUga2V5IHdpbGwgYmUgbnVsbFxuICAgICAgICAgICAgdmFyIGZpeGVkUGF0aCA9IGtleSA/IHBhdGggKyBrZXkgOiByYXdQYXRoXG4gICAgICAgICAgICBvYnNlcnZlci5lbWl0KCdtdXRhdGUnLCBmaXhlZFBhdGgsIHZhbCwgbXV0YXRpb24pXG4gICAgICAgICAgICAvLyBhbHNvIGVtaXQgc2V0IGZvciBBcnJheSdzIGxlbmd0aCB3aGVuIGl0IG11dGF0ZXNcbiAgICAgICAgICAgIHZhciBtID0gbXV0YXRpb24ubWV0aG9kXG4gICAgICAgICAgICBpZiAobSAhPT0gJ3NvcnQnICYmIG0gIT09ICdyZXZlcnNlJykge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVtaXQoJ3NldCcsIGZpeGVkUGF0aCArICcubGVuZ3RoJywgdmFsLmxlbmd0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF0dGFjaCB0aGUgbGlzdGVuZXJzIHRvIHRoZSBjaGlsZCBvYnNlcnZlci5cbiAgICAvLyBub3cgYWxsIHRoZSBldmVudHMgd2lsbCBwcm9wYWdhdGUgdXB3YXJkcy5cbiAgICBlbWl0dGVyXG4gICAgICAgIC5vbignZ2V0JywgcHJveGllcy5nZXQpXG4gICAgICAgIC5vbignc2V0JywgcHJveGllcy5zZXQpXG4gICAgICAgIC5vbignbXV0YXRlJywgcHJveGllcy5tdXRhdGUpXG5cbiAgICBpZiAoYWxyZWFkeUNvbnZlcnRlZCkge1xuICAgICAgICAvLyBmb3Igb2JqZWN0cyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGNvbnZlcnRlZCxcbiAgICAgICAgLy8gZW1pdCBzZXQgZXZlbnRzIGZvciBldmVyeXRoaW5nIGluc2lkZVxuICAgICAgICBlbWl0U2V0KG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgICB3YXRjaChvYmopXG4gICAgfVxufVxuXG4vKipcbiAqICBDYW5jZWwgb2JzZXJ2YXRpb24sIHR1cm4gb2ZmIHRoZSBsaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIHVub2JzZXJ2ZSAob2JqLCBwYXRoLCBvYnNlcnZlcikge1xuXG4gICAgaWYgKCFvYmogfHwgIW9iai5fX2VtaXR0ZXJfXykgcmV0dXJuXG5cbiAgICBwYXRoID0gcGF0aCA/IHBhdGggKyAnLicgOiAnJ1xuICAgIHZhciBwcm94aWVzID0gb2JzZXJ2ZXIucHJveGllc1twYXRoXVxuICAgIGlmICghcHJveGllcykgcmV0dXJuXG5cbiAgICAvLyB0dXJuIG9mZiBsaXN0ZW5lcnNcbiAgICBvYmouX19lbWl0dGVyX19cbiAgICAgICAgLm9mZignZ2V0JywgcHJveGllcy5nZXQpXG4gICAgICAgIC5vZmYoJ3NldCcsIHByb3hpZXMuc2V0KVxuICAgICAgICAub2ZmKCdtdXRhdGUnLCBwcm94aWVzLm11dGF0ZSlcblxuICAgIC8vIHJlbW92ZSByZWZlcmVuY2VcbiAgICBvYnNlcnZlci5wcm94aWVzW3BhdGhdID0gbnVsbFxufVxuXG4vLyBFeHBvc2UgQVBJIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwdWIgPSBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIC8vIHdoZXRoZXIgdG8gZW1pdCBnZXQgZXZlbnRzXG4gICAgLy8gb25seSBlbmFibGVkIGR1cmluZyBkZXBlbmRlbmN5IHBhcnNpbmdcbiAgICBzaG91bGRHZXQgICA6IGZhbHNlLFxuXG4gICAgb2JzZXJ2ZSAgICAgOiBvYnNlcnZlLFxuICAgIHVub2JzZXJ2ZSAgIDogdW5vYnNlcnZlLFxuICAgIGVuc3VyZVBhdGggIDogZW5zdXJlUGF0aCxcbiAgICBjb3B5UGF0aHMgICA6IGNvcHlQYXRocyxcbiAgICB3YXRjaCAgICAgICA6IHdhdGNoLFxuICAgIGNvbnZlcnQgICAgIDogY29udmVydCxcbiAgICBjb252ZXJ0S2V5ICA6IGNvbnZlcnRLZXlcbn0iLCJ2YXIgdG9GcmFnbWVudCA9IHJlcXVpcmUoJy4vZnJhZ21lbnQnKTtcblxuLyoqXG4gKiBQYXJzZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgb3Igbm9kZSBhbmQgbm9ybWFsaXplcyBpdCBpbnRvIGFcbiAqIGEgbm9kZSB0aGF0IGNhbiBiZSB1c2VkIGFzIGEgcGFydGlhbCBvZiBhIHRlbXBsYXRlIG9wdGlvblxuICpcbiAqIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlXG4gKiBpZCBzZWxlY3RvcjogJyNzb21lLXRlbXBsYXRlLWlkJ1xuICogdGVtcGxhdGUgc3RyaW5nOiAnPGRpdj48c3Bhbj5teSB0ZW1wbGF0ZTwvc3Bhbj48L2Rpdj4nXG4gKiBEb2N1bWVudEZyYWdtZW50IG9iamVjdFxuICogTm9kZSBvYmplY3Qgb2YgdHlwZSBUZW1wbGF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgdmFyIHRlbXBsYXRlTm9kZTtcblxuICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgIC8vIGlmIHRoZSB0ZW1wbGF0ZSBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQgLS0gZG8gbm90aGluZ1xuICAgICAgICByZXR1cm4gdGVtcGxhdGVcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyB0ZW1wbGF0ZSBieSBJRFxuICAgICAgICBpZiAodGVtcGxhdGUuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlLnNsaWNlKDEpKVxuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZU5vZGUpIHJldHVyblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRvRnJhZ21lbnQodGVtcGxhdGUpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XG4gICAgICAgIHRlbXBsYXRlTm9kZSA9IHRlbXBsYXRlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgICAvLyBpdHMgY29udGVudCBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQhXG4gICAgaWYgKHRlbXBsYXRlTm9kZS50YWdOYW1lID09PSAnVEVNUExBVEUnICYmIHRlbXBsYXRlTm9kZS5jb250ZW50KSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZU5vZGUuY29udGVudFxuICAgIH1cblxuICAgIGlmICh0ZW1wbGF0ZU5vZGUudGFnTmFtZSA9PT0gJ1NDUklQVCcpIHtcbiAgICAgICAgcmV0dXJuIHRvRnJhZ21lbnQodGVtcGxhdGVOb2RlLmlubmVySFRNTClcbiAgICB9XG5cbiAgICByZXR1cm4gdG9GcmFnbWVudCh0ZW1wbGF0ZU5vZGUub3V0ZXJIVE1MKTtcbn1cbiIsInZhciBvcGVuQ2hhciAgICAgICAgPSAneycsXG4gICAgZW5kQ2hhciAgICAgICAgID0gJ30nLFxuICAgIEVTQ0FQRV9SRSAgICAgICA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgLy8gbGF6eSByZXF1aXJlXG4gICAgRGlyZWN0aXZlXG5cbmV4cG9ydHMuUmVnZXggPSBidWlsZEludGVycG9sYXRpb25SZWdleCgpXG5cbmZ1bmN0aW9uIGJ1aWxkSW50ZXJwb2xhdGlvblJlZ2V4ICgpIHtcbiAgICB2YXIgb3BlbiA9IGVzY2FwZVJlZ2V4KG9wZW5DaGFyKSxcbiAgICAgICAgZW5kICA9IGVzY2FwZVJlZ2V4KGVuZENoYXIpXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAob3BlbiArIG9wZW4gKyBvcGVuICsgJz8oLis/KScgKyBlbmQgKyAnPycgKyBlbmQgKyBlbmQpXG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4IChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoRVNDQVBFX1JFLCAnXFxcXCQmJylcbn1cblxuZnVuY3Rpb24gc2V0RGVsaW1pdGVycyAoZGVsaW1pdGVycykge1xuICAgIG9wZW5DaGFyID0gZGVsaW1pdGVyc1swXVxuICAgIGVuZENoYXIgPSBkZWxpbWl0ZXJzWzFdXG4gICAgZXhwb3J0cy5kZWxpbWl0ZXJzID0gZGVsaW1pdGVyc1xuICAgIGV4cG9ydHMuUmVnZXggPSBidWlsZEludGVycG9sYXRpb25SZWdleCgpXG59XG5cbi8qKiBcbiAqICBQYXJzZSBhIHBpZWNlIG9mIHRleHQsIHJldHVybiBhbiBhcnJheSBvZiB0b2tlbnNcbiAqICB0b2tlbiB0eXBlczpcbiAqICAxLiBwbGFpbiBzdHJpbmdcbiAqICAyLiBvYmplY3Qgd2l0aCBrZXkgPSBiaW5kaW5nIGtleVxuICogIDMuIG9iamVjdCB3aXRoIGtleSAmIGh0bWwgPSB0cnVlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlICh0ZXh0KSB7XG4gICAgaWYgKCFleHBvcnRzLlJlZ2V4LnRlc3QodGV4dCkpIHJldHVybiBudWxsXG4gICAgdmFyIG0sIGksIHRva2VuLCBtYXRjaCwgdG9rZW5zID0gW11cbiAgICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICAgIHdoaWxlIChtID0gdGV4dC5tYXRjaChleHBvcnRzLlJlZ2V4KSkge1xuICAgICAgICBpID0gbS5pbmRleFxuICAgICAgICBpZiAoaSA+IDApIHRva2Vucy5wdXNoKHRleHQuc2xpY2UoMCwgaSkpXG4gICAgICAgIHRva2VuID0geyBrZXk6IG1bMV0udHJpbSgpIH1cbiAgICAgICAgbWF0Y2ggPSBtWzBdXG4gICAgICAgIHRva2VuLmh0bWwgPVxuICAgICAgICAgICAgbWF0Y2guY2hhckF0KDIpID09PSBvcGVuQ2hhciAmJlxuICAgICAgICAgICAgbWF0Y2guY2hhckF0KG1hdGNoLmxlbmd0aCAtIDMpID09PSBlbmRDaGFyXG4gICAgICAgIHRva2Vucy5wdXNoKHRva2VuKVxuICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZShpICsgbVswXS5sZW5ndGgpXG4gICAgfVxuICAgIGlmICh0ZXh0Lmxlbmd0aCkgdG9rZW5zLnB1c2godGV4dClcbiAgICByZXR1cm4gdG9rZW5zXG59XG5cbi8qKlxuICogIFBhcnNlIGFuIGF0dHJpYnV0ZSB2YWx1ZSB3aXRoIHBvc3NpYmxlIGludGVycG9sYXRpb24gdGFnc1xuICogIHJldHVybiBhIERpcmVjdGl2ZS1mcmllbmRseSBleHByZXNzaW9uXG4gKlxuICogIGUuZy4gIGEge3tifX0gYyAgPT4gIFwiYSBcIiArIGIgKyBcIiBjXCJcbiAqL1xuZnVuY3Rpb24gcGFyc2VBdHRyIChhdHRyKSB7XG4gICAgRGlyZWN0aXZlID0gRGlyZWN0aXZlIHx8IHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbiAgICB2YXIgdG9rZW5zID0gcGFyc2UoYXR0cilcbiAgICBpZiAoIXRva2VucykgcmV0dXJuIG51bGxcbiAgICBpZiAodG9rZW5zLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRva2Vuc1swXS5rZXlcbiAgICB2YXIgcmVzID0gW10sIHRva2VuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICAgIHJlcy5wdXNoKFxuICAgICAgICAgICAgdG9rZW4ua2V5XG4gICAgICAgICAgICAgICAgPyBpbmxpbmVGaWx0ZXJzKHRva2VuLmtleSlcbiAgICAgICAgICAgICAgICA6ICgnXCInICsgdG9rZW4gKyAnXCInKVxuICAgICAgICApXG4gICAgfVxuICAgIHJldHVybiByZXMuam9pbignKycpXG59XG5cbi8qKlxuICogIElubGluZXMgYW55IHBvc3NpYmxlIGZpbHRlcnMgaW4gYSBiaW5kaW5nXG4gKiAgc28gdGhhdCB3ZSBjYW4gY29tYmluZSBldmVyeXRoaW5nIGludG8gYSBodWdlIGV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gaW5saW5lRmlsdGVycyAoa2V5KSB7XG4gICAgaWYgKGtleS5pbmRleE9mKCd8JykgPiAtMSkge1xuICAgICAgICB2YXIgZGlycyA9IERpcmVjdGl2ZS5wYXJzZShrZXkpLFxuICAgICAgICAgICAgZGlyID0gZGlycyAmJiBkaXJzWzBdXG4gICAgICAgIGlmIChkaXIgJiYgZGlyLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIGtleSA9IERpcmVjdGl2ZS5pbmxpbmVGaWx0ZXJzKFxuICAgICAgICAgICAgICAgIGRpci5rZXksXG4gICAgICAgICAgICAgICAgZGlyLmZpbHRlcnNcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJygnICsga2V5ICsgJyknXG59XG5cbmV4cG9ydHMucGFyc2UgICAgICAgICA9IHBhcnNlXG5leHBvcnRzLnBhcnNlQXR0ciAgICAgPSBwYXJzZUF0dHJcbmV4cG9ydHMuc2V0RGVsaW1pdGVycyA9IHNldERlbGltaXRlcnNcbmV4cG9ydHMuZGVsaW1pdGVycyAgICA9IFtvcGVuQ2hhciwgZW5kQ2hhcl0iLCJ2YXIgZW5kRXZlbnRzICA9IHNuaWZmRW5kRXZlbnRzKCksXG4gICAgY29uZmlnICAgICA9IHJlcXVpcmUoJy4vY29uZmlnJyksXG4gICAgLy8gYmF0Y2ggZW50ZXIgYW5pbWF0aW9ucyBzbyB3ZSBvbmx5IGZvcmNlIHRoZSBsYXlvdXQgb25jZVxuICAgIEJhdGNoZXIgICAgPSByZXF1aXJlKCcuL2JhdGNoZXInKSxcbiAgICBiYXRjaGVyICAgID0gbmV3IEJhdGNoZXIoKSxcbiAgICAvLyBjYWNoZSB0aW1lciBmdW5jdGlvbnNcbiAgICBzZXRUTyAgICAgID0gd2luZG93LnNldFRpbWVvdXQsXG4gICAgY2xlYXJUTyAgICA9IHdpbmRvdy5jbGVhclRpbWVvdXQsXG4gICAgLy8gZXhpdCBjb2RlcyBmb3IgdGVzdGluZ1xuICAgIGNvZGVzID0ge1xuICAgICAgICBDU1NfRSAgICAgOiAxLFxuICAgICAgICBDU1NfTCAgICAgOiAyLFxuICAgICAgICBKU19FICAgICAgOiAzLFxuICAgICAgICBKU19MICAgICAgOiA0LFxuICAgICAgICBDU1NfU0tJUCAgOiAtMSxcbiAgICAgICAgSlNfU0tJUCAgIDogLTIsXG4gICAgICAgIEpTX1NLSVBfRSA6IC0zLFxuICAgICAgICBKU19TS0lQX0wgOiAtNCxcbiAgICAgICAgSU5JVCAgICAgIDogLTUsXG4gICAgICAgIFNLSVAgICAgICA6IC02XG4gICAgfVxuXG4vLyBmb3JjZSBsYXlvdXQgYmVmb3JlIHRyaWdnZXJpbmcgdHJhbnNpdGlvbnMvYW5pbWF0aW9uc1xuYmF0Y2hlci5fcHJlRmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cbiAgICB2YXIgZiA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0XG59XG5cbi8qKlxuICogIHN0YWdlOlxuICogICAgMSA9IGVudGVyXG4gKiAgICAyID0gbGVhdmVcbiAqL1xudmFyIHRyYW5zaXRpb24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgc3RhZ2UsIGNiLCBjb21waWxlcikge1xuXG4gICAgdmFyIGNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYigpXG4gICAgICAgIGNvbXBpbGVyLmV4ZWNIb29rKHN0YWdlID4gMCA/ICdhdHRhY2hlZCcgOiAnZGV0YWNoZWQnKVxuICAgIH1cblxuICAgIGlmIChjb21waWxlci5pbml0KSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLklOSVRcbiAgICB9XG5cbiAgICB2YXIgaGFzVHJhbnNpdGlvbiA9IGVsLnZ1ZV90cmFucyA9PT0gJycsXG4gICAgICAgIGhhc0FuaW1hdGlvbiAgPSBlbC52dWVfYW5pbSA9PT0gJycsXG4gICAgICAgIGVmZmVjdElkICAgICAgPSBlbC52dWVfZWZmZWN0XG5cbiAgICBpZiAoZWZmZWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5VHJhbnNpdGlvbkZ1bmN0aW9ucyhcbiAgICAgICAgICAgIGVsLFxuICAgICAgICAgICAgc3RhZ2UsXG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSxcbiAgICAgICAgICAgIGVmZmVjdElkLFxuICAgICAgICAgICAgY29tcGlsZXJcbiAgICAgICAgKVxuICAgIH0gZWxzZSBpZiAoaGFzVHJhbnNpdGlvbiB8fCBoYXNBbmltYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5VHJhbnNpdGlvbkNsYXNzKFxuICAgICAgICAgICAgZWwsXG4gICAgICAgICAgICBzdGFnZSxcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlLFxuICAgICAgICAgICAgaGFzQW5pbWF0aW9uXG4gICAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5TS0lQXG4gICAgfVxuXG59XG5cbi8qKlxuICogIFRvZ2dnbGUgYSBDU1MgY2xhc3MgdG8gdHJpZ2dlciB0cmFuc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkNsYXNzIChlbCwgc3RhZ2UsIGNoYW5nZVN0YXRlLCBoYXNBbmltYXRpb24pIHtcblxuICAgIGlmICghZW5kRXZlbnRzLnRyYW5zKSB7XG4gICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgcmV0dXJuIGNvZGVzLkNTU19TS0lQXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHJhbnNpdGlvbixcbiAgICAvLyBpdCBtdXN0IGhhdmUgY2xhc3NMaXN0Li4uXG4gICAgdmFyIG9uRW5kLFxuICAgICAgICBjbGFzc0xpc3QgICAgICAgID0gZWwuY2xhc3NMaXN0LFxuICAgICAgICBleGlzdGluZ0NhbGxiYWNrID0gZWwudnVlX3RyYW5zX2NiLFxuICAgICAgICBlbnRlckNsYXNzICAgICAgID0gY29uZmlnLmVudGVyQ2xhc3MsXG4gICAgICAgIGxlYXZlQ2xhc3MgICAgICAgPSBjb25maWcubGVhdmVDbGFzcyxcbiAgICAgICAgZW5kRXZlbnQgICAgICAgICA9IGhhc0FuaW1hdGlvbiA/IGVuZEV2ZW50cy5hbmltIDogZW5kRXZlbnRzLnRyYW5zXG5cbiAgICAvLyBjYW5jZWwgdW5maW5pc2hlZCBjYWxsYmFja3MgYW5kIGpvYnNcbiAgICBpZiAoZXhpc3RpbmdDYWxsYmFjaykge1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBleGlzdGluZ0NhbGxiYWNrKVxuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGVudGVyQ2xhc3MpXG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUobGVhdmVDbGFzcylcbiAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChzdGFnZSA+IDApIHsgLy8gZW50ZXJcblxuICAgICAgICAvLyBzZXQgdG8gZW50ZXIgc3RhdGUgYmVmb3JlIGFwcGVuZGluZ1xuICAgICAgICBjbGFzc0xpc3QuYWRkKGVudGVyQ2xhc3MpXG4gICAgICAgIC8vIGFwcGVuZFxuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIC8vIHRyaWdnZXIgdHJhbnNpdGlvblxuICAgICAgICBpZiAoIWhhc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgYmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgICAgICBleGVjdXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoZW50ZXJDbGFzcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb25FbmQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpXG4gICAgICAgICAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShlbnRlckNsYXNzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgZWwudnVlX3RyYW5zX2NiID0gb25FbmRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29kZXMuQ1NTX0VcblxuICAgIH0gZWxzZSB7IC8vIGxlYXZlXG5cbiAgICAgICAgaWYgKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCkge1xuICAgICAgICAgICAgLy8gdHJpZ2dlciBoaWRlIHRyYW5zaXRpb25cbiAgICAgICAgICAgIGNsYXNzTGlzdC5hZGQobGVhdmVDbGFzcylcbiAgICAgICAgICAgIG9uRW5kID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZW5kRXZlbnQsIG9uRW5kKVxuICAgICAgICAgICAgICAgICAgICBlbC52dWVfdHJhbnNfY2IgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFjdHVhbGx5IHJlbW92ZSBub2RlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGUoKVxuICAgICAgICAgICAgICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKGxlYXZlQ2xhc3MpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYXR0YWNoIHRyYW5zaXRpb24gZW5kIGxpc3RlbmVyXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZClcbiAgICAgICAgICAgIGVsLnZ1ZV90cmFuc19jYiA9IG9uRW5kXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkaXJlY3RseSByZW1vdmUgaW52aXNpYmxlIGVsZW1lbnRzXG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvZGVzLkNTU19MXG4gICAgICAgIFxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25GdW5jdGlvbnMgKGVsLCBzdGFnZSwgY2hhbmdlU3RhdGUsIGVmZmVjdElkLCBjb21waWxlcikge1xuXG4gICAgdmFyIGZ1bmNzID0gY29tcGlsZXIuZ2V0T3B0aW9uKCdlZmZlY3RzJywgZWZmZWN0SWQpXG4gICAgaWYgKCFmdW5jcykge1xuICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgIHJldHVybiBjb2Rlcy5KU19TS0lQXG4gICAgfVxuXG4gICAgdmFyIGVudGVyID0gZnVuY3MuZW50ZXIsXG4gICAgICAgIGxlYXZlID0gZnVuY3MubGVhdmUsXG4gICAgICAgIHRpbWVvdXRzID0gZWwudnVlX3RpbWVvdXRzXG5cbiAgICAvLyBjbGVhciBwcmV2aW91cyB0aW1lb3V0c1xuICAgIGlmICh0aW1lb3V0cykge1xuICAgICAgICB2YXIgaSA9IHRpbWVvdXRzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBjbGVhclRPKHRpbWVvdXRzW2ldKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGltZW91dHMgPSBlbC52dWVfdGltZW91dHMgPSBbXVxuICAgIGZ1bmN0aW9uIHRpbWVvdXQgKGNiLCBkZWxheSkge1xuICAgICAgICB2YXIgaWQgPSBzZXRUTyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYigpXG4gICAgICAgICAgICB0aW1lb3V0cy5zcGxpY2UodGltZW91dHMuaW5kZXhPZihpZCksIDEpXG4gICAgICAgICAgICBpZiAoIXRpbWVvdXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVsLnZ1ZV90aW1lb3V0cyA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgICAgIHRpbWVvdXRzLnB1c2goaWQpXG4gICAgfVxuXG4gICAgaWYgKHN0YWdlID4gMCkgeyAvLyBlbnRlclxuICAgICAgICBpZiAodHlwZW9mIGVudGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjaGFuZ2VTdGF0ZSgpXG4gICAgICAgICAgICByZXR1cm4gY29kZXMuSlNfU0tJUF9FXG4gICAgICAgIH1cbiAgICAgICAgZW50ZXIoZWwsIGNoYW5nZVN0YXRlLCB0aW1lb3V0KVxuICAgICAgICByZXR1cm4gY29kZXMuSlNfRVxuICAgIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgICAgIGlmICh0eXBlb2YgbGVhdmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNoYW5nZVN0YXRlKClcbiAgICAgICAgICAgIHJldHVybiBjb2Rlcy5KU19TS0lQX0xcbiAgICAgICAgfVxuICAgICAgICBsZWF2ZShlbCwgY2hhbmdlU3RhdGUsIHRpbWVvdXQpXG4gICAgICAgIHJldHVybiBjb2Rlcy5KU19MXG4gICAgfVxuXG59XG5cbi8qKlxuICogIFNuaWZmIHByb3BlciB0cmFuc2l0aW9uIGVuZCBldmVudCBuYW1lXG4gKi9cbmZ1bmN0aW9uIHNuaWZmRW5kRXZlbnRzICgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2dWUnKSxcbiAgICAgICAgZGVmYXVsdEV2ZW50ID0gJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICBldmVudHMgPSB7XG4gICAgICAgICAgICAnd2Via2l0VHJhbnNpdGlvbicgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAndHJhbnNpdGlvbicgICAgICAgOiBkZWZhdWx0RXZlbnQsXG4gICAgICAgICAgICAnbW96VHJhbnNpdGlvbicgICAgOiBkZWZhdWx0RXZlbnRcbiAgICAgICAgfSxcbiAgICAgICAgcmV0ID0ge31cbiAgICBmb3IgKHZhciBuYW1lIGluIGV2ZW50cykge1xuICAgICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0LnRyYW5zID0gZXZlbnRzW25hbWVdXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldC5hbmltID0gZWwuc3R5bGUuYW5pbWF0aW9uID09PSAnJ1xuICAgICAgICA/ICdhbmltYXRpb25lbmQnXG4gICAgICAgIDogJ3dlYmtpdEFuaW1hdGlvbkVuZCdcbiAgICByZXR1cm4gcmV0XG59XG5cbi8vIEV4cG9zZSBzb21lIHN0dWZmIGZvciB0ZXN0aW5nIHB1cnBvc2VzXG50cmFuc2l0aW9uLmNvZGVzID0gY29kZXNcbnRyYW5zaXRpb24uc25pZmYgPSBzbmlmZkVuZEV2ZW50cyIsInZhciBjb25maWcgICAgICAgPSByZXF1aXJlKCcuL2NvbmZpZycpLFxuICAgIHRvU3RyaW5nICAgICA9ICh7fSkudG9TdHJpbmcsXG4gICAgd2luICAgICAgICAgID0gd2luZG93LFxuICAgIGNvbnNvbGUgICAgICA9IHdpbi5jb25zb2xlLFxuICAgIGRlZiAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICBPQkpFQ1QgICAgICAgPSAnb2JqZWN0JyxcbiAgICBUSElTX1JFICAgICAgPSAvW15cXHdddGhpc1teXFx3XS8sXG4gICAgQlJBQ0tFVF9SRV9TID0gL1xcWycoW14nXSspJ1xcXS9nLFxuICAgIEJSQUNLRVRfUkVfRCA9IC9cXFtcIihbXlwiXSspXCJcXF0vZyxcbiAgICBoYXNDbGFzc0xpc3QgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgVmlld01vZGVsIC8vIGxhdGUgZGVmXG5cbnZhciBkZWZlciA9XG4gICAgd2luLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgIHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICB3aW4uc2V0VGltZW91dFxuXG4vKipcbiAqICBOb3JtYWxpemUga2V5cGF0aCB3aXRoIHBvc3NpYmxlIGJyYWNrZXRzIGludG8gZG90IG5vdGF0aW9uc1xuICovXG5mdW5jdGlvbiBub3JtYWxpemVLZXlwYXRoIChrZXkpIHtcbiAgICByZXR1cm4ga2V5LmluZGV4T2YoJ1snKSA8IDBcbiAgICAgICAgPyBrZXlcbiAgICAgICAgOiBrZXkucmVwbGFjZShCUkFDS0VUX1JFX1MsICcuJDEnKVxuICAgICAgICAgICAgIC5yZXBsYWNlKEJSQUNLRVRfUkVfRCwgJy4kMScpXG59XG5cbnZhciB1dGlscyA9IG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgLyoqXG4gICAgICogIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBkb20gZnJhZ21lbnRcbiAgICAgKi9cbiAgICB0b0ZyYWdtZW50OiByZXF1aXJlKCcuL2ZyYWdtZW50JyksXG5cbiAgICAvKipcbiAgICAgKiAgUGFyc2UgdGhlIHZhcmlvdXMgdHlwZXMgb2YgdGVtcGxhdGUgb3B0aW9uc1xuICAgICAqL1xuICAgIHBhcnNlVGVtcGxhdGVPcHRpb246IHJlcXVpcmUoJy4vdGVtcGxhdGUtcGFyc2VyLmpzJyksXG5cbiAgICAvKipcbiAgICAgKiAgZ2V0IGEgdmFsdWUgZnJvbSBhbiBvYmplY3Qga2V5cGF0aFxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIGtleSA9IG5vcm1hbGl6ZUtleXBhdGgoa2V5KVxuICAgICAgICBpZiAoa2V5LmluZGV4T2YoJy4nKSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpba2V5XVxuICAgICAgICB9XG4gICAgICAgIHZhciBwYXRoID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgICBkID0gLTEsIGwgPSBwYXRoLmxlbmd0aFxuICAgICAgICB3aGlsZSAoKytkIDwgbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqID0gb2JqW3BhdGhbZF1dXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgc2V0IGEgdmFsdWUgdG8gYW4gb2JqZWN0IGtleXBhdGhcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsKSB7XG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgICAgIGtleSA9IG5vcm1hbGl6ZUtleXBhdGgoa2V5KVxuICAgICAgICBpZiAoa2V5LmluZGV4T2YoJy4nKSA8IDApIHtcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IGtleS5zcGxpdCgnLicpLFxuICAgICAgICAgICAgZCA9IC0xLCBsID0gcGF0aC5sZW5ndGggLSAxXG4gICAgICAgIHdoaWxlICgrK2QgPCBsKSB7XG4gICAgICAgICAgICBpZiAob2JqW3BhdGhbZF1dID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmpbcGF0aFtkXV0gPSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqID0gb2JqW3BhdGhbZF1dXG4gICAgICAgIH1cbiAgICAgICAgb2JqW3BhdGhbZF1dID0gdmFsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICByZXR1cm4gdGhlIGJhc2Ugc2VnbWVudCBvZiBhIGtleXBhdGhcbiAgICAgKi9cbiAgICBiYXNlS2V5OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkuaW5kZXhPZignLicpID4gMFxuICAgICAgICAgICAgPyBrZXkuc3BsaXQoJy4nKVswXVxuICAgICAgICAgICAgOiBrZXlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENyZWF0ZSBhIHByb3RvdHlwZS1sZXNzIG9iamVjdFxuICAgICAqICB3aGljaCBpcyBhIGJldHRlciBoYXNoL21hcFxuICAgICAqL1xuICAgIGhhc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIGdldCBhbiBhdHRyaWJ1dGUgYW5kIHJlbW92ZSBpdC5cbiAgICAgKi9cbiAgICBhdHRyOiBmdW5jdGlvbiAoZWwsIHR5cGUpIHtcbiAgICAgICAgdmFyIGF0dHIgPSBjb25maWcucHJlZml4ICsgJy0nICsgdHlwZSxcbiAgICAgICAgICAgIHZhbCA9IGVsLmdldEF0dHJpYnV0ZShhdHRyKVxuICAgICAgICBpZiAodmFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBEZWZpbmUgYW4gaWVudW1lcmFibGUgcHJvcGVydHlcbiAgICAgKiAgVGhpcyBhdm9pZHMgaXQgYmVpbmcgaW5jbHVkZWQgaW4gSlNPTi5zdHJpbmdpZnlcbiAgICAgKiAgb3IgZm9yLi4uaW4gbG9vcHMuXG4gICAgICovXG4gICAgZGVmUHJvdGVjdGVkOiBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSwgd3JpdGFibGUpIHtcbiAgICAgICAgZGVmKG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZSAgICAgICAgOiB2YWwsXG4gICAgICAgICAgICBlbnVtZXJhYmxlICAgOiBlbnVtZXJhYmxlLFxuICAgICAgICAgICAgd3JpdGFibGUgICAgIDogd3JpdGFibGUsXG4gICAgICAgICAgICBjb25maWd1cmFibGUgOiB0cnVlXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBBIGxlc3MgYnVsbGV0LXByb29mIGJ1dCBtb3JlIGVmZmljaWVudCB0eXBlIGNoZWNrXG4gICAgICogIHRoYW4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuICAgICAqL1xuICAgIGlzT2JqZWN0OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBPQkpFQ1QgJiYgb2JqICYmICFBcnJheS5pc0FycmF5KG9iailcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIEEgbW9yZSBhY2N1cmF0ZSBidXQgbGVzcyBlZmZpY2llbnQgdHlwZSBjaGVja1xuICAgICAqL1xuICAgIGlzVHJ1ZU9iamVjdDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgTW9zdCBzaW1wbGUgYmluZFxuICAgICAqICBlbm91Z2ggZm9yIHRoZSB1c2VjYXNlIGFuZCBmYXN0IHRoYW4gbmF0aXZlIGJpbmQoKVxuICAgICAqL1xuICAgIGJpbmQ6IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uY2FsbChjdHgsIGFyZylcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgTWFrZSBzdXJlIG51bGwgYW5kIHVuZGVmaW5lZCBvdXRwdXQgZW1wdHkgc3RyaW5nXG4gICAgICovXG4gICAgZ3VhcmQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSwgZXFudWxsOiB0cnVlICovXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICA6ICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpXG4gICAgICAgICAgICAgICAgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgICAgICAgICAgICAgICA6IHZhbHVlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBXaGVuIHNldHRpbmcgdmFsdWUgb24gdGhlIFZNLCBwYXJzZSBwb3NzaWJsZSBudW1iZXJzXG4gICAgICovXG4gICAgY2hlY2tOdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJylcbiAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgIDogTnVtYmVyKHZhbHVlKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgc2ltcGxlIGV4dGVuZFxuICAgICAqL1xuICAgIGV4dGVuZDogZnVuY3Rpb24gKG9iaiwgZXh0KSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBleHQpIHtcbiAgICAgICAgICAgIGlmIChvYmpba2V5XSAhPT0gZXh0W2tleV0pIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGV4dFtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ialxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgZmlsdGVyIGFuIGFycmF5IHdpdGggZHVwbGljYXRlcyBpbnRvIHVuaXF1ZXNcbiAgICAgKi9cbiAgICB1bmlxdWU6IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIGhhc2ggPSB1dGlscy5oYXNoKCksXG4gICAgICAgICAgICBpID0gYXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGtleSwgcmVzID0gW11cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAga2V5ID0gYXJyW2ldXG4gICAgICAgICAgICBpZiAoaGFzaFtrZXldKSBjb250aW51ZVxuICAgICAgICAgICAgaGFzaFtrZXldID0gMVxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENvbnZlcnQgdGhlIG9iamVjdCB0byBhIFZpZXdNb2RlbCBjb25zdHJ1Y3RvclxuICAgICAqICBpZiBpdCBpcyBub3QgYWxyZWFkeSBvbmVcbiAgICAgKi9cbiAgICB0b0NvbnN0cnVjdG9yOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIFZpZXdNb2RlbCA9IFZpZXdNb2RlbCB8fCByZXF1aXJlKCcuL3ZpZXdtb2RlbCcpXG4gICAgICAgIHJldHVybiB1dGlscy5pc09iamVjdChvYmopXG4gICAgICAgICAgICA/IFZpZXdNb2RlbC5leHRlbmQob2JqKVxuICAgICAgICAgICAgOiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgPyBvYmpcbiAgICAgICAgICAgICAgICA6IG51bGxcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIENoZWNrIGlmIGEgZmlsdGVyIGZ1bmN0aW9uIGNvbnRhaW5zIHJlZmVyZW5jZXMgdG8gYHRoaXNgXG4gICAgICogIElmIHllcywgbWFyayBpdCBhcyBhIGNvbXB1dGVkIGZpbHRlci5cbiAgICAgKi9cbiAgICBjaGVja0ZpbHRlcjogZnVuY3Rpb24gKGZpbHRlcikge1xuICAgICAgICBpZiAoVEhJU19SRS50ZXN0KGZpbHRlci50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgZmlsdGVyLmNvbXB1dGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICBjb252ZXJ0IGNlcnRhaW4gb3B0aW9uIHZhbHVlcyB0byB0aGUgZGVzaXJlZCBmb3JtYXQuXG4gICAgICovXG4gICAgcHJvY2Vzc09wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBjb21wb25lbnRzID0gb3B0aW9ucy5jb21wb25lbnRzLFxuICAgICAgICAgICAgcGFydGlhbHMgICA9IG9wdGlvbnMucGFydGlhbHMsXG4gICAgICAgICAgICB0ZW1wbGF0ZSAgID0gb3B0aW9ucy50ZW1wbGF0ZSxcbiAgICAgICAgICAgIGZpbHRlcnMgICAgPSBvcHRpb25zLmZpbHRlcnMsXG4gICAgICAgICAgICBrZXlcbiAgICAgICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW2tleV0gPSB1dGlscy50b0NvbnN0cnVjdG9yKGNvbXBvbmVudHNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydGlhbHMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHBhcnRpYWxzKSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbHNba2V5XSA9IHV0aWxzLnBhcnNlVGVtcGxhdGVPcHRpb24ocGFydGlhbHNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVycykge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZmlsdGVycykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmNoZWNrRmlsdGVyKGZpbHRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSB1dGlscy5wYXJzZVRlbXBsYXRlT3B0aW9uKHRlbXBsYXRlKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICB1c2VkIHRvIGRlZmVyIGJhdGNoIHVwZGF0ZXNcbiAgICAgKi9cbiAgICBuZXh0VGljazogZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIGRlZmVyKGNiLCAwKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgYWRkIGNsYXNzIGZvciBJRTlcbiAgICAgKiAgdXNlcyBjbGFzc0xpc3QgaWYgYXZhaWxhYmxlXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChoYXNDbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGN1ciA9ICcgJyArIGVsLmNsYXNzTmFtZSArICcgJ1xuICAgICAgICAgICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gKGN1ciArIGNscykudHJpbSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogIHJlbW92ZSBjbGFzcyBmb3IgSUU5XG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChoYXNDbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGN1ciA9ICcgJyArIGVsLmNsYXNzTmFtZSArICcgJyxcbiAgICAgICAgICAgICAgICB0YXIgPSAnICcgKyBjbHMgKyAnICdcbiAgICAgICAgICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgICAgICAgICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGN1ci50cmltKClcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAgQ29udmVydCBhbiBvYmplY3QgdG8gQXJyYXlcbiAgICAgKiAgdXNlZCBpbiB2LXJlcGVhdCBhbmQgYXJyYXkgZmlsdGVyc1xuICAgICAqL1xuICAgIG9iamVjdFRvQXJyYXk6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCB2YWwsIGRhdGFcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgdmFsID0gb2JqW2tleV1cbiAgICAgICAgICAgIGRhdGEgPSB1dGlscy5pc09iamVjdCh2YWwpXG4gICAgICAgICAgICAgICAgPyB2YWxcbiAgICAgICAgICAgICAgICA6IHsgJHZhbHVlOiB2YWwgfVxuICAgICAgICAgICAgZGF0YS4ka2V5ID0ga2V5XG4gICAgICAgICAgICByZXMucHVzaChkYXRhKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG59XG5cbmVuYWJsZURlYnVnKClcbmZ1bmN0aW9uIGVuYWJsZURlYnVnICgpIHtcbiAgICAvKipcbiAgICAgKiAgbG9nIGZvciBkZWJ1Z2dpbmdcbiAgICAgKi9cbiAgICB1dGlscy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmIChjb25maWcuZGVidWcgJiYgY29uc29sZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqICB3YXJuaW5ncywgdHJhY2VzIGJ5IGRlZmF1bHRcbiAgICAgKiAgY2FuIGJlIHN1cHByZXNzZWQgYnkgYHNpbGVudGAgb3B0aW9uLlxuICAgICAqL1xuICAgIHV0aWxzLndhcm4gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGlmICghY29uZmlnLnNpbGVudCAmJiBjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obXNnKVxuICAgICAgICAgICAgaWYgKGNvbmZpZy5kZWJ1ZyAmJiBjb25zb2xlLnRyYWNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS50cmFjZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwidmFyIENvbXBpbGVyICAgPSByZXF1aXJlKCcuL2NvbXBpbGVyJyksXG4gICAgdXRpbHMgICAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgICB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi90cmFuc2l0aW9uJyksXG4gICAgQmF0Y2hlciAgICA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpLFxuICAgIHNsaWNlICAgICAgPSBbXS5zbGljZSxcbiAgICBkZWYgICAgICAgID0gdXRpbHMuZGVmUHJvdGVjdGVkLFxuICAgIG5leHRUaWNrICAgPSB1dGlscy5uZXh0VGljayxcblxuICAgIC8vIGJhdGNoICR3YXRjaCBjYWxsYmFja3NcbiAgICB3YXRjaGVyQmF0Y2hlciA9IG5ldyBCYXRjaGVyKCksXG4gICAgd2F0Y2hlcklkICAgICAgPSAxXG5cbi8qKlxuICogIFZpZXdNb2RlbCBleHBvc2VkIHRvIHRoZSB1c2VyIHRoYXQgaG9sZHMgZGF0YSxcbiAqICBjb21wdXRlZCBwcm9wZXJ0aWVzLCBldmVudCBoYW5kbGVyc1xuICogIGFuZCBhIGZldyByZXNlcnZlZCBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIFZpZXdNb2RlbCAob3B0aW9ucykge1xuICAgIC8vIGNvbXBpbGUgaWYgb3B0aW9ucyBwYXNzZWQsIGlmIGZhbHNlIHJldHVybi4gb3B0aW9ucyBhcmUgcGFzc2VkIGRpcmVjdGx5IHRvIGNvbXBpbGVyXG4gICAgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSByZXR1cm5cbiAgICBuZXcgQ29tcGlsZXIodGhpcywgb3B0aW9ucylcbn1cblxuLy8gQWxsIFZNIHByb3RvdHlwZSBtZXRob2RzIGFyZSBpbmVudW1lcmFibGVcbi8vIHNvIGl0IGNhbiBiZSBzdHJpbmdpZmllZC9sb29wZWQgdGhyb3VnaCBhcyByYXcgZGF0YVxudmFyIFZNUHJvdG8gPSBWaWV3TW9kZWwucHJvdG90eXBlXG5cbi8qKlxuICogIGluaXQgYWxsb3dzIGNvbmZpZyBjb21waWxhdGlvbiBhZnRlciBpbnN0YW50aWF0aW9uOlxuICogICAgdmFyIGEgPSBuZXcgVnVlKGZhbHNlKVxuICogICAgYS5pbml0KGNvbmZpZylcbiAqL1xuZGVmKFZNUHJvdG8sICckaW5pdCcsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgbmV3IENvbXBpbGVyKHRoaXMsIG9wdGlvbnMpXG59KVxuXG4vKipcbiAqICBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBnZXQgYSB2YWx1ZSBmcm9tXG4gKiAgYSBrZXlwYXRoXG4gKi9cbmRlZihWTVByb3RvLCAnJGdldCcsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gdXRpbHMuZ2V0KHRoaXMsIGtleSlcbiAgICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgJiYgdGhpcy4kcGFyZW50XG4gICAgICAgID8gdGhpcy4kcGFyZW50LiRnZXQoa2V5KVxuICAgICAgICA6IHZhbFxufSlcblxuLyoqXG4gKiAgQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gc2V0IGFuIGFjdHVhbCBuZXN0ZWQgdmFsdWVcbiAqICBmcm9tIGEgZmxhdCBrZXkgc3RyaW5nLiBVc2VkIGluIGRpcmVjdGl2ZXMuXG4gKi9cbmRlZihWTVByb3RvLCAnJHNldCcsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdXRpbHMuc2V0KHRoaXMsIGtleSwgdmFsdWUpXG59KVxuXG4vKipcbiAqICB3YXRjaCBhIGtleSBvbiB0aGUgdmlld21vZGVsIGZvciBjaGFuZ2VzXG4gKiAgZmlyZSBjYWxsYmFjayB3aXRoIG5ldyB2YWx1ZVxuICovXG5kZWYoVk1Qcm90bywgJyR3YXRjaCcsIGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gICAgLy8gc2F2ZSBhIHVuaXF1ZSBpZCBmb3IgZWFjaCB3YXRjaGVyXG4gICAgdmFyIGlkID0gd2F0Y2hlcklkKyssXG4gICAgICAgIHNlbGYgPSB0aGlzXG4gICAgZnVuY3Rpb24gb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgICAgICB3YXRjaGVyQmF0Y2hlci5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlLFxuICAgICAgICAgICAgZXhlY3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3MpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGNhbGxiYWNrLl9mbiA9IG9uXG4gICAgc2VsZi4kY29tcGlsZXIub2JzZXJ2ZXIub24oJ2NoYW5nZTonICsga2V5LCBvbilcbn0pXG5cbi8qKlxuICogIHVud2F0Y2ggYSBrZXlcbiAqL1xuZGVmKFZNUHJvdG8sICckdW53YXRjaCcsIGZ1bmN0aW9uIChrZXksIGNhbGxiYWNrKSB7XG4gICAgLy8gd29ya2Fyb3VuZCBoZXJlXG4gICAgLy8gc2luY2UgdGhlIGVtaXR0ZXIgbW9kdWxlIGNoZWNrcyBjYWxsYmFjayBleGlzdGVuY2VcbiAgICAvLyBieSBjaGVja2luZyB0aGUgbGVuZ3RoIG9mIGFyZ3VtZW50c1xuICAgIHZhciBhcmdzID0gWydjaGFuZ2U6JyArIGtleV0sXG4gICAgICAgIG9iID0gdGhpcy4kY29tcGlsZXIub2JzZXJ2ZXJcbiAgICBpZiAoY2FsbGJhY2spIGFyZ3MucHVzaChjYWxsYmFjay5fZm4pXG4gICAgb2Iub2ZmLmFwcGx5KG9iLCBhcmdzKVxufSlcblxuLyoqXG4gKiAgdW5iaW5kIGV2ZXJ5dGhpbmcsIHJlbW92ZSBldmVyeXRoaW5nXG4gKi9cbmRlZihWTVByb3RvLCAnJGRlc3Ryb3knLCBmdW5jdGlvbiAobm9SZW1vdmUpIHtcbiAgICB0aGlzLiRjb21waWxlci5kZXN0cm95KG5vUmVtb3ZlKVxufSlcblxuLyoqXG4gKiAgYnJvYWRjYXN0IGFuIGV2ZW50IHRvIGFsbCBjaGlsZCBWTXMgcmVjdXJzaXZlbHkuXG4gKi9cbmRlZihWTVByb3RvLCAnJGJyb2FkY2FzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLiRjb21waWxlci5jaGlsZHJlbixcbiAgICAgICAgaSA9IGNoaWxkcmVuLmxlbmd0aCxcbiAgICAgICAgY2hpbGRcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICAgICAgY2hpbGQuZW1pdHRlci5hcHBseUVtaXQuYXBwbHkoY2hpbGQuZW1pdHRlciwgYXJndW1lbnRzKVxuICAgICAgICBjaGlsZC52bS4kYnJvYWRjYXN0LmFwcGx5KGNoaWxkLnZtLCBhcmd1bWVudHMpXG4gICAgfVxufSlcblxuLyoqXG4gKiAgZW1pdCBhbiBldmVudCB0aGF0IHByb3BhZ2F0ZXMgYWxsIHRoZSB3YXkgdXAgdG8gcGFyZW50IFZNcy5cbiAqL1xuZGVmKFZNUHJvdG8sICckZGlzcGF0Y2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBpbGVyID0gdGhpcy4kY29tcGlsZXIsXG4gICAgICAgIGVtaXR0ZXIgPSBjb21waWxlci5lbWl0dGVyLFxuICAgICAgICBwYXJlbnQgPSBjb21waWxlci5wYXJlbnRcbiAgICBlbWl0dGVyLmFwcGx5RW1pdC5hcHBseShlbWl0dGVyLCBhcmd1bWVudHMpXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQudm0uJGRpc3BhdGNoLmFwcGx5KHBhcmVudC52bSwgYXJndW1lbnRzKVxuICAgIH1cbn0pXG5cbi8qKlxuICogIGRlbGVnYXRlIG9uL29mZi9vbmNlIHRvIHRoZSBjb21waWxlcidzIGVtaXR0ZXJcbiAqL1xuO1snZW1pdCcsICdvbicsICdvZmYnLCAnb25jZSddLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgIC8vIGludGVybmFsIGVtaXQgaGFzIGZpeGVkIG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgLy8gZXhwb3NlZCBlbWl0IHVzZXMgdGhlIGV4dGVybmFsIHZlcnNpb25cbiAgICAvLyB3aXRoIGZuLmFwcGx5LlxuICAgIHZhciByZWFsTWV0aG9kID0gbWV0aG9kID09PSAnZW1pdCdcbiAgICAgICAgPyAnYXBwbHlFbWl0J1xuICAgICAgICA6IG1ldGhvZFxuICAgIGRlZihWTVByb3RvLCAnJCcgKyBtZXRob2QsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVtaXR0ZXIgPSB0aGlzLiRjb21waWxlci5lbWl0dGVyXG4gICAgICAgIGVtaXR0ZXJbcmVhbE1ldGhvZF0uYXBwbHkoZW1pdHRlciwgYXJndW1lbnRzKVxuICAgIH0pXG59KVxuXG4vLyBET00gY29udmVuaWVuY2UgbWV0aG9kc1xuXG5kZWYoVk1Qcm90bywgJyRhcHBlbmRUbycsIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRyZW1vdmUnLCBmdW5jdGlvbiAoY2IpIHtcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRiZWZvcmUnLCBmdW5jdGlvbiAodGFyZ2V0LCBjYikge1xuICAgIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgICB2YXIgZWwgPSB0aGlzLiRlbFxuICAgIHRyYW5zaXRpb24oZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQpXG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5kZWYoVk1Qcm90bywgJyRhZnRlcicsIGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICAgIHZhciBlbCA9IHRoaXMuJGVsXG4gICAgdHJhbnNpdGlvbihlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5uZXh0U2libGluZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVsKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYikgbmV4dFRpY2soY2IpXG4gICAgfSwgdGhpcy4kY29tcGlsZXIpXG59KVxuXG5mdW5jdGlvbiBxdWVyeSAoZWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVsID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgICAgIDogZWxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TW9kZWxcbiJdfQ==
