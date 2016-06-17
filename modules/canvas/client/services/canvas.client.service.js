//Canvas service used to communicate Canvas REST endpoints
(function () {
  'use strict';

  angular
    .module('canvas')
    .factory('CanvasService', CanvasService);

  CanvasService.$inject = ['$resource'];

  function CanvasService($resource) {
    return $resource('api/canvas/:canvaId', {
      canvaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
