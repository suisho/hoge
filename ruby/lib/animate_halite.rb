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
    polygon_set.map.with_index do |p,i|
      AnimatePolygon.new(p, @halites[0].polygons[i].css_class)
    end
  end

  class AnimatePolygon 
    def initialize(points, css_class)
      @points = points
      @css_class = css_class
    end
    
    def css_class
      @css_class
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