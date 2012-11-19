angular.module("ui.bootstrap.alert", []).directive('alert', function() {
  return {
    restrict: 'E', 
    templateUrl: 'template/alert/alert.html', 
    transclude: true,
    scope: {},
    link: function(scope, element, attrs) {

      scope.dismissed = false;

      scope.alertType = attrs.type ? 'alert-' + attrs.type : 'alert-info';

      scope.dismiss = function() {
        scope.dismissed = true;
        element.remove();
      };
    }
  };
});