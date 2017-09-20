(function() {
    'use strict';

    angular
        .module('Mednick', [
            'ngMaterial',
            'lfNgMdFileInput',
            'ui.router',
            'ngResource',
            'Mednick.Services',
            'Foo',
            'Login',
            'Home',
            'Upload',
            'Documents',
            'DocumentFilters'
        ])
        .constant('MednickConfig', {
            apiUrl: 'http://127.0.0.1:8001'
        })
        .config(function($mdThemingProvider, $httpProvider, $resourceProvider) {

            // Don't strip trailing slashes from calculated URLs
            $resourceProvider.defaults.stripTrailingSlashes = false;

            $mdThemingProvider
                .theme('default')
                .primaryPalette('teal')
                .accentPalette('deep-purple', {
                    'default': '800', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                .warnPalette('red')
                .backgroundPalette('grey');

            /* $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
               $httpProvider.defaults.xsrfCookieName = 'csrftoken';
               $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
               $httpProvider.defaults.withCdredentials = true;
               console.log($httpProvider);*/
        });

})();
