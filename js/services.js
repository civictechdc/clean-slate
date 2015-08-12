(function (window, angular, undefined) {
  "use strict";

  function eligibilityService() {
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

      _.forEach(question.answers, function (answer) {
        self.findTreeHeight(flow, answer.next);
      });

      question.treeHeight = 1 + question.answers.reduce(function (maxHeight, answer) {
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
  }

  function definitionsService($http) {
    this.list = function list() {
      return $http.get("data/definitions.json");
    };
  }

  angular.module("app")
    .service("eligibilityService", [eligibilityService])
    .service("definitionsService", ["$http", definitionsService]);

})(window, window.angular);