angular.module('issuemarket.controllers.users', []).controller('UsersController',
  ['$scope',
  '$location',
  '$stateParams',
  'Global',
  'User',
  'Payment',
  function($scope, $location, $stateParams, Global, User, Payment){
    $scope.global = Global;

    var tokenHandler = function(card){
      var user = new User({
        _id: $scope.global.user._id,
      });
      console.log(card);
      user.balancedToken = card.cards[0].id;
      user.$update(function(payment){
        console.log(payment);
        $location.path('/');
      });
    };




    $scope.createCard = function(){
      var payload = {
        name: $scope.name,
        number: $scope.number,
        expiration_month: $scope.expiration_month,
        expiration_year: $scope.expiration_year,
        security_code: $scope.security_code
      }

      balanced.card.create(payload, tokenHandler);
      // there will be a form that will give us the value of the new payment
      // this should first link to campaign and then save to the user object as well
    };
    // this should be in its own controller
    // this should add to the escrowfund

    $scope.findOne = function(user_id){
      if(user_id){
        User.get({
          userId: user_id
        }, function(user){
          $scope.user = user;
        });
      } else{
        User.get({
          userId: $stateParams.userId
        }, function(user){
          $scope.user = user;
        });
        // i want to use the global.user._id
      }
    };


    $scope.findAll = function(){
      User.query(function(response){
        $scope.users = response.users;
      })
    }
  }]
);
