angular
  .module('plexcompare', ['ui.router', 'uuid', 'angularXml2json'])
  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {

    // $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: '/login/login.html'
      })
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: '/home/home.html'
      });

    $urlRouterProvider.otherwise('/home');
  }])
  .run(['$rootScope', '$location', '$state', 'AuthService', function($rootScope, $location, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      var isLogin = toState.name === 'login';
      if(isLogin) {
        return;
      }

      if(!AuthService.isAuthenticated()) {
        e.preventDefault();
        $state.go('login');
      }
    });
  }])
  .factory('_', ['$window', function($window) {
    return $window._;
  }])