
myApp.directive('sampleDirective',
        function () {
            return {
                restrict: 'AE', // attribute or element
                //scope: {}, // isolate scope
                template: '<h1>{{ customer.name }}</h1>'
            }
        }
);
