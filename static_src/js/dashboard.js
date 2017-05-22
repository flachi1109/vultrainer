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
    });