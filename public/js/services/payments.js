angular.module('issuemarket.services.payments', []).factory('Payment', ["$resource",
    function($resource) {
        return $resource('/campaign/payment/:paymentId',{
          paymentId: '@_id'
        }, {
          update: {
            method: 'POST'
          }
        });
    }
]);
