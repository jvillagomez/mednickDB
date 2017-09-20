(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('FoosService', FoosService);

    FoosService.$inject = ['$http', 'MednickConfig'];

    /* @ngInject */
    function FoosService($http, MednickConfig) {
        var service = this;

        service.get = function(){
          return $http({
            method: "GET",
            url: MednickConfig.apiUrl + '/studies/'
          })
        }

        service.getFooById = function(){
          //api call to get foo by id
        }


    }
})();
