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
                redirectTo: function(routeParams, path, search) {
                    return '/eligibility-check/q/0'
                }
            })
            .when('/eligibility-check/q/:questionNumber', {
                templateUrl: 'views/eligibility-checker.html',
                controller: 'EligibilityWizardController as eligibilityCtrl'
            })
            // FAQs
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'questionsController'
            })
            // Legal Aid Page
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
myApp.controller('EligibilityWizardController', function($http, $routeParams, $location) {
    var self = this; // self is equivalent to $scope
    self.eligibilityKnown = false;

    // once eligibility is known, this will hold the final eligibility state
    self.eligibility = null;

    self.userInput = [];
    // userInput holds the user's answers to previous questions to be returned when eligibility is known

    // boolean indicating whether final state is known
    var executeController = function(data) {
        self.eligibilityFlow = data;
        self.eligibilityFlowLength = Object.keys(self.eligibilityFlow.questions).length;
        
        self.params = $routeParams;
        self.questionNumber = Number(self.params.questionNumber);
        if(self.questionNumber > self.eligibilityFlowLength) {
            // if a step outside of the list is entered in the url, default to 0
            $location.path('/eligibility-check/q/0');
            self.currentQuestion = self.eligibilityFlow.questions['question' + 0];
        } else if (isNaN(self.questionNumber)) {
            if(self.params.questionNumber === 'eligible' || self.params.questionNumber === 'ineligible') {
                $location.path('/eligibility-check/q/' + self.params.questionNumber);
                self.currentQuestion = 'question' + self.params.questionNumber;
            } else {
                // if no step is specified, default to 0
                $location.path('/eligibility-check/q/0');
                self.currentQuestion = self.eligibilityFlow.questions['question' + 0];
            }
        } else {
            // set currentQuestion to questionNumber parameter in url 
            self.currentQuestion = self.eligibilityFlow.questions['question' + self.questionNumber];
        }

        // Grab the ineligible misdemeanors from a static JSON file stored at the root of the project
        $http.get('ineligible-misdemeanors.json')
        .success(function(data, status, headers, config) {
            // if the app successfully gets misdemeanor data from the JSON file, assign it to self.ineligibleMisdemeanors for use in the wizard
            self.ineligibleMisdemeanors = data;
        });

        self.submitAnswer = function(answerIndex) {
            // record this question and answer in record and add to userInput
            var record = {};
            record.question = self.currentQuestion.questionText;
            record.answer = self.currentQuestion.answers[answerIndex].answerText;
            self.userInput.push(record);

            var next = self.currentQuestion.answers[answerIndex].next;

            // check if this answer leads to an eligibility state
            if (self.eligibilityFlow.endStates.indexOf(next) != -1) {
                self.eligibility = next;
                self.eligibilityKnown = true;
                return;
            }

            // update currentQuestion if eligibitliy still not known and next question is valid
            if (next in self.eligibilityFlow) {
                self.currentQuestion = self.eligibilityFlow[next];
                return;
            }

            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question \'" + next + "\' in self.eligibilityFlow.");
        };

        self.eligibilityKnown = function() {
            // if current step is a number we are still on questions
            // if current step is a string (ie "eligible" or "ineligible"), the eligiblity state is known
            return (typeof self.currentQuestion === "string") ; 
        };
        console.log(self.currentQuestion.answers)
        /*self.currentQuestion = function() {
            // send back an empty string if currentQuestion is called and eligibility is known
            if (self.eligibilityKnown()){
                return "";
            }
            if (self.currentQuestion < self.eligibilityFlow.length){
                return self.eligibilityFlow[self.currentQuestion].question;
            }
            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question number " + self.currentQuestion);
        };*/
        self.progressBar = function() {
            var progressPercent = '';
            if(isNaN(self.currentQuestion) && (self.currentQuestion === 'eligible' || self.currentQuestion === 'ineligible')){
                progressPercent = 100;
            } else {
                progressPercent = Math.round((self.questionNumber/self.eligibilityFlowLength) * 100);
            }
            return progressPercent;
        };
        /*self.yesText = function() {
            // send back an empty string if yesText is called and eligibility is known
            if (self.eligibilityKnown()){
                return "";
            }
            if (self.currentQuestion < self.eligibilityFlow.length){
                return self.eligibilityFlow[self.currentQuestion].yes.text;
            }
            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question number " + self.currentQuestion);
        };
        self.noText = function() {
            // send back an empty string if noText is called and eligibility is known
            if (self.eligibilityKnown()){
                return "";
            }
            if (self.currentQuestion < self.eligibilityFlow.length){
                return self.eligibilityFlow[self.currentQuestion].no.text;            
            }
            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question number " + self.currentQuestion);
        };
        self.yesHref = function() {
            if (self.eligibilityKnown()){
                return "";
            }
            if (self.eligibilityFlow[self.currentQuestion].yes.next === "ineligible at this time"){
                return "ineligible";
            }
            if (self.eligibilityFlow[self.currentQuestion].yes.next === "eligible"){
                return "eligible";
            }
            if (self.currentQuestion < self.eligibilityFlow.length){
                return self.eligibilityFlow[self.currentQuestion].yes.next;
            };
            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question number " + self.currentQuestion);
        };
        self.noHref = function() {
            if (self.eligibilityKnown()){
                return "";
            }
            if (self.eligibilityFlow[self.currentQuestion].no.next === "ineligible at this time"){
                return "ineligible";
            }
            if (self.eligibilityFlow[self.currentQuestion].no.next === "eligible"){
                return "eligible";
            }
            if (self.currentQuestion < self.eligibilityFlow.length){
                return self.eligibilityFlow[self.currentQuestion].no.next;
            }
            // else if there is no question cooresponding to currentQuestion
            throw new Error("There is no question number " + self.currentQuestion);
        };*/
        self.submitYes = function() { 
            // record this question and answer in record and add to userInput
            var record = {};
            record.question = self.currentQuestion();
            record.answer = self.yesText();
            self.userInput.push(record);
        };

        self.submitNo = function() {
            // record this question and answer in record and add to userInput
            var record = {};
            record.question = self.currentQuestion();
            record.answer = self.noText();
            self.userInput.push(record);
        };
    }


    $http.get('eligibility-flow.json')
    .success(function(data, status, headers, config) {
        // Get the elegibility-flow json blob
        executeController(data);
    });

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
