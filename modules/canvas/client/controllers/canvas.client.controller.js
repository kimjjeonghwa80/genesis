(function () {
  'use strict';

  // Canvas controller
  angular
    .module('canvas')
    .controller('CanvasController', CanvasController);

  CanvasController.$inject = ['$scope', '$state', 'Authentication', 'canvaResolve'];

  function CanvasController ($scope, $state, Authentication, canva) {
    var vm = this;

    vm.authentication = Authentication;
    vm.canva = canva;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Canva
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.canva.$remove($state.go('canvas.list'));
      }
    }

    // Save Canva
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.canvaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.canva._id) {
        vm.canva.$update(successCallback, errorCallback);
      } else {
        vm.canva.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('canvas.view', {
          canvaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
