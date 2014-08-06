require './lib/polygon'

class Halite
  def self.generate_random(seed = nil)
    r = Random.new(seed || Random.new_seed)
    self.new(
      (1..8).map do { 
          # 長さ
          norm:  r.rand(20..80),
          # 角度(基本角度に対する追加分) 
          degree: r.rand(20..80)
        }
      end
    )
  end
  
  def initialize(params)
    @params = params
  end
  
  def points
    rad = Math::PI * 2 / @params.length
    @points ||= @params.map.with_index do |param, i|      
      angle = rad * (i + (param[:degree] / 100) )
      calc_point(param[:norm], angle)
    end
  end
  
  def triangles
    @triangles ||= points.map.with_index do |pt, i|
      [ [0, 0],
        points[i],
        points[(i + 1) % points.length] ]
    end
  end
  
  def base_polygon
    Polygon.new(points, ["base"])
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
      #return if color[i] == "middle"
      Polygon.new(t, ["triangle", color[i] ] ) 
    end
  end
  
  def polygons
    @polygons ||= [base_polygon] + triangle_polygons
  end

  private
  
  def calc_point(norm, angle)
    [
      norm * Math.sin(angle), 
      norm * Math.cos(angle),
    ]
  end
end