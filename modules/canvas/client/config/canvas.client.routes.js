(function () {
  'use strict';

  angular
    .module('canvas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('canvas', {
        abstract: true,
        url: '/canvas',
        template: '<ui-view/>'
      })
      .state('canvas.list', {
        url: '',
        templateUrl: 'modules/canvas/client/views/list-canvas.client.view.html',
        controller: 'CanvasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Canvas List'
        }
      })
      .state('canvas.create', {
        url: '/create',
        templateUrl: 'modules/canvas/client/views/form-canva.client.view.html',
        controller: 'CanvasController',
        controllerAs: 'vm',
        resolve: {
          canvaResolve: newCanva
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Canvas Create'
        }
      })
      .state('canvas.edit', {
        url: '/:canvaId/edit',
        templateUrl: 'modules/canvas/client/views/form-canva.client.view.html',
        controller: 'CanvasController',
        controllerAs: 'vm',
        resolve: {
          canvaResolve: getCanva
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Canva {{ canvaResolve.name }}'
        }
      })
      .state('canvas.view', {
        url: '/:canvaId',
        templateUrl: 'modules/canvas/client/views/view-canva.client.view.html',
        controller: 'CanvasController',
        controllerAs: 'vm',
        resolve: {
          canvaResolve: getCanva
        },
        data:{
          pageTitle: 'Canva {{ articleResolve.name }}'
        }
      });
  }

  getCanva.$inject = ['$stateParams', 'CanvasService'];

  function getCanva($stateParams, CanvasService) {
    return CanvasService.get({
      canvaId: $stateParams.canvaId
    }).$promise;
  }

  newCanva.$inject = ['CanvasService'];

  function newCanva(CanvasService) {
    return new CanvasService();
  }
})();
