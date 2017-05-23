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
