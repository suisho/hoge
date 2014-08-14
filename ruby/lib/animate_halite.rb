class AnimateHalite
  def initialize(halites)
    @halites = halites
  end

  def polygons
    polygon_set = []
    @halites.map do |halite|
      halite.polygons.each.with_index do |polygon, i|
        polygon_set[i] ||= []
        polygon_set[i].push polygon
      end
    end
    h = Random.rand(0..360)
    
    polygon_set.map.with_index do |p,i|
      AnimatePolygon.new(p, @halites[0].polygons[i].css_class,h)
    end
  end

  class AnimatePolygon 
    def initialize(points, css_class, h)
      @points = points
      @css_class = css_class
      @h = h
    end
    
    def css_class
      @css_class
    end
    
    def svg_colors
      (1..@points.length).map {
        s = Random.rand(0..100)
        l = Random.rand(0..100)
        "hsl(#{h}, 74%, #{l}%)"
      }.join(";")
    end
    
    def svg_points
      pts = @points.map do |pts|
        pts.svg_points
      end
      pts.push pts.first
      pts.join(";")
    end
  end
end