'use strict';

var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

angular.module('stockDogApp')
  .directive('contenteditable', function ($sce) {
    return {
      restrict: 'A',
      require: 'ngModel', //  [ 1 ]获得 NgModelController 
      link: function($scope, $element, $attrs, ngModelCtrl) {
        if(!ngModelCtrl) { return; } // do nothing if no ng-model

        // 指定如何更新UI 
        ngModelCtrl.$render = function() {
          $element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
        };

        // 读取HTML值，然后将数据写入模型或者重置视图 
        var read = function () {
          var value = $element.html();
          if ($attrs.type === 'number' && !NUMBER_REGEXP.test(value)) {
            ngModelCtrl.$render();
          } else {
            ngModelCtrl.$setViewValue(value);
          }
        };

        //  [4]添加基于解析器的自定义输入类型《只支持'number •) 
        // This will be applied to the $modelValue
        if ($attrs.type === 'number') {
          ngModelCtrl.$parsers.push(function (value) {
            return parseFloat(value);
          });
        }

        // [5]监听改变事件，启用绑定 
        $element.on('blur keyup change', function() {
          $scope.$apply(read);
        });
      }
    };
  });
