(function() {
  'use strict';

  angular
    .module('Foo')
    .controller('FoosController', FoosController);

  FoosController.$inject = ['FoosService'];

  function FoosController(FoosService) {
    var vm = this;
    vm.fooText = "Hello World";
    vm.foos = "";

    init();

    function init() {
      FoosService.get().then(function(response) {
          console.log(response);
          vm.foos = response.data;
        },
        function error(err) {
          //do stuff if error
          console.log('err', err);
        })
    }
  }
})();
