/*global angular*/
(function () {
  "use strict";
  
  angular
    .module('groceries')
    .controller('ListCtrl', ['$scope', '$localstorage', '$ionicPopup', '$filter', 'dataService',
      function ($scope, $localstorage, $ionicPopup, $filter, dataService) {

        $scope.vm = {
          activeList: [],
          inactiveList: []
        };

        //$localstorage.setObject('groceries', {});
        
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

        var test = dataService.getStoreItemDatabase();
        test.find({
          success: function (results) {
            mergeTemplate(results);
          },
          error: function (error) {
            var a = 1;
          }
        });

        function mergeTemplate(storeItems) {
          var i = 0, j = 0, k = 0;
          for (i = 0; i < storeItems.length; i++) {
            var itemName = storeItems[i].get('name'),
                itemPrice = storeItems[i].get('price'),
                exists = false;
            
            for (j = 0; j < $scope.vm.activeList.length; j++) {
              if($scope.vm.activeList[j].name === itemName) {
                exists = true;
                break;
              }
            }
            
            for (k = 0; k < $scope.vm.inactiveList.length; k++) {
              if($scope.vm.inactiveList[k].name === itemName) {
                exists = true;
                break;
              }
            }
            
            if(exists) continue;
            $scope.vm.inactiveList.push({name: itemName, price: itemPrice, quantity: 1});
          }
          $scope.vm.inactiveList = $filter('orderBy')($scope.vm.inactiveList, 'name');
          $localstorage.setObject('groceries', $scope.vm);
        }
        
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
            templateUrl: 'app/list/add-item.template.html',
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
            templateUrl: 'app/list/add-item.template.html',
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
        
        
        
      }]);
}());