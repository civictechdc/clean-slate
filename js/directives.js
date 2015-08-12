(function(window, angular, undefined) {
  "use strict";

  function definitionComponent() {
    return {
      restrict: "A",
      scope: {
        definition: "="
      },
      templateUrl: "views/definition_component.html",
      controller: function ($scope) {
        var definition = _.trunc($scope.definition.definition, 50);
        var visible = false;

        $scope.isVisible = function isVisible() {
          return visible;
        };

        $scope.setVisible = function setVisible(value) {
          visible = value;
          definition = (visible) ? $scope.definition.definition : _.trunc($scope.definition.definition, 50);
        };

        $scope.getDefinition = function getDefinition() {
          return definition;
        };
      }
    }
  }

  angular.module("app")
    .directive("definitionComponent", [definitionComponent])
  
})(window, window.angular);