(function() {
    'use strict';

    angular
        .module('Login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state'];

    function LoginController($state) {
        var vm = this;
        vm.login = login;

        function login(){
        	$state.go('private.layout.home');
        }
    }
})();
