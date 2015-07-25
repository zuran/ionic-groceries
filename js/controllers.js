/*global angular*/
(function () {
  "use strict";
  
  angular
    .module('groceries', ['ionic', 'ionic.utils'])
    .controller('ListCtrl', ['$scope', '$localstorage', '$ionicPopup', '$filter',
      function ($scope, $localstorage, $ionicPopup, $filter) {

        $scope.vm = {
          activeList: [],
          inactiveList: []
        };

        if (!$localstorage.getObject('groceries') ||
            !$localstorage.getObject('groceries').activeList) {
          $localstorage.setObject('groceries', $scope.vm);
        }
        
        if ($localstorage.getObject('groceries').activeList.length === 0) {
          $scope.vm.activeList = [
            {name: 'Apples', price: 5.99, quantity: 2},
            {name: 'Bananas', price: 0.99, quantity: 3},
            {name: 'Bread', price: 1.89, quantity: 1},
            {name: 'Carrots', price: 2.50, quantity: 1}
            
          ];
          $scope.vm.inactiveList = [
            {name: 'Ketchup', price: 2.34, quantity: 1},
            {name: 'Tofu', price: 2.99, quantity: 1}
          ];
          $localstorage.setObject('groceries', $scope.vm);
        }
        
        $scope.vm = $localstorage.getObject('groceries');
        
        function getTotal() {
          var total = 0;
          angular.forEach($scope.vm.activeList, function (value, key) {
            total += value.price * value.quantity;
          });
          return total;
        }

        $scope.subtractQuantity = function (item, index) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            $scope.vm.inactiveList.push(item);
            $scope.vm.inactiveList = $filter('orderBy')($scope.vm.inactiveList, 'name');
            $scope.vm.activeList.splice(index, 1);
          }
          $scope.vm.total = getTotal();
          $localstorage.setObject('groceries', $scope.vm);
        };
        
        $scope.addQuantity = function (item) {
          item.quantity += 1;
          $scope.vm.total = getTotal();
          $localstorage.setObject('groceries', $scope.vm);
        };
        
        $scope.vm.total = getTotal();
        
        $scope.activateItem = function (item, index) {
          $scope.vm.activeList.push(item);
          $scope.vm.activeList = $filter('orderBy')($scope.vm.activeList, 'name');
          $scope.vm.inactiveList.splice(index, 1);
          $localstorage.setObject('groceries', $scope.vm);
          $scope.vm.total = getTotal();
        };
        
        $scope.deleteItem = function (index) {
          $scope.vm.inactiveList.splice(index, 1);
          $localstorage.setObject('groceries', $scope.vm);
        };
        
        $scope.addClicked = function () {
          $scope.newItem = {
            name: undefined,
            quantity: 1,
            price: undefined
          };
          
          var popup = $ionicPopup.show({
            template: '<label class="item item-input"><span class="input-label">Item Name</span><input ng-model="newItem.name" type="text"></label><label class="item item-input"><span class="input-label">Price</span><input ng-model="newItem.price" type="number"></label>',
            title: 'Add Item',
            scope: $scope,
            buttons: [
              {
                text: 'Add',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.newItem.name || !$scope.newItem.price) {
                    e.preventDefault();
                  } else {
                    $scope.vm.activeList.push($scope.newItem);
                    $scope.vm.activeList = $filter('orderBy')($scope.vm.activeList, 'name');
                    $scope.vm.total = getTotal();
                    $localstorage.setObject('groceries', $scope.vm);
                    return $scope.newItem;
                  }
                }
              },
              { text: 'Cancel' }
            ]
          });
        };
        
        $scope.editClicked = function (index, list) {
          $scope.newItem = {
            name: list[index].name,
            quantity: list[index].quantity,
            price: list[index].price
          };
          
          
          
          var popup = $ionicPopup.show({
            template: '<label class="item item-input"><span class="input-label">Item Name</span><input ng-model="newItem.name' +
              '" type="text"></label><label class="item item-input"><span class="input-label">Price</span><input ng-model="newItem.price' +
              '" type="number"></label>',
            title: 'Edit Item',
            scope: $scope,
            buttons: [
              {
                text: 'Save',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.newItem.name || !$scope.newItem.price) {
                    e.preventDefault();
                  } else {
                    list.splice(index, 1);
                    list.push($scope.newItem);
                    if (list === $scope.vm.activeList) {
                      $scope.vm.activeList = $filter('orderBy')(list, 'name');
                    } else { $scope.vm.inactiveList = $filter('orderBy')(list, 'name'); }
                    $scope.vm.total = getTotal();
                    $localstorage.setObject('groceries', $scope.vm);
                    return $scope.newItem;
                  }
                }
              },
              { text: 'Cancel' }
            ]
          });
        };
        
        
        
      }])
  .directive('activeListItem', function() {
    return {
      templateUrl: 'active-list-item.html'
    };
  })
  .directive('inactiveListItem', function() {
    return {
      templateUrl: 'inactive-list-item.html'
    };
  });
}());