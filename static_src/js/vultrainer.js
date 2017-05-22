angular.module('vultrainer', [
    'ui.router',
    'vultrainer.platformNode',
    'vultrainer.dashboard'
    ])
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        // get the connection of the specified platformNode

        $urlRouterProvider.otherwise('/dashboard/');
            
        $stateProvider.state('dashboard', {
            url: '/dashboard/',
            templateUrl: '/dashboard/',
            controller: 'vultrainerController'
        });
    }])
    .controller('vultrainerController', ['$rootScope', 'nodeService', function($rootScope, nodeService){
            nodeService.setNodeId(1);
            $rootScope.nodeId = nodeService.getNodeId();
        }])
    .controller('nodeInfoController', ['$rootScope', '$scope', 'dashboardService', 
        function($rootScope, $scope, dashboardService){
            console.log(dashboardService.getNodeInfo($rootScope.nodeId));
        }]);

