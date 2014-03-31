angular.module('issuemarket.controllers.payments', []).controller('PaymentsController',
  ['$scope',
  '$location',
  'Global',
  'Payment',
  function($scope, $location, Global, Payment){
    $scope.global = Global;

    // var tokenHandler = function(card){
    //   if(card.status_code == 201){
    //     var fundingInstrument = response.cards != null ? response.cards[0] : response.bank_accounts[0];
    //     var campaginId = $scope.chatroomId;
    //     var userId = $scope.userId;
    //     var newPayment = new Payment({
    //       giver: $scope.global.user._id,
    //       taker: $scope.campaign.merchants,
    //       campaign: $scope.campaign._id,
    //       amount: $scope.amount,
    //       balancedToken: card.cards[0].id,
    //       url: card.cards[0].href,
    //       title: $scope.title,
    //       description: $scope.description
    //     })

    //     newPayment.$save(function(data){
    //       console.log(data);
    //     })
    //   } else{
    //     console.log('failed to tokenize card')
    //   }

    //   // over here we pass the card token to the backend
    //   // we want to store the payment obejct
    //   // both in the user and campaign
    //   // at the same time we also want to store the
    //   // card token within the user who made the payment

    //   // i will need the user
    // }




    // $scope.createCard = function(){
    //   var payload = {
    //     name: $scope.name,
    //     number: $scope.number,
    //     expiration_month: $scope.expiration_month,
    //     expiration_year: $scope.expiration_year,
    //     security_code: $scope.security_code
    //   }

    //   balanced.card.create(payload, tokenHandler);
    //   // there will be a form that will give us the value of the new payment
    //   // this should first link to campaign and then save to the user object as well
    // }
    // // this should also be in its own controller
    // // this should also add to the escrowfund
  }]
);
