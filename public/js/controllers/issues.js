angular.module('issuemarket.controllers.issues', []).controller('CampaignsController',
  ['$scope',
  '$location',
  '$stateParams',
  'Global',
  'Payment',
  'Campaign',
  function($scope, $location, $stateParams, Global, Payment, Campaign){
    $scope.global = Global;

    var issueUrl;

    $scope.issueUrl;
    $scope.campaignForm = function(issue){
      if($scope.global.user.balancedToken){
        $location.path('/campaign/form/'+issue.id);
      } else{
        $location.path('/createCard')
      }
      // i am getting the url that i want
      // i just need to store the data somewhere temporarily
      // think about twitter, we stored in an object and reached back for it
      // it does not persist forever but it does until our connection is lost i think

      // add "/collaborators" to the $scope.url
      // then make a request using collaborators
      // i get an array of collaborators
      // then fire of requests for each individual user
      // for their emails and then use nodemailer to send them
      // emails
    };

    $scope.toCampaignPage = function(campaign){
      $location.path('/campaign/'+campaign._id);
    }

    $scope.merchants = false;
    $scope.marketplaces = false;
    $scope.contributions = false;

    $scope.showMerchants = function(){
      $scope.merchants = !$scope.merchants;
      $scope.marketplaces = $scope.marketplaces;
      $scope.contributions = $scope.contributions;
    };

    $scope.showMarketplaces = function(){
      $scope.merchants = $scope.merchants;
      $scope.marketplaces = !$scope.marketplaces;
      $scope.contributions = $scope.contributions;
    };

    $scope.showContributions = function(){
      $scope.merchants = $scope.merchants;
      $scope.marketplaces = $scope.marketplaces;
      $scope.contributions = !$scope.contributions;
    };

    $scope.newCustomer = function(){
      var newCustomer = $scope.global.user;
      newCustomer.$update(function(customer){
        console.log(customer);
      });
    };
    // this should be in its own controller
    // this should add to the escrowfund

    // this should also be in its own controller
    // this should also add to the escrowfund

    $scope.addPayment = function(){
      console.log("hello")
        var newPayment = new Payment({
          giver: $scope.global.user._id,
          taker: $scope.campaign.merchants[0]._id,
          campaign: $scope.campaign._id,
          amount: $scope.amount,
          status: 'Pending',
          statement: $scope.statement
        })
        newPayment.$save(function(payment){
          console.log("payment");
          console.log(payment);
          $location.path('/')
        })
      // there will be a form that will give us the value of the new payment
      // this should first link to campaign and then save to the user object as well
    }

    $scope.preClick = true;
    $scope.paymentForm = function(){
      if($scope.global.user.balancedToken){
        $scope.preClick = false;
      } else{
        $location.path('/createCard')
      }
    };

    $scope.createCampaign = function(){
      if($scope.global.user.balancedToken){
        var newCampaign = new Campaign({
          merchants: [$scope.global.user._id],
          tiltThreshold: $scope.tiltThreshold,
          description: $scope.description,
          message: $scope.message,
          title: $scope.title,
          issueId: $stateParams.issueId
        });
        newCampaign.$save(function(campaign){
          console.log(campaign);
          $location.path('/campaign/'+campaign._id);
        });
      } else{
        $location.path('/createCard');
      }
    };
    // we have if, else here because the user can be logged in
    // but never have made a campaign before
    // in this case, if the user already has paid we will hide the
    // credit card form, else if no balancedtoken is attached to the window.user
    // then we show the form and input the values in createCard
    // nomsaiyan?

    // var createCard = function(done){
    //   var payload = {
    //     name: $scope.name,
    //     number: $scope.number,
    //     expiration_month: $scope.expiration_month,
    //     expiration_year: $scope.expiration_year,
    //     security_code: $scope.security_code
    //   };
    //   balancedd.card.create(payload, done);
    // }

    $scope.findOne = function(campaign_id){
      if(campaign_id){
        Campaign.get({
          campaignId: campaign_id
        }, function(campaign){
          $scope.campaign = campaign;
          console.log(campaign);
        })
      }else{
        Campaign.get({
          campaignId: $stateParams.campaignId
        }, function(campaign){
          $scope.campaign = campaign;
          console.log(campaign);
        })
      }
    };

    $scope.findAll = function(){
      Campaign.query(function(campaigns){
        console.log(campaigns)
        $scope.campaigns = campaigns;
      })
    }
  }]
);
