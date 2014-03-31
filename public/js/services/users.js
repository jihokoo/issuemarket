angular.module('issuemarket.services.users', []).factory('User', ["$resource",
    function($resource) {
        return $resource('/user/:userId',{
          userId: '@_id'
        }, {
          update: {
            method: 'PUT'
          }
        });
    }
]);
