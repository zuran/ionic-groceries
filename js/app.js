/*global angular, cordova, StatusBar, window*/
(function () {

  "use strict";
  // Ionic Starter App
  var db = null;
  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  angular.module('groceries', ['ionic', 'ngCordova'])
    .run(function ($ionicPlatform, $cordovaSQLite) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
        //db = $cordovaSQLite.openDB("groceries.db");
        //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS groceries (id integer primary key, item text, price real)");
      });
    });
}());