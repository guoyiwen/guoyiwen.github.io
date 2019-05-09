'use strict';

angular.module('stockDogApp')
  .directive('stkSignFade', function ($animate) {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        var oldVal = null;
        // [1]使用$observe在值改变时发出通知 
        $attrs.$observe('stkSignFade', function (newVal) {
          if (oldVal && oldVal == newVal) { return; }

          var oldPrice = parseFloat(oldVal);
          var newPrice = parseFloat(newVal);
          oldVal = newVal;
          // [2]添加适当的方向类，然后移除它 
          if (oldPrice && newPrice) {
            var direction = newPrice - oldPrice >= 0 ? 'up' : 'down';
            $animate.addClass($element, 'change-' + direction, function() {
              $animate.removeClass($element, 'change-' + direction);
            });
          }
        });
      }
    };
  });
