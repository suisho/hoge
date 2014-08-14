class Polygon
  def initialize(points, css_class)
    @points = points
    @css_class = css_class
  end
  
  def css_class
    @css_class.join(" ")
  end
  
  def svg_points
    @points.map{ |p| "#{p[:x]},#{p[:y]}" }.join(" ")
  end  
end