// angular.module('vultrainer.dashboard', [])
// 	.factory('dashboardService', function($http){
// 		var service = {};
// 		service.getNodeInfo = function(nodeId){
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
        this.arch = '';
        this.getNodeInfo = function (nodeId) {
        	   $http.get("/" + nodeId + "/dashboard/nodeinfo")
		.then(function (response) {
                         return  response.data.arch;
              	});  
        };
    });