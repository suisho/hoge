require './lib/polygon'

class Halite  
  def initialize(params, center)
    @params = params
    @center = center || {
      x: 0, y: 0
    }
  end
  
  def points
    @points ||= param_to_points(0)
  end
  
  # ちょっとだけずらして、互いのtriangleをかぶせる
  def npoints
    @npoints ||= param_to_points(1)
  end

  def triangles
    @triangles ||= points.map.with_index do |pt, i|
      np = npoints[(i + 1) % points.length]
      [ @center, points[i], np]
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
    #@polygons ||= [base_polygon] + triangle_polygons
    @polygons ||=  triangle_polygons
  end

  private
  
  def calc_point(norm, angle)
    {
      x: (norm * Math.sin(angle)).round(2),
      y: (norm * Math.cos(angle)).round(2)
    }
  end
  
  def param_to_points(base_degree=0)
    rad = Math::PI * 2 / @params.length
    @params.map.with_index do |param, i|
      angle_addition = (param[:degree] + base_degree) / 100.0
      angle = rad * (i + angle_addition )
      calc_point(param[:norm], angle)
    end
  end
  
end