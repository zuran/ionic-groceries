/*global angular*/
(function () {
  "use strict";
  
  angular
    .module('groceries', ['ionic', 'ionic.utils'])
    .controller('ListCtrl', ['$scope', '$localstorage', '$ionicPopup',
      function ($scope, $localstorage, $ionicPopup) {

        var groceryItemArray, vm = {
          activeList: [],
          inactiveList: []
        };
        
        $scope.vm = vm;

        $scope.groceryItems = $localstorage.getObject('groceries');
        //$localstorage.setObject('groceries', groceryItemArray);

        function getTotal() {
          var total = 0;
          angular.forEach($scope.vm.activeList, function (value, key) {
            total += value.price * value.quantity;
          });
          return total;
        }

        $scope.subtractQuantity = function (item) {
          if (item.quantity > 0) {
            item.quantity -= 1;
          }
          $scope.vm.total = getTotal();
        };
        
        $scope.addQuantity = function (item) {
          item.quantity += 1;
          $scope.vm.total = getTotal();
        };
        
        vm.activeList.push({
          name: 'Bread',
          quantity: 1,
          price: 1.89
        });

        $scope.vm.total = getTotal();
        
        $scope.addClicked = function () {
          $scope.newItem = {
            name: undefined,
            quantity: 1,
            price: undefined
          };
          
          var popup = $ionicPopup.show({
            template: '<label>Item Name</label><input ng-model="newItem.name"><label>Price</label><input ng-model="newItem.price">',
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
                    vm.activeList.push($scope.newItem);
                    $scope.vm.total = getTotal();
                    return $scope.newItem;
                  }
                }
              },
              { text: 'Cancel' }
            ]
          });
        };
        
      }]);
}());