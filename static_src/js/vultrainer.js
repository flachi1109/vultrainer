//The main module which can specify the default path and controll all function.
angular.module('vultrainer', [
    'ui.router',
    'vultrainer.platformNode',
    'vultrainer.dashboard',
    'vultrainer.vulnContainer'
    ])
    // specify the default path
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/dashboard/');
            
        $stateProvider.state('dashboard', {
            url: '/dashboard/',
            templateUrl: '/dashboard/',
            controller: 'vultrainerController'
        });
        $stateProvider.state('vulnContainer', {
            url: '/vulnContainer/',
            templateUrl: '/vulnContainer/',
            controller: 'vultrainerController'
        });
    }])
    //Obtain the current platform node ID
    .controller('vultrainerController', ['$rootScope', '$scope', 'nodeService', function($rootScope, $scope, nodeService){
            nodeService.setNodeId(1);
            $rootScope.nodeId = nodeService.getNodeId();
        }])

    // Obtain the current platform node basic info 
    .controller('nodeInfoController', ['$rootScope', '$scope', 'dashboardService', 
        function($rootScope, $scope, dashboardService){  
            function success(data){
                $scope.nodeInfo = data;              
            };
            function error(err){
                console.log("Can't get data!");
            };
            dashboardService.getNodeInfo($rootScope.nodeId).then(success, error);
        }])
    // retrieve vulnerale container information
    .controller('vulnContainerController', ['$rootScope', '$scope', 'vulnContainerService', 
        function($rootScope, $scope, vulnContainerService){  
            function success(data){
                $scope.vulnContainers = data;              
            };
            function error(err){
                console.log("Can't get data!");
            };
            vulnContainerService.getVulnContainerList($rootScope.nodeId).then(success, error);
            
            $scope.containerChecked = [];
            $scope.selectContainer = function(vulnContainer){
                console.log(vulnContainer.checked);
                if (vulnContainer.checked == false)
                    vulnContainer.checked = true;
                else
                    vulnContainer.checked = false;
            }

        }]);

