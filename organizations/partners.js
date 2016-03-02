Parse.initialize("BbjrthNLZ49b6pQ1hvYCUc9RATqUleRw4on1uPwV", "WjBd5QzC1t5Q6JnEuI4uJU38tkL7h5PzUzZnhmxO");

//Define an angular module for our app
var sampleApp = angular.module('sampleApp', [])
.run(['$rootScope', function($scope) {
  $scope.currentUser = Parse.User.current();
 
  $scope.signUp = function(form) {
    var user = new Parse.User();
    user.set("email", form.email);
    user.set("username", form.username);
    user.set("password", form.password);
 
    user.signUp(null, {
      success: function(user) {
        $scope.currentUser = user;
        $scope.$apply(); // Notify AngularJS to sync currentUser
      },
      error: function(user, error) {
        alert("Unable to sign up:  " + error.code + " " + error.message);
      }
    });    
  };
 
  $scope.logIn = function(form) {
      
  Parse.User.logIn(form.username, form.password, {
        success: function(user) {
           $scope.currentUser = user;
           $scope.$apply(); // Notify AngularJS to sync currentUser
         },
        error: function(user, error) {
           alert("Unable to sign up:  " + error.code + " " + error.message);
         }
    });
   
  };
 
  $scope.logOut = function(form) {
    Parse.User.logOut();
    $scope.currentUser = null;
  };
}]);

//Define Routing for app
//Uri /AddNewOrder -> template AddOrder.html and Controller AddOrderController
//Uri /ShowOrders -> template ShowOrders.html and Controller AddOrderController
sampleApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/Home', {
            templateUrl: 'views/loginView.html',
            controller: 'AddOrderController'
        }).
        when('/Reports', {
            templateUrl: 'views/viewReports.html',
            controller: 'ShowOrdersController'
        }).
        when('/Motions', {
            templateUrl: 'views/helpMotions.html',
            controller: 'ShowOrdersController'
        }).
        when('/Feedback', {
            templateUrl: 'views/sendFeedback.html',
            controller: 'questionController'
        }).
        when('/Clients', {
            templateUrl: 'views/NewClient.html',
            controller: 'RecordsController'
        }).
        when('/Clients/:clientId', {
            templateUrl: 'views/viewClientDetails.html',
            controller: 'showQuestionController'
        }).
   
        when('/Motions', {
            templateUrl: 'views/helpMotions.html',
            controller: 'showQuestionController'
        }).
        otherwise({
            redirectTo: '/Home'
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


sampleApp.controller('RecordsController', function ($scope, $routeParams, sharedService) {
    
            //Initialize form with basic data for person
        $scope.person = {};
        $scope.person.first = "John";
        $scope.person.middle = "Jay";
        $scope.person.last = "Smith";
        $scope.person.phone = "2022225555";
        $scope.person.email = "test@email.com";
        $scope.person.address1 = "1600 pennsylvania ave NW";
        $scope.person.address2 = "Washington, DC, 20002";
        $scope.person.dobMonth = "10";
        $scope.person.dobDay = "05";
        $scope.person.dobYear = "2015";
        $scope.person.pendingCase = false;    
        $scope.records = [];
     
        $scope.addRecordItem = function () {
        
        /*          
            if(!($scope.newRecord.itemDate.month == null) && !($scope.newRecord.itemDate.day == null) && !($scope.newRecord.itemDate.year == null))
                $scope.newRecord.itemDate.full = $scope.newRecord.itemDate.month + "/" + $scope.newRecord.itemDate.day + "/" + $scope.newRecord.itemDate.year;
          */
            if(!($scope.newRecord.dispDate.month == null) && !($scope.newRecord.dispDate.day == null) && !($scope.newRecord.dispDate.year == null))
            {   
            $scope.newRecord.dispDate.full = $scope.newRecord.dispDate.month + "/" + $scope.newRecord.dispDate.day + "/" + $scope.newRecord.dispDate.year;
            $scope.newRecord.fullDate = new Date($scope.newRecord.dispDate.full);
            }
            
            $scope.newRecord.eligibility = $scope.checkEligibility();
            $scope.records.push($scope.newRecord);
            console.log($scope.newRecord);
            $scope.newRecord = {};
        }
     
        $scope.checkEligibility = function () {
            
            if($scope.person.pendingCase === true)
                return 'Ineligible - Pending Case';
            
            if($scope.records.length <= 1)
                return 'Eligible (0)';
            
            
            console.log('validating elgibility');
            return 'Eligible';
        }
     
        $scope.dispositionOptions = [
            { title: 'No Papered', description: 'After an arrest, but before presentment (for felonies) or arraignment on the information (for misdemeanors), the United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia has declined to proceed with the prosecution. This means that your a1Test has been NO PAPERED. However, the Government can proceed with prosecution at a later date.","There is no PUBLIC record of your arrest in the Court\'s database, although there is an arrest record. An arrest record is a record in the law enforcement database that contains your name, date of your arrest, the charges for which you were arrested, and other personal information such as your date of birth. An arrest record is not a conviction. However, if you apply for a job the arrest information may be disclosed to potential employees.'},
            { title: 'Acquitted', description: 'The legal and formal certification of the innocence of a person who has been charged with a crime. A finding of not guilty.' },
            { title: 'Dismissed for Want of Prosecution', description: 'An order or judgment disposing of the charge(s) without a trial. An involuntary dismissal accomplished on the Court\'s own motion for lack of prosecution or on motion from the defendant for Jack of prosecution or fai lure to introduce evidence of facts on which relief may be granted. The dismissal is without prejudice which allows the prosecutor the right to rebring the charge(s) at a later date.' },
            { title: 'Dismissal', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia filed a Dismissal for the incident that lead to the arrest. This means that after an indictment was returned, the court entered a dismissal at the request of the Government prior to commencement of the trial, or the court entered a dismissal after making its own finding that there was an unnecessary delay by the Government in presenting the case. Dismissals are without prejudice unless  otherwise stated.' },
            { title: 'Found Guilty - Plea', description: 'Formal admission in court as to guilt of having committed the criminal act(s) charged, which a defendant may make if he or she does so intell igently and voluntarily. It is binding and is equivalent to a conviction after trial. A guilty plea has the same effect as a verdict of guilty and authorizes imposition of the punishment prescribed by law.' },
            { title: 'Non Jury Trial Guilty', description: 'Trial was held before a Judge, without a jury. At the conclusion of trial, the Judge found that the Government has met its burden of proof and it is beyond a reasonable doubt that the defendant is guilty of the offense(s) charged.' },
            { title: 'Non Jury Trial Not Guilty', description: 'Trial was held before a Judge, without a jury. At the conclusion of trial, the Judge found that the Government has failed to meet its burden of proof to show that the defendant was guilty of the offense(s) charged beyond a reasonable doubt.' },
            { title: 'Jury Trial Not Guilty', description: 'Formal pronouncement by a jury that they find the defendant not guilty of the offense(s) charged.' },
            { title: 'Jury Trial Guilty', description: 'Formal pronouncement by a jury that they find the defendant guilty of the offense(s) charged. ' },
            { title: 'Post and Forfeit', description: 'The Metropolitan Police Department (MPD) or the Office of the Attorney General for the District of Columbia has resolved the incident that leads to your arrest using the Post and Forfeit procedure.,The Post and Forfeit procedure allows a person charged with certain offenses to post and forfeit an amount as collateral (which otherwise would serve as security upon release to ensure the arrestee\'s appearance at trial) and thereby obtain a full and final resolution of the offense. The agreement to resolve the offense using the Post and Forfeit procedure is final.' },
            { title: 'Nolle Diversion', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia has agreed that it will no longer pursue prosecution in this case because the defendant has complied with the conditions of his/her release as ordered by the Court' },
            { title: 'Nolle Prosequi', description: 'The United States Attorney\'s Office of the District of Columbia or the Office of the Attorney General for the District of Columbia filed a Nolle Prosequi for the incident that lead to the arrest. This means that the Government has decided that it will no longer pursue prosecution in this case. ' }
        ];
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

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


