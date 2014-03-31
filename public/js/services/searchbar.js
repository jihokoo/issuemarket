angular.module('issuemarket.services.searchbar', []).factory('Searchbar', ["$resource",
    function($resource) {
        return $resource('/searchbar/:searchbarId',{
          searchbarId: '@_id'
        }, {
          update: {
            method: 'POST'
          }
        });
    }
]);
