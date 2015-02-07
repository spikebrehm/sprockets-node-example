# Be sure to restart your server when you modify this file.

require Rails.root.join('lib/browserify_template')

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w( globals/manifest.js commonjs/manifest.bundle.js )

Rails.application.assets.register_postprocessor 'application/javascript', BrowserifyTemplate
