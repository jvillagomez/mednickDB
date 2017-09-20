(function() {
  'use strict';

  angular
    .module('Foo')
    .controller('FooDetailsController', FooDetailsController);

  FooDetailsController.$inject = ['$stateParams', 'FoosService'];

  /* @ngInject */
  function FooDetailsController($stateParams, FoosService) {
    var vm = this;
    vm.stateParams = $stateParams;

    FoosService.getFooById()
      .then(function(response) {
          //response.
          //bind to vm
        },
        function error() {
            // do stuff if error
        })
  }
})();
