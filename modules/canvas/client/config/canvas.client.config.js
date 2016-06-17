(function () {
  'use strict';

  angular
    .module('canvas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Canvas',
      state: 'canvas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'canvas', {
      title: 'List Canvas',
      state: 'canvas.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'canvas', {
      title: 'Create Canva',
      state: 'canvas.create',
      roles: ['user']
    });
  }
})();
