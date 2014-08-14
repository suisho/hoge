require './lib/polygon'

class Halite  
  def initialize(params, center)
    @params = params
    @center = center || {
      x: 0, y: 0
    }
  end
  
  def points
    rad = Math::PI * 2 / @params.length
    @points ||= @params.map.with_index do |param, i|      
      p param[:degree]/100.0
      angle = rad * (i + (param[:degree] / 100.0) )
      calc_point(param[:norm], angle)
    end
  end

  def triangles
    @triangles ||= points.map.with_index do |pt, i|
      [ @center,
        points[i],
        points[(i + 1) % points.length] ]
    end
  end
  
  def triangle_polygons
    color = [
      "middle",
      "dark", 
      "middle",
      "dark",
      "light", 
      "middle", 
      "dark", 
      "light", 
    ]
    self.triangles.map.with_index do |t, i| 
      Polygon.new(t, ["triangle", color[i] ] ) 
    end
  end
  
  def polygons
    @polygons ||= [base_polygon] + triangle_polygons
  end

  private
  
  def calc_point(norm, angle)
    {
      x: (norm * Math.sin(angle)).round(2),
      y: (norm * Math.cos(angle)).round(2)
    }
  end
end