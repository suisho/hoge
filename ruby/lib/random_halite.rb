require './lib/animate_halite.rb'

class RandomHalite
  def self.generate(seed = nil)
    r = Random.new(seed || Random.new_seed)
    halites = (1..30).map do 
      self.halite(r)
    end
    AnimateHalite.new(halites)
  end
  
  def self.halite(r)
    state = (1..8).map do 
      { 
        # 長さ
        norm:  r.rand(0..100),
        # 角度(基本角度に対する追加分) 
        degree: r.rand(0..100)
      }
    end
    c = 0
    center = {
      x: r.rand(-10..10) * c,
      y: r.rand(-10..10) * c
    }
    Halite.new(
      state,  center
    )
  end
end