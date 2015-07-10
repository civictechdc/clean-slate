angular.module("app", ["ui.router"]).config(function($stateProvider, $urlRouterProvider) {
    "use strict";

    // Default location...
    $urlRouterProvider.otherwise("/");

    // Named states...
    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "views/home.html"
        })
        .state("acquire", {
            url: "/acquire",
            templateUrl: "views/acquire.html"
        })
        .state("acquire-in-person", {
            url: "/acquire-in-person",
            templateUrl: "views/acquire-in-person.html"
        })
        .state("legal", {
            url: "/legal",
            templateUrl: "views/legal.html"
        })
        .state("eligibility", {
            url: "/eligibility/:questionId",
            templateUrl: "views/eligibility.html",
            controller: "EligibiltyController"
        })
        .state("faqs", {
            url: "/faqs",
            templateUrl: "views/faqs.html"
        })
        .state("definitions", {
            url: "/definitions",
            templateUrl: "views/definitions.html"
        });
}).controller("EligibiltyController", function EligibilityController(
    $scope,
    $http,
    $window,
    $state,
    $stateParams,
    EligibilityService)
{
    "use strict";

    $scope.EligibilityService = EligibilityService;

    $scope.eligibilityKnown = false;
    $scope.eligibilityFlow = {
        questions: {},
        endStates: {}
    };
    $scope.eligibilityFlowLength = 0;
    $scope.currentState = {};
    $scope.ineligibleMisdemeanors = [];
    $scope.stateName = "";

    $scope.goBackOneQuestion = function goBackOneQuestion() {
        console.log("Go back one question called...");

        if ($scope.stateName === $scope.eligibilityFlow.start) {
            $window.history.back();

            return;
        }

        if ($scope.eligibilityKnown) {
            $scope.eligibilityKnown = false;
        }

        EligibilityService.userInput.pop();

        var previousQuestion = EligibilityService.answeredQuestions.pop();

        $state.go("eligibility", {questionId: previousQuestion});
        $scope.currentState = $scope.eligibilityFlow.questions[previousQuestion];
    };

    $scope.restart = function restart() {
        console.log("Restart called...");

        EligibilityService.userInput = [];
        EligibilityService.answeredQuestions = [];

        $state.go("eligibility", {questionId: $scope.eligibilityFlow.start});
        $scope.currentState = $scope.eligibilityFlow.questions[$scope.eligibilityFlow.start];
    };

    $scope.submitAnswer = function submitAnswer(answerIndex) {
        console.log("Submit answer called...");

        // if this question was already answered, cleanup userInput before adding this answer to history
        if (EligibilityService.answeredQuestions.indexOf($scope.stateName) > -1) {
            console.log("Could not find indexOf " + $scope.stateName + " so Cleaning up question/answer history.")
            var startDuplication = answeredQuestions.indexOf($scope.stateName);
            EligibilityService.userInput.splice(startDuplication, EligibilityService.userInput.length - startDuplication);
            EligibilityService.answeredQuestions.splice(startDuplication, EligibilityService.answeredQuestions.length - startDuplication);
        }

        // record this question and answer in record and add to userInput
        var record = {};
        record.question = $scope.currentState.questionText;
        record.answer = $scope.currentState.answers[answerIndex].answerText;
        EligibilityService.userInput.push(record);
        EligibilityService.answeredQuestions.push($scope.stateName);

        var next = $scope.currentState.answers[answerIndex].next;

        // check if this answer leads to an eligibility state
        if (next in $scope.eligibilityFlow.endStates) {
            $scope.eligibilityKnown = true;
            $scope.stateName = next;
            $scope.currentState = $scope.eligibilityFlow.endStates[next];
            $scope.userInput = userInput;
            return;
        }

        // update currentQuestion if eligibility still not known and next question is valid
        if (next in $scope.eligibilityFlow.questions) {
            $scope.stateName = next;
            $scope.currentState = $scope.eligibilityFlow.questions[next];
            return;
        }

        // else if there is no question corresponding to currentQuestion
        throw new Error("There is no question or endState \'" + next + "\' in $scope.eligibilityFlow.");
    };

    $scope.progressBar = function progressBar() {
        console.log("Progress bar called...");

        var progressPercent = '';
        //If the current question is an EndState, then set the progess bar to 100
        if($scope.stateName in $scope.eligibilityFlow.endStates){
            progressPercent = 100;
        } else {
            // Otherwise, divide the number of questions answered by the tree height at this state
            // multiply by 100, and round
            var answered = EligibilityService.answeredQuestions.length;
            progressPercent = Math.round((answered/(answered + $scope.currentState.treeHeight - 1)) * 100);
        }
        return progressPercent;
    };

    $scope.progressBarStyle = function progressBarStyle() {
        return {
            "min-width": "2em",
            width: $scope.progressBar() + "%"
        };
    };

    function init() {
        $http.get("data/combined-flow.json").success(function(flow) {
            $scope.eligibilityFlow = flow;

            EligibilityService.findTreeHeight($scope.eligibilityFlow, $scope.eligibilityFlow.start);

            $scope.eligibilityFlowLength = _.size(_.keys($scope.eligibilityFlow.questions));

            $scope.stateName = $stateParams.questionId;

            if (_.has($scope.eligibilityFlow.endStates, $scope.stateName)) {
                $scope.eligibilityKnown = true;
                $scope.currentState = $scope.eligibilityFlow.endStates[$scope.stateName];
                $scope.userInput = EligibilityService.userInput;
            }
            else if (_.has($scope.eligibilityFlow.questions, $scope.stateName)) {
                $scope.currentState = $scope.eligibilityFlow.questions[$scope.stateName];
            }
            else {
                $state.go("eligibility", {questionId: $scope.eligibilityFlow.start});
                $scope.currentState = $scope.eligibilityFlow.questions[$scope.eligibilityFlow.start];
            }

            $http.get("data/ineligible-misdemeanors.json").success(function(data) {
                $scope.ineligibleMisdemeanors = data;
            });
        });
    }

    init();
}).service("EligibilityService", function EligibilityService() {
    "use strict";

    this.userInput = [];
    this.answeredQuestions = [];

    this.findTreeHeight = function findTreeHeight(flow, state) {
        var self = this;

        if (_.has(flow.endStates, state)) {
            flow.endStates[state].treeHeight = 1;

            return;
        }

        if (!_.has(flow.questions, state)) {
            console.warn(state, "Could not be found in flow.endStates or in flow.questions. PLEASE FIX THIS SOON!");

            flow.endStates[state] = {
                eligiblityText: state + " IS NOT A VALID STATE NAME",
                icon: "glyphicon glyphicon-alert",
                helperText: "Something went wrong! We will work on this error and try to fix it soon.",
                treeHeight: 1
            };

            return;
        }

        if (_.has(flow.questions[state], "treeHeight")) {
            return;
        }

        var question = flow.questions[state];

        _.forEach(question.answers, function(answer) {
            self.findTreeHeight(flow, answer.next);
        });

        question.treeHeight = 1 + question.answers.reduce(function(maxHeight, answer) {
            if (_.has(flow.endStates, answer.next)) {
                return (maxHeight < 1) ? 1 : maxHeight;
            }

            var nextHeight = flow.questions[answer.next].treeHeight;

            if (nextHeight > maxHeight) {
                return nextHeight;
            }

            return maxHeight;
        }, 0);
    };
});