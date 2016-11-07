angular.module('plexcompare')
  .factory('PlexService', ['$http', '$q', 'AuthService', 'ngXml2json', '_', function($http, $q, AuthService, ngXml2json, _) {

    var service = {}

    service.getServers = function() {
      var user = AuthService.getUser();
      return $http.get('https://plex.tv/api/resources?includeHttps=1&includeRelay=1&X-Plex-Token=' + user.authToken)
        .then(function(response) {
          var resources = ngXml2json.parser(response.data);
          var servers = _.pickBy(resources.mediacontainer.device, { product: 'Plex Media Server' });
          return _.values(servers);
        })
    }

    service.getSections = function(server) {
      console.log('getting sections for', server.name);

      var relayConnection = _.find(server.connection, { relay: 1 });
      return $http({
        method: 'GET',
        url: relayConnection.uri + '/library/sections',
        headers: {
          'X-Plex-Token': server.accesstoken
        }
      })
      .then(function(response) {
        console.log('sections returned for', server.name);
        var sections = ngXml2json.parser(response.data);
        return sections.mediacontainer.directory.length ? _.values(sections.mediacontainer.directory) : [sections.mediacontainer.directory];
      });
    }

    service.getSectionsVideoList = function(server, section) {
      console.log('getting all videos for', server.name, 'in section', section.key);

      var relayConnection = _.find(server.connection, { relay: 1 });
      return $http({
        method: 'GET',
        url: relayConnection.uri + '/library/sections/' + section.key + '/all',
        headers: {
          'X-Plex-Token': server.accesstoken
        }
      })
      .then(function(response) {
        console.log('videos returned for', server.name, 'in section', section.key);

        var videos = ngXml2json.parser(response.data);
        return _(videos.mediacontainer.video).values().map(_.partialRight(_.pick, 'title', 'year')).value();
      })
    }

    service.getMoviesList = function(server) {
      console.log('getting movies for', server.name);

      return service.getSections(server)
        .then(function(sections) {
          var movieSections = _(sections).pickBy({ type: 'movie', agent: 'com.plexapp.agents.imdb' }).values().value();

          var moviePromises = _.map(movieSections, function(section) {
            return service.getSectionsVideoList(server, section);
          });

          return $q.all(moviePromises)
            .then(function(videos) {
              console.log('movies returned for', server.name);
              return _(videos).flatten().value()
            });

        });
    }

    return service;

  }]);