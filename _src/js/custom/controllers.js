myApp.controller('homeController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {

            /*
            $scope.modal = {
              "title": "Modal title goes here",
              "content": "Modal content goes here!"
            };

            // Sample Directive data
            $scope.customer = {
                name: 'Tom'
            };
            */
            
        }
]);

myApp.controller('eligibilityController',
    ['$scope', '$http', '$routeParams', '$location',
        function ($scope, $http, $routeParams, $location) {
        
        $scope.step_in_process = 0;

        $http.get('/ineligible-misdemeanors.json')
        .success(function(data, status, headers, config) {
            $scope.ineligibleMisdemeanors  = data;
        });
        
        $scope.getToStep = function (step) {
          console.log('Going to step: ', step);
          $scope.step_in_process = step;
        }
         
        $scope.ineligible = function(reason) {
          $location.path('eligibility-check/ineligible/reason');
        };
        
        $scope.eligible = function() {
          $location.path('eligibility-check/eligible');
        }
           
        }
]);

myApp.controller('eligibilityIneligibleController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {
        
        
           
        }
]);

myApp.controller('eligibilityEligibleController',
    ['$scope', '$routeParams',
        function ($scope, $routeParams) {
        
        
           
        }
]);