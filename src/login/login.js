angular.module('plexcompare')
  .controller('LoginCtrl', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
    $scope.login = function(username, password) {
      AuthService.authenticate(username, password)
        .then(function() {
          $state.go('home');
        });
    }
  }]);