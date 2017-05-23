//The main module which can specify the default path and controll all function.
angular.module('vultrainer', [
    'ui.router',
    'vultrainer.platformNode',
    'vultrainer.dashboard'
    ])
    // specify the default path
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/dashboard/');
            
        $stateProvider.state('dashboard', {
            url: '/dashboard/',
            templateUrl: '/dashboard/',
            controller: 'vultrainerController'
        });
    }])
    //Obtain the current platform node ID
    .controller('vultrainerController', ['$rootScope', '$scope', 'nodeService', function($rootScope, $scope, nodeService){
            $scope.test1 = 'def';
            nodeService.setNodeId(1);
            $rootScope.nodeId = nodeService.getNodeId();
        }])

    // Obtain the current platform node basic info 
    .controller('nodeInfoController', ['$rootScope', '$scope', 'dashboardService', 
        function($rootScope, $scope, dashboardService){  
            function success(data){
                $scope.nodeInfo = data;
                console.log($scope.nodeInfo);               
            };
            function error(err){
                console.log("Can't get data!");
            };
            dashboardService.getNodeInfo($rootScope.nodeId).then(success, error);
        }]);
