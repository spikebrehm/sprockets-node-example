'use strict';

var Backbone = require('backbone');

// Todo Router
// ----------
module.exports = Backbone.Router.extend({
  routes: {
    '*filter': 'setFilter'
  },

  initialize: function(todos) {
    this.todos = todos;
  },

  setFilter: function (param) {
    // Set the current filter to be used
    this.TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    this.todos.trigger('filter');
  }
});
