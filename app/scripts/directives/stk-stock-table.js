'use strict';

angular.module('stockDogApp')
  .directive('stkStockTable', function () {
    return {
      templateUrl: 'views/templates/stock-table.html',
      restrict: 'E',
      // [1]隔离作用域 
      scope: {
        watchlist: '='
      },
      // [2]创建一个控制器，它将用作该指令的API 
      controller: function ($scope) {
        var rows = [];

        $scope.$watch('showPercent', function (showPercent) {
          if (showPercent) {
            _.each(rows, function (row) {
              row.showPercent = showPercent;
            });
          }
        });

        this.addRow = function (row) {
          rows.push(row);
        };

        this.removeRow = function (row) {
          _.remove(rows, row);
        };
      },
      // [3]标准的链接函数实现 
      link: function ($scope) {
        $scope.showPercent = false;
        $scope.removeStock = function (stock) {
          $scope.watchlist.removeStock(stock);
        };
      }
    };
  });
