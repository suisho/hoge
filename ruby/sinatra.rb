require 'sinatra'
require "sinatra/reloader"
require 'slim'
require 'json'

require './lib/halite'

register Sinatra::Reloader
also_reload "lib/*"


# Your modular application code goes here...
get '/' do
  halites = [
    Halite.generate_random,
    Halite.generate_random,
    Halite.generate_random,
    Halite.generate_random,
  ]
  @halites = halites
  slim :halite
end

get '/param' do
  {
    points:    halite.points,
    triangles: halite.triangles
  }.to_json
end
