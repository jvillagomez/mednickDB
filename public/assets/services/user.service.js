(function() {
    'use strict';

    angular
        .module('Mednick.Services')
        .service('UserService', UserService);

    UserService.$inject = ['$resource'];

    function UserService($resource) {
        var vm = this;
    }
})();
