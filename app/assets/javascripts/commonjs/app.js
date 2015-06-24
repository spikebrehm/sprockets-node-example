'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var Todos = require('./collections/todos');
var AppView = require('./views/app-view');
Backbone.$ = $;

function init() {
  // Create our collection of **Todos**.
  var todos = new Todos();

  // kick things off by creating the **AppView**.
  new AppView({todos: todos});
}

module.exports = init;
