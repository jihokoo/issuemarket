//Setting up route
window.app.config(['$stateProvider','$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('main', {
            url:'/',
            templateUrl: 'views/index.html'
        })
        .state('runningCampaigns', {
            url:'/runningCampaigns',
            templateUrl: 'views/users/runningCampaigns.html'
        })
        .state('homePage', {
            url:'/homepage/:userId',
            templateUrl: 'views/users/myHome.html'
        })
        .state('campaignform', {
            url:'/campaign/form/:issueId',
         // change bountyForm to campaignForm on the html side and $location in controller
            templateUrl: 'views/campaign/campaignForm.html'
        })
        .state('campaign', {
            url:'/campaign/:campaignId',
            templateUrl: 'views/campaign/view.html',
        })
            .state('campaign.details', {
                views:{
                    "merchants":{
                        templateUrl: 'views/campaign/merchantsSnapshot.html'
                    },
                    "marketplaces":{
                        templateUrl: 'views/campaign/marketplacesSnapshot.html'
                    },
                    "contributions":{
                        templateUrl: 'views/campaign/contributionsSnapshot.html'
                    }
                }
            })
            // for notes on nested states
            // https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
        .state('paymentform', {
            url:'/paymentform',
            templateUrl: 'views/'
        })
        .state('cardform', {
            url:'/createCard',
            templateUrl: 'views/createCard.html'
        });

    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);
