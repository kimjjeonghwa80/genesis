(function () {
  'use strict';

  angular
    .module('canvas')
    .controller('CanvasListController', CanvasListController);

  CanvasListController.$inject = ['CanvasService'];

  function CanvasListController(CanvasService) {
    var vm = this;

    vm.canvas = CanvasService.query();
  }
})();
