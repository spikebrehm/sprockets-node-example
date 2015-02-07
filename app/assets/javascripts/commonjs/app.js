'use strict';

var Backbone = require('backbone');
var Todos = require('./collections/todos');
var AppView = require('./views/app-view');

function init() {
  // Have to manually set jQuery on Backbone, because we're in a CommonJS
  // environment.
  Backbone.$ = window.jQuery;

  // Create our collection of **Todos**.
  var todos = new Todos();

  // kick things off by creating the **AppView**.
  new AppView({todos: todos});
}

module.exports = init;
