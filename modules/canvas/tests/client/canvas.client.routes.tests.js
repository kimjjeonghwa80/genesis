(function () {
  'use strict';

  describe('Canvas Route Tests', function () {
    // Initialize global variables
    var $scope,
      CanvasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CanvasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CanvasService = _CanvasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('canvas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/canvas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CanvasController,
          mockCanva;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('canvas.view');
          $templateCache.put('modules/canvas/client/views/view-canva.client.view.html', '');

          // create mock Canva
          mockCanva = new CanvasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Canva Name'
          });

          //Initialize Controller
          CanvasController = $controller('CanvasController as vm', {
            $scope: $scope,
            canvaResolve: mockCanva
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:canvaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.canvaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            canvaId: 1
          })).toEqual('/canvas/1');
        }));

        it('should attach an Canva to the controller scope', function () {
          expect($scope.vm.canva._id).toBe(mockCanva._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/canvas/client/views/view-canva.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CanvasController,
          mockCanva;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('canvas.create');
          $templateCache.put('modules/canvas/client/views/form-canva.client.view.html', '');

          // create mock Canva
          mockCanva = new CanvasService();

          //Initialize Controller
          CanvasController = $controller('CanvasController as vm', {
            $scope: $scope,
            canvaResolve: mockCanva
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.canvaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/canvas/create');
        }));

        it('should attach an Canva to the controller scope', function () {
          expect($scope.vm.canva._id).toBe(mockCanva._id);
          expect($scope.vm.canva._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/canvas/client/views/form-canva.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CanvasController,
          mockCanva;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('canvas.edit');
          $templateCache.put('modules/canvas/client/views/form-canva.client.view.html', '');

          // create mock Canva
          mockCanva = new CanvasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Canva Name'
          });

          //Initialize Controller
          CanvasController = $controller('CanvasController as vm', {
            $scope: $scope,
            canvaResolve: mockCanva
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:canvaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.canvaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            canvaId: 1
          })).toEqual('/canvas/1/edit');
        }));

        it('should attach an Canva to the controller scope', function () {
          expect($scope.vm.canva._id).toBe(mockCanva._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/canvas/client/views/form-canva.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
