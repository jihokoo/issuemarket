window.app = angular.module('issuemarket',
  ['ngCookies',
  'ngResource',
  'ui.bootstrap',
  'ui.route',
  'ui.router',
  'issuemarket.controllers',
  'issuemarket.services'
  ]);

angular.module('issuemarket.controllers',
  ['issuemarket.controllers.index',
  'issuemarket.controllers.navbar',
  'issuemarket.controllers.searchbar',
  'issuemarket.controllers.issues',
  'issuemarket.controllers.payments',
  'issuemarket.controllers.users'
  ]);

angular.module('issuemarket.services',
  ['issuemarket.services.global',
  'issuemarket.services.issues',
  'issuemarket.services.payments',
  'issuemarket.services.users',
  'issuemarket.services.searchbar'
  ]);
