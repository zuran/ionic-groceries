(function () {
  'use strict';
  
  angular
    .module('groceries')
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('list', {
          url: '/list',
          templateUrl: 'app/list/list.html',
          controller: 'ListCtrl'
        });
      $urlRouterProvider.otherwise('/list');
    })
    .directive('activeItem', activeItem)
    .directive('inactiveItem', inactiveItem);
  
  function activeItem() {
    return {
      templateUrl: '/app/list/active-item.directive.html'
    };
  }
  
  function inactiveItem() {
    return {
      templateUrl: '/app/list/inactive-item.directive.html'
    };
  }
})();