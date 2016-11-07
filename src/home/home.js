angular.module('plexcompare')
  .controller('HomeCtrl', ['$scope', '$q', 'PlexService', '_', function($scope, $q, PlexService, _) {

    $scope.busy = true;

    $scope.sourceServer = null;
    $scope.comparisonServers = [];
    $scope.servers = [];
    $scope.movies = [];
    
    PlexService.getServers().then(function(servers) {
      $scope.servers = servers;
      $scope.busy = false
    });

    $scope.generatePhrasing = function(server) {
      var phrase = server.name;
      if(server.hasOwnProperty('sourcetitle')) {
        phrase += ' (' + server.sourcetitle + ')';
      }
      return phrase;
    }

    $scope.setSource = function(server) {
      $scope.sourceServer = server;
    }

    $scope.toggleComparison = function(server) {
      var originalLength = $scope.comparisonServers.length;
      
      _.pull($scope.comparisonServers, server);
      
      if($scope.comparisonServers.length === originalLength) {
        $scope.comparisonServers.push(server);
      }
    }

    $scope.doComparison = function(source, comparisons) {

      var comparisonPromises = _.map(comparisons, function(comparison) {
        return PlexService.getMoviesList(comparison);
      });

      $q.all([PlexService.getMoviesList(source)].concat(comparisonPromises))
        .then(function(results) {
          console.log(JSON.stringify(results));
          var sourceMovies = results.shift();
          var comparisonMovies = _(results).flatten().uniqWith(_.isEqual).value();
          $scope.movies = _.differenceWith(comparisonMovies, sourceMovies, _.isEqual);
        });
    }

  }]);