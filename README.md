# Sprockets-Node Example

An example Rails app showing how to integrate Sprockets with a Node.js-based asset
pipeline, using Browserify.

## Installation

First, clone the repo somewhere locally:

    $ git clone git@github.com:spikebrehm/sprockets-node-example.git

Then, run `bundle install` and `npm install` to install Ruby and JavaScript dependencies:

    $ bundle install
    $ npm install

Now you should be able to to run the Rails server:

    $ rails server

Check out the app running at `http://localhost:3000`.

Check out the `lib/browserify_template.rb` file and `script/assets/*.js` files for
the good stuff.
