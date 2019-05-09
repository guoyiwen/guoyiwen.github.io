'use strict';

angular.module('stockDogApp')
  .directive('stkStockRow', function ($timeout, QuoteService) {
    return {
      // [1]用作元素特性，并需要stkStockTable控制器
      restrict: 'A',
      require: '^stkStockTable',
      scope: {
        stock: '=',
        isLast: '='
      },
      // [2]所需的控制器将在末尾变得可用 
      link: function ($scope, $element, $attrs, stockTableCtrl) {
        // [3]为股票行创建提示 
        $element.tooltip({
          placement: 'left',
          title: $scope.stock.company.name
        });

        // [4]将该行添加到TableCtrl中 
        stockTableCtrl.addRow($scope);

        //  [5]使用QuoteService注册该股票 
        QuoteService.register($scope.stock);

        // [6]在$destroy上使用QuoteService取消公司的注册 
        $scope.$on('$destroy', function () {
          stockTableCtrl.removeRow($scope);
          QuoteService.deregister($scope.stock);
        });

        //  [7]如果这是“股票行”的最后一行，立即抓取报价
        if ($scope.isLast) {
          $timeout(QuoteService.fetch);
        }

        //  [8]监视份额的变化并重新计算字段 
        $scope.$watch('stock.shares', function () {
          $scope.stock.marketValue = $scope.stock.shares *
            $scope.stock.lastPrice;
          $scope.stock.dayChange = $scope.stock.shares *
            parseFloat($scope.stock.change);
          $scope.stock.save();
        });
      }
    };
  });
