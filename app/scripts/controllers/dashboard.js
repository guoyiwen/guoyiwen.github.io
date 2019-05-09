'use strict';

angular.module('stockDogApp')
  .controller('DashboardCtrl', function ($scope, WatchlistService, QuoteService) {
    //  [1]初始化 
    var unregisterHandlers = [];
    $scope.watchlists = WatchlistService.query();
    $scope.cssStyle = 'height:300px;';
    var formatters = {
      number: [
        {
          columnNum: 1,
          prefix: '$'
        }
      ]
    };

    //  [2]辅助函数：更新图表对象
    var updateCharts = function () {
      //  双层圆环图 
      var donutChart = {
        type: 'PieChart',
        displayed: true,
        data: [['Watchlist', 'Market Value']],
        options: {
          title: 'Market Value by Watchlist',
          legend: 'none',
          pieHole: 0.4
        },
        formatters: formatters
      };
      // 柱状图 
      var columnChart = {
        type: 'ColumnChart',
        displayed: true,
        data: [['Watchlist', 'Change', { role: 'style' }]],
        options: {
          title: 'Day Change by Watchlist',
          legend: 'none',
          animation: {
            duration: 1500,
            easing: 'linear'
          }
        },
        formatters: formatters
      };

      // [3]将数据推入图表对象 
      _.each($scope.watchlists, function (watchlist) {
        donutChart.data.push([watchlist.name, watchlist.marketValue]);
        columnChart.data.push([watchlist.name, watchlist.dayChange,
          watchlist.dayChange < 0 ? 'Red' : 'Green']);
      });
      $scope.donutChart = donutChart;
      $scope.columnChart = columnChart;
    };

    // [4]用于重置控制器状态的辅助函数 
    var reset = function () {
      // [5]在注册新的股票之前清除QuoteService 
      QuoteService.clear();
      _.each($scope.watchlists, function (watchlist) {
        _.each(watchlist.stocks, function (stock) {
          QuoteService.register(stock);
        });
      });

      //  [6]在创建新的$watch监听器之前，注销现有$watch监听器
      _.each(unregisterHandlers, function(unregister) {
        unregister();
      });
      _.each($scope.watchlists, function (watchlist) {
        var unregister = $scope.$watch(function () {
          return watchlist.marketValue;
        }, function () {
          recalculate();
        });
        unregisterHandlers.push(unregister);
      });
    };

    //  [7]计算新的 total Marketvalue 和 DayChange 
    var recalculate = function () {
      $scope.marketValue = 0;
      $scope.dayChange = 0;
      _.each($scope.watchlists, function (watchlist) {
        $scope.marketValue += watchlist.marketValue ?
          watchlist.marketValue : 0;
        $scope.dayChange += watchlist.dayChange ?
          watchlist.dayChange : 0;
      });
      updateCharts();
    };
    
    // [8]监视监视列表的变化
    // Watch for changes to watchlists. Notice that
    // we are NOT deep-watching the entire object (bad)
    // but merely the length, which is enough to decide
    // we need to reset this controller;
    $scope.$watch('watchlists.length', function () {
      reset();
    });
  });
