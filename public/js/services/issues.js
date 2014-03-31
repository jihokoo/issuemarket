angular.module('issuemarket.services.issues', []).factory('Campaign', ["$resource",
    function($resource) {
        return $resource('/campaign/:campaignId',{
          campaignId: '@_id'
        }, {
          update: {
            method: 'PUT'
          }
        });
    }
]);
