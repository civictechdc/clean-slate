'use strict';
/*
eligibilityFlow contains questions text and links to the next question or eligibility state

eligibilityFlow FORMAT EXAMPLE
questions are numbered by their position in the array, currently from 0-15 for a total of 16 questions
{   // Question # 
    question: "this text will be displayed as the question",
    yes: {
        text: "This text will be displayed on the 'yes' button",
        next: # or eligibility (if clicked, this answer leads to this question # or eligibility)
    },
    no: {
        text: "This text will be displayed on the 'no' button",
        next: # or eligibility (if clicked, this answer leads to this question # or eligibility)
    }
}
*/
var eligibilityFlow = [
    {   // Question 0
        question: "Do you have a case pending?",
        yes: {
            text: "Yes",
            next: "ineligible at this time"
        },
        no: {
            text: "No",
            next: 1
        }
    },
    {   // Question 1
        question: "Are you sealing a conviction or a non-conviction?",
        yes: {
            text: "Conviction",
            next: 2
        },
        no: {
            text: "Non-conviction",
            next: 5
        }
    },
    {   // Question 2
        question: "Is this an eligible misdemeanor/felony or an ineligible misdemeanor/felony?",
        yes: {
            text: "Eligible misdemeanor or felony",
            next: 3
        }, 
        no: {
            text: "Ineligible misdemeanor or felony",
            next: "ineligible"
        }
    },
    {   // Question 3
        question: "Have you subsequently been convicted of another crime in any jurisdiction?",
        yes: {
            text: "Yes",
            next: "ineligible"
        },
        no: {
            text: "No",
            next: 4
        }
    },
    {   // Question 4
        question: "Has it been 8 years since you were off papers?",
        yes: {
            text: "Yes",
            next: "eligible"
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
    {   // Question 5
        question: "Is your non-conviction the result of a Deferred Sentencing Agreement?",
        yes: {
            text: "Yes",
            next: 7
        },
        no: {
            text: "No",
            next: 6
        }
    },
    {   // Question 6
        question: "Do you also have an ineligible conviction on your record?",
        yes: {
            text: "Yes",
            next: 13
        },
        no: {
            text: "No",
            next: 8
        }
    },
    {   // Question 7
        question: "Do you also have an ineligible conviction on your record?",
        yes: {
            text: "Yes",
            next: "ineligible"
        },
        no: {
            text: "No",
            next: 8
        }
    },
    {   // Question 8
        question: "Is the non-conviction for an eligible misdemeanor or an ineligible misdemeanor/felony?",
        yes: {
            text: "Eligible misdemeanor/felony",
            next: 12 
        },
        no: {
            text: "Ineligible misdemeanor/felony",
            next: 9
        }
    },
    {   // Question 9
        question: "Was the case terminated before charging by the prosectution (no papered)?",
        yes: {
            text: "Yes",
            next: 11
        },
        no: {
            text: "No",
            next: 10
        }
    },
    {   // Question 10
        question: "Has it been 4 years since you were \"off papers\" for the felony non-conviction?",
        yes: {
            text: "Yes",
            next: "eligible"
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
    {   // Question 11
        question: "Has it been 3 years since you were \"off papers\" for the felony non-conviction?",
        yes: {
            text: "Yes",
            next: "eligible"
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 12
        question: "Has it been two years since you were \"off papers\" for the misdemeanor non-conviction?",
        yes: {
            text: "Yes",
            next: "eligible"
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 13
        question: "Is the ineligible conviction for a felony or misdemeanor?",
        yes: {
            text: "Felony",
            next: 14 
        },
        no: {
            text: "Misdemeanor",
            next: 15
        }
    },
    {   // Question 14
        question: "Has it been 10 years since you were \"off papers\" for the misdemeanor conviction?",
        yes: {
            text: "Yes",
            next: 8
        },
        no: {
            text: "No",
            next: "ineligible at this time" 
        }
    },
    {   // Question 15
        question: "Has it been 5 years since you were \"off papers\" for the misdemeanor conviction?",
        yes: {
            text: "Yes",
            next: 8 
        },
        no: {
            text: "No",
            next: "ineligible at this time"
        }
    },
];


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
    self.userInput = [];
    // userInput holds the user's answers to previous questions to be returned when eligibility is known
    console.log('ran');
    
    self.params = $routeParams;
    self.questionNumber = Number(self.params.questionNumber);
    if(self.questionNumber > eligibilityFlow.length) {
        // if a step outside of the list is entered in the url, default to 0
        $location.path('/eligibility-check/q/0');
        self.currentStep = 0;
    } else if (isNaN(self.questionNumber)) {
        if(self.params.questionNumber === 'eligible' || self.params.questionNumber === 'ineligible') {
            $location.path('/eligibility-check/q/' + self.params.questionNumber);
            self.currentStep = self.params.questionNumber;
        } else {
            // if no step is specified, default to 0
            $location.path('/eligibility-check/q/0');
            self.currentStep = 0;
        }
    } else {
        // set currentStep to questionNumber parameter in url 
        self.currentStep = self.questionNumber;    
    }

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
    };

    self.currentQuestion = function() {
        // send back an empty string if currentQuestion is called and eligibility is known
        if (self.eligibilityKnown()){
            return "";
        }
        if (self.currentStep < eligibilityFlow.length){
            return eligibilityFlow[self.currentStep].question;
        }
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    };
    self.progressBar = function() {
        var progressPercent = '';
        if(isNaN(self.currentStep) && (self.currentStep === 'eligible' || self.currentStep === 'ineligible')){
            progressPercent = 100;
        } else {
            progressPercent = (self.currentStep/eligibilityFlow.length) * 100;
        }
        console.log(progressPercent);
        return progressPercent;
    };
    self.yesText = function() {
        // send back an empty string if yesText is called and eligibility is known
        if (self.eligibilityKnown()){
            return "";
        }
        if (self.currentStep < eligibilityFlow.length){
            return eligibilityFlow[self.currentStep].yes.text;
        }
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    };
    self.noText = function() {
        // send back an empty string if noText is called and eligibility is known
        if (self.eligibilityKnown()){
            return "";
        }
        if (self.currentStep < eligibilityFlow.length){
            return eligibilityFlow[self.currentStep].no.text;            
        }
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    };
    self.yesHref = function() {
        if (self.eligibilityKnown()){
            return "";
        }
        if (eligibilityFlow[self.currentStep].yes.next === "ineligible at this time"){
            return "ineligible";
        }
        if (eligibilityFlow[self.currentStep].yes.next === "eligible"){
            return "eligible";
        }
        if (self.currentStep < eligibilityFlow.length){
            return eligibilityFlow[self.currentStep].yes.next;
        };
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    };
    self.noHref = function() {
        if (self.eligibilityKnown()){
            return "";
        }
        if (eligibilityFlow[self.currentStep].no.next === "ineligible at this time"){
            return "ineligible";
        }
        if (eligibilityFlow[self.currentStep].no.next === "eligible"){
            return "eligible";
        }
        if (self.currentStep < eligibilityFlow.length){
            return eligibilityFlow[self.currentStep].no.next;
        }
        // else if there is no question cooresponding to currentStep
        throw new Error("There is no question number " + self.currentStep);
    };
    self.submitYes = function() { 
        // record this question and answer in record and add to userInput
        console.log(self.userInput);
        var record = {};
        record.question = self.currentQuestion();
        record.answer = self.yesText();
        self.userInput.push(record);
    };

    self.submitNo = function() {
        // record this question and answer in record and add to userInput
        console.log(self.userInput);
        var record = {};
        record.question = self.currentQuestion();
        record.answer = self.noText();
        self.userInput.push(record);
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
