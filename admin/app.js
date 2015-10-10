Parse.initialize("BbjrthNLZ49b6pQ1hvYCUc9RATqUleRw4on1uPwV", "WjBd5QzC1t5Q6JnEuI4uJU38tkL7h5PzUzZnhmxO");

//Define an angular module for our app
var sampleApp = angular.module('sampleApp', []);

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
sampleApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/New', {
            templateUrl: 'templates/showQuestionForm.html',
            controller: 'AddOrderController'
        }).
        when('/List', {
            templateUrl: 'templates/QuestionsList.html',
            controller: 'ShowOrdersController'
        }).
        when('/Questions', {
            templateUrl: 'templates/parseQuestions.html',
            controller: 'questionController'
        }).
        when('/Questions/:questionId', {
            templateUrl: 'templates/showQuestionForm.html',
            controller: 'showQuestionController'
        }).
        otherwise({
            redirectTo: '/AddNewOrder'
        });
  }]);


sampleApp.controller('AddOrderController', function ($scope) {

    $scope.message = 'Add a New Question';



    $scope.saveQuestion = function () {

        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;       
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        var showM = $scope.currentQuestion.showMisdemeanors;

        console.log("set up variables");
        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        var answer = [];

        // get all answers
        for (var i = 0; i < $scope.currentQuestion.answers.length; i++) {

            var newAtext = $scope.currentQuestion.answers[i].answerText;
            var newAnext = $scope.currentQuestion.answers[i].next;
            var newAnswer = { "answerText": newAtext, "next": newAnext };

            // append new value to the array
            answer.push(newAnswer);
        }

        question.set("answers", answer);
        console.log("about to save");
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('New object created with objectId: ' + question.id);

            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

});


sampleApp.controller('ShowOrdersController', function ($scope, $routeParams) {

    $scope.message = 'This is Show orders screen';

});

sampleApp.factory('sharedService', function ($rootScope) {
    //http://onehungrymind.com/angularjs-communicating-between-controllers/

    var sharedService = {};

    sharedService.currentquestion = {};
    sharedService.message = '';

    sharedService.prepForUpdate = function (msg, question) {
        this.message = msg;
        this.currentquestion = question;
        this.updateCurrentQuestion();

        console.log("in prep for update:  " + msg);
    };
    sharedService.updateCurrentQuestion = function () {
        $rootScope.$broadcast('updateQuestion');
        console.log("after broadcast prep for update:  " + this.message);
    };

    return sharedService;
});

sampleApp.factory('Question', function ($q) {

    var Question = Parse.Object.extend("testquestions", {
        // Instance methods
    }, {
        // Class methods
        listQuestions: function ($scope) {
            var defer = $q.defer();

            var query = new Parse.Query(this);
            query.find({
                success: function (aQuestions) {
                    //alert("Successfully retrieved " + aQuestions.length + " questions.");
                    defer.resolve(aQuestions);
                    $scope.$apply();
                },
                error: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        }
    });


    // Question properties
    Question.prototype.__defineGetter__("objectId", function () {
        return this.get("objectId");
    });
    Question.prototype.__defineSetter__("objectId", function (aValue) {
        return this.set("objectId", aValue);
    });
    
    Question.prototype.__defineGetter__("questionID", function () {
        return this.get("questionID");
    });
    Question.prototype.__defineSetter__("questionID", function (aValue) {
        return this.set("questionID", aValue);
    });

    Question.prototype.__defineGetter__("questionText", function () {
        return this.get("questionText");
    });
    Question.prototype.__defineSetter__("questionText", function (aValue) {
        return this.set("questionText", aValue);
    });

    Question.prototype.__defineGetter__("helperText", function () {
        return this.get("helperText");
    });
    Question.prototype.__defineSetter__("helperText", function (aValue) {
        return this.set("helperText", aValue);
    });

    Question.prototype.__defineGetter__("showMisdemeanors", function () {
        return this.get("showMisdemeanors");
    });
    Question.prototype.__defineSetter__("showMisdemeanors", function (aValue) {
        return this.set("showMisdemeanors", aValue);
    });

    Question.prototype.__defineGetter__("answers", function () {
        return this.get("answers");
    });
    Question.prototype.__defineSetter__("answers", function (aValue) {
        return this.set("answers", aValue);
    });

    Question.prototype.__defineGetter__("Section", function () {
        return this.get("Section");
    });
    Question.prototype.__defineSetter__("Section", function (aValue) {
        return this.set("Section", aValue);
    });


    return Question;
});

//http://stackoverflow.com/questions/13882077/angularjs-passing-scope-between-routes
sampleApp.factory("currentQuestion", function (){
return {};
});

sampleApp.controller('questionController', function ($scope, $http, $location, sharedService, Question, currentQuestion) {

    Question.listQuestions($scope).then(function (aQuestions) {
        $scope.questions = aQuestions;
        console.log("number of questions:  " + $scope.questions.length)
    },
    function (aError) {
        // Something went wrong, handle the error
    });

    $scope.showQuestion = function (question) {   
        var path = '/Questions/' + question.questionID;
        $scope.currentQuestion = question;        
        sharedService.prepForUpdate("clicked", question);

        //http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
        $location.path(path);
    }
    function getQuestion(questionID)
    {
        for (q in questions)
        {
            if (questions[q].questionID == questionID) {
                return questions[q];
            }
        }
    }
   

});

sampleApp.controller('showQuestionController', function ($scope, $routeParams, sharedService) {
    
    $scope.message = 'Edit Questions';    
    $scope.currentQuestion = sharedService.currentquestion;    

    $scope.saveQuestion = function () {

        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        var showM = $scope.currentQuestion.showMisdemeanors.toString();
        console.log(showM);
        console.log("set up variables");

        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        question.set("answers", $scope.currentQuestion.answers);

        console.log("about to save");
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('New object created with objectId: ' + question.id);

            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

    $scope.updateQuestion = function () {

        var objectID = $scope.currentQuestion.id;

        console.log("objcet Id:" + objectID);
        console.log("beginning save funciton");
        var newQuestion = Parse.Object.extend("testquestions");
        var question = new newQuestion();

        console.log("pre-set up variables");
        var qID = $scope.currentQuestion.questionID;
        var qText = $scope.currentQuestion.questionText;
        var hText = $scope.currentQuestion.helperText;
        //var showM = ($scope.currentQuestion.showMisdemeanors);//.toString();
        var showM = $scope.currentQuestion.showMisdemeanors;
        console.log(showM);
        console.log("set up variables");

        question.set("objectId", objectID);
        question.set("questionID", qID);
        question.set("questionText", qText);
        question.set("helperText", hText);
        question.set("showMisdemeanors", showM);

        var answer = [];

        // get all answers
        for (var i = 0; i < $scope.currentQuestion.answers.length; i++) {

            var newAtext = $scope.currentQuestion.answers[i].answerText;
            var newAnext = $scope.currentQuestion.answers[i].next;
            var newAnswer = { "answerText": newAtext, "next": newAnext };

            // append new value to the array
            answer.push(newAnswer);
        }
        
        question.set("answers", answer);

        console.log("about to save");
        console.log(question);
        question.save(null, {
            success: function (question) {
                // Execute any logic that should take place after the object is saved.
                console.log("saved");
                alert('Question Updated: ' + question.id);


            },
            error: function (question, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("failed");
                alert('Failed to create new object, with error code: ' + error.message);
            }
        });



    }

    $scope.addAnswerToModel = function () {
        var newAtext = $scope.newAnswer.answerText;
        var newAnext = $scope.newAnswer.next;

        var newAnswer = { "answerText": newAtext, "next": newAnext };

        // append new value to the array
        $scope.currentQuestion.answers.push(newAnswer);

        //Clear items in new answer form
        $scope.newAnswer.answerText = '';
        $scope.newAnswer.next = '';
    }

    function loadQuestion()
    {

    }
  
});

