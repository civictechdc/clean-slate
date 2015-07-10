angular.module("app", ["ui.router"]).config(function($stateProvider, $urlRouterProvider) {
    // Default location...
    $urlRouterProvider.otherwise("/");

    // Named states...
    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "views/home.html"
        })
        .state("faqs", {
            url: "/faqs",
            templateUrl: "views/faqs.html"
        })
        .state("definitions", {
            url: "/definitions",
            templateUrl: "views/definitions.html"
        });
});