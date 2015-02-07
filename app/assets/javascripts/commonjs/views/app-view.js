'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var TodoRouter = require('../routers/router');
var TodoView = require('./todo-view');
var keys = require('../keys');
var statsTemplate = require('../../templates/stats.hbs');

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
module.exports = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#todoapp',

  // Our template for the line of statistics at the bottom of the app.
  statsTemplate: statsTemplate,

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize: function (options) {
    this.todos = options.todos;
    this.router = new TodoRouter(this.todos);
    Backbone.history.start();

    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.$list = $('#todo-list');

    this.listenTo(this.todos, 'add', this.addOne);
    this.listenTo(this.todos, 'reset', this.addAll);
    this.listenTo(this.todos, 'change:completed', this.filterOne);
    this.listenTo(this.todos, 'filter', this.filterAll);
    this.listenTo(this.todos, 'all', this.render);

    // Suppresses 'add' events with {reset: true} and prevents the app view
    // from being re-rendered for every model. Only renders when the 'reset'
    // event is triggered at the end of the fetch.
    this.todos.fetch({reset: true});
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function () {
    var completed = this.todos.completed().length;
    var remaining = this.todos.remaining().length;

    if (this.todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining,
        singular: remaining === 1
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (this.router.TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function (todo) {
    var view = new TodoView({ model: todo, router: this.router });
    this.$list.append(view.render().el);
  },

  // Add all items in the **Todos** collection at once.
  addAll: function () {
    this.$list.html('');
    this.todos.each(this.addOne, this);
  },

  filterOne: function (todo) {
    todo.trigger('visible');
  },

  filterAll: function () {
    this.todos.each(this.filterOne, this);
  },

  // Generate the attributes for a new Todo item.
  newAttributes: function () {
    return {
      title: this.$input.val().trim(),
      order: this.todos.nextOrder(),
      completed: false
    };
  },

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to *localStorage*.
  createOnEnter: function (e) {
    if (e.which === keys.ENTER_KEY && this.$input.val().trim()) {
      this.todos.create(this.newAttributes());
      this.$input.val('');
    }
  },

  // Clear all completed todo items, destroying their models.
  clearCompleted: function () {
    _.invoke(this.todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function () {
    var completed = this.allCheckbox.checked;

    this.todos.each(function (todo) {
      todo.save({
        completed: completed
      });
    });
  }
});
