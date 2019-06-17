require 'roda'

module Template
class App < Roda
  plugin :render
  plugin :assets, css: "app.css", js: "app.js"

  route do |r|
    r.assets

    r.root do
      view "index"
    end
  end
end
end
