'use strict';

// App definition + dependencies
var myApp = angular.module('myApp', [
    // necessary for matching the URL to an available resource
    'ngRoute',
    // Material Design by Google
    'ngMaterial'
    ]);

// Route definition 
myApp.config(['$routeProvider',
    function ($routeProvider) {
        
        $routeProvider
            // Homepage includes Expunge D.C. overview and link to the wizard
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeController'
            })
            // The wizard!
            .when('/eligibility-check', {
                templateUrl: 'views/eligibility-checker.html',
                controller: 'EligibilityWizardController as eligibilityCtrl'
            })
            // FAQs
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'questionsController'
            })
            // FAQs
            .when('/legal-aid', {
                templateUrl: 'views/legal-aid.html',
                controller: 'legalAidController'
            })
            // If the user attempts to visit a route that doesn't match any of the patterns above, re-direct them to the homepage
            .otherwise({
                redirectTo: '/'
            });
}]);


// Homepage controller
myApp.controller('homeController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// FAQs controller
myApp.controller('questionsController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// Legal Aid controller
myApp.controller('legalAidController',
    ['$scope', 
        function ($scope) {
            

        }
]);

// refactored version of Eligibility Checker Controller --AKA The Wizard
myApp.controller('EligibilityWizardController', function($http) {

    var self = this; // self is equivalent to $scope
    // a number indicating the current step the user is on -- until they reach an eligibility state.
    // Once eligibility state is reached, currentStep will hold a string indicating the eligiblity.
    self.currentStep = 0;
    // history holds the user's answers to previous questions to be returned when eligibility is known
    self.history = [];

    // Grab the eligibility flow from a static JSON file stored at the root of the project
    // This is synchronous because it is needed to display the initial question to the user
    // if it is made asynchronous, strange values flash on the screen before initial values are shown
    var req = new XMLHttpRequest();
    req.open("GET", "eligibility-flow.json", false);
    req.send(null);
    var ELIGIBILITY_FLOW = JSON.parse(req.responseText);

    // Grab the ineligible misdemeanors from a static JSON file stored at the root of the project
    $http.get('ineligible-misdemeanors.json')
    .success(function(data, status, headers, config) {
        // if the app successfully gets misdemeanor data from the JSON file, assign it to self.ineligibleMisdemeanors for use in the wizard
        self.ineligibleMisdemeanors = data;
    });


    self.eligibilityKnown = function() {
        // if current step is a number we are still on questions
        // if current step is a string (ie "eligible" or "ineligible"), the eligiblity state is known
        return (typeof self.currentStep === "string") ; 
    }

    self.currentQuestion = function() {
        // send back an empty string if currentQuestion is called and eligibility is known
        if (self.eligibilityKnown())
            return "";
        if (self.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[self.currentStep].question;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    }

    self.yesText = function() {
        // send back an empty string if yesText is called and eligibility is known
        if (self.eligibilityKnown())
            return "";
        if (self.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[self.currentStep].yes.text;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    }

    self.noText = function() {
        // send back an empty string if noText is called and eligibility is known
        if (self.eligibilityKnown())
            return "";
        if (self.currentStep < ELIGIBILITY_FLOW.length);
            return ELIGIBILITY_FLOW[self.currentStep].no.text;
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    }

    self.submitYes = function() { 
        // record this question and answer in record and add to history
        var record = {};
        record.question = self.currentQuestion();
        record.answer = self.yesText();
        self.history.push(record);

        // update currentStep by following the yes path
        self.currentStep = ELIGIBILITY_FLOW[self.currentStep].yes.next;
    };

    self.submitNo = function() { 
        // record this question and answer in record and add to history
        var record = {};
        record.question = self.currentQuestion();
        record.answer = self.noText();
        self.history.push(record);

        // update currentStep by following the no path
        self.currentStep = ELIGIBILITY_FLOW[self.currentStep].no.next;
    };
});

// Partial 
myApp.controller('titlebarController',
    ['$scope', '$mdSidenav',
        function ($scope, $mdSidenav) {
            $scope.openLeftMenu = function() {
                $mdSidenav('left').toggle();
            };
            
            $scope.close = function() {
              $mdSidenav('left').toggle();
            }
           
        }
]);
