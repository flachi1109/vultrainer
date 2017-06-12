//The main module which can specify the default path and controll all function.
angular.module('vultrainer', [
    'ui.router',
    'platformNode',
    'dashboard',
    'vulnContainer'
    ])
    // specify the default path
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/dashboard/');
            
        $stateProvider.state('dashboard', {
            url: '/dashboard/',
            templateUrl: '/dashboard/',
            controller: 'vultrainerController'
        })
        .state('vulnContainer', {
            url: '/vulnContainer/',
            templateUrl: '/vulnContainer/',
            controller: 'vultrainerController'
        });

    }])
    //Obtain the current platform node ID
    .controller('vultrainerController', ['$rootScope', '$scope', 'nodeService', function($rootScope, $scope, nodeService){
            nodeService.setNodeId(1);
            $rootScope.nodeId = nodeService.getNodeId();
        }]);

