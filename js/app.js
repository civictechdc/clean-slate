(function (window, angular, undefined) {
  "use strict";

  function UiRouterConfig($stateProvider, $urlRouterProvider) {
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
        controller: "EligibilityController"
      })
      .state("faqs", {
        url: "/faqs",
        templateUrl: "views/faqs.html"
      })
      .state("definitions", {
        url: "/definitions",
        templateUrl: "views/definitions.html",
        controller: "DefinitionsController"
      });

    // Default location...
    $urlRouterProvider.otherwise("/");
  }

  angular.module("app", ["ngAnimate", "ngSanitize", "ui.router"])
    .config(["$stateProvider", "$urlRouterProvider", UiRouterConfig]);

})(window, window.angular);