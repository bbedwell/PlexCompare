angular.module('plexcompare')
  .factory('AuthService', ['$http', '$httpParamSerializer', 'rfc4122', function($http, $httpParamSerializer, rfc4122) {

    var _user = null;
    var service = {};
    
    service.isAuthenticated = function() {
      return _user != null;
    }

    service.authenticate = function(username, password) {
      return $http({
        method: 'POST',
        url: 'https://plex.tv/api/v2/users/signin.json?X-Plex-Client-Identifier=' + rfc4122.v4(),
        data: serialize({ login: username, password: password }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(function(response) {
        _user = response.data;
        return _user;
      });
    }

    service.getUser = function() {
      return _user;
    }

    serialize = function(obj) {
      var str = [];
      for(var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
      return str.join("&");
    }

    return service;
  }]);