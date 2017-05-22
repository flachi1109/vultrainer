// angular.module('vultrainer.dashboard', [])
// 	.factory('dashboardService', function($http){
// 		var service = {};
// 		service.getNodeinfo = function(nodeId){
// 			var arch = '';
// 			$http.get("/" + nodeId + "/dashboard/nodeinfo")
// 				.then(function (response) {
//                     arch = response.data.arch;
//               	});
//             return arch;
// 		};
// 	});

angular.module('vultrainer.dashboard', [])
    .service('dashboardService', function ($http) {

        this.getNodeinfo = function (nodeId) {
            var arch = '';
			$http.get("/" + nodeId + "/dashboard/nodeinfo")
				.then(function (response) {
                    arch = response.data.arch;
              	});
            return arch;
			};
    });;angular.module('vultrainer.platformNode', [])
    .service('nodeService', function () {
        this.nodeId = '';

        this.setNodeId = function (nodeId) {
            this.nodeId = nodeId;
        };

        this.getNodeId = function () {
            return this.nodeId;
        };
    });
;angular.module('vultrainer', [
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

