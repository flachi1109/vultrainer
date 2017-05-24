//The module serve dashboard html 
angular.module('vultrainer.dashboard', [])
	// The service to obtain platform node basic info 
	.factory('dashboardService', ['$http', '$q', function($http, $q){
		var service = {};
		service.getNodeInfo = function(nodeId){
			var deffered = $q.defer();

			$http.get("/" + nodeId + "/dashboard/nodeinfo")
				.then(function(response){
					deffered.resolve(response.data);
				}, function(response){
					deffered.reject(response.data);
				});
			return deffered.promise;

		};
		return service;
	}]);

//The module serve platform node related operations
angular.module('vultrainer.platformNode', [])
	// The service to obtain platform node ID
    .service('nodeService', function () {
        this.nodeId = '';

        this.setNodeId = function (nodeId) {
            this.nodeId = nodeId;
        };

        this.getNodeId = function () {
            return this.nodeId;
        };
    });

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
        $stateProvider.state('vulnContainer', {
            url: '/vulnContainer/',
            templateUrl: '/vulnContainer/',
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
            };
            function error(err){
                console.log("Can't get data!");
            };
            dashboardService.getNodeInfo($rootScope.nodeId).then(success, error);
        }]);
