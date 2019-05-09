'use strict';

angular.module('stockDogApp')
   // [1]注册指令和注入依赖
  .directive('stkWatchlistPanel',
    function ($location, $modal, $routeParams, WatchlistService) {
    return {
      templateUrl: 'views/templates/watchlist-panel.html',
      restrict: 'E',
      scope: {},
      link: function ($scope) {
        //  [2]初始化变量 
        $scope.watchlist = {};
        $scope.currentList = $routeParams.listId;
        var addListModal = $modal({
          scope: $scope,
          template: 'views/templates/addlist-modal.html',
          show: false
        });

           // [3]将服务中的模型绑定到该作用域 
        $scope.watchlists = WatchlistService.query();

        //  [4 】显示 addlist modal 
        $scope.showModal = function () {
          addListModal.$promise.then(addListModal.show);
        };

        // [5]根据模态框中的字段创建一个新的列表 
        $scope.createList = function () {
          WatchlistService.save($scope.watchlist);
          addListModal.hide();
          $scope.watchlist = {};
        };

        //   [6]删除目标列表并重定向至主页  
        $scope.deleteList = function (list) {
          WatchlistService.remove(list);
          $location.path('/');
        };

        //  
        $scope.gotoList = function (listId) {
          $location.path('watchlist/' + listId);
        };
      }
    };
  });
