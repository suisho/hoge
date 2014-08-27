class Polygon
  def initialize(points)
    @points = points
  end

  def svg_points
    "M" + @points.map{ |p| point_path(p) }.join(" ") 
  end  
  
  def point_path(p)
    "#{p[:x]},#{p[:y]}" 
  end
end