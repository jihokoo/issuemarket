angular.module('issuemarket.controllers.searchbar', []).controller('SearchbarController',
  ['$scope',
  '$location',
  'Global',
  'Searchbar',
  function($scope, $location, Global, Searchbar){
    $scope.global = Global;
    var socks = new SockJS('/echo');

    $scope.languages = ['Javascript', 'Ruby', 'Perl', 'Java', 'C++'];

    $scope.search = function(){
      var searchForm = new Searchbar({
        language: $scope.language,
        sortBy: $scope.sortBy,
        searchFor: $scope.searchFor
      });
      searchForm.$save(function(githubResponse){
        $scope.githubResponse = githubResponse;
        socks.send(["$scope.githubResponse"]);
      });
    };

    $scope.findTemporaryIssues = function(){
      Searchbar.query(function(response){
        console.log(response);
        $scope.temporary_issues = response;
      })
    }
    $scope.onSelect = function ($item, $model, $label) {
      $scope.$item = $item;
      $scope.$model = $model;
      $scope.$label = $label;
      console.log($item)
      console.log($model)
      console.log($label)
    };


    socks.onmessage = function(e) {
        console.log(e);
        $scope.issues = eval("("+e.data+")").items;
        console.log($scope.issues.length);
        console.log($scope.issues);
        $scope.$apply();
    };
  }]
);
// https://github.com/explore
