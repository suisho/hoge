require 'sinatra'
require "sinatra/reloader"
require 'slim'
require 'json'

require './lib/halite'
require './lib/random_halite'

register Sinatra::Reloader
also_reload "lib/*"


# Your modular application code goes here...
get '/' do
  @halites = (0..10).map do
    RandomHalite.generate
  end
  slim :halite
end

get '/param' do
  {
    points:    halite.points,
    triangles: halite.triangles
  }.to_json
end
