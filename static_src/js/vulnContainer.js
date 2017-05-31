//The module serve vulnContainer html 
angular.module('vultrainer.vulnContainer', [])
	// The service to obtain vuln container information
	.factory('vulnContainerService', ['$http', '$q', function($http, $q){
		var service = {};
		service.getVulnContainerList = function(nodeId){
			var deffered = $q.defer();

			$http.get("/" + nodeId + "/vulnContainer/all")
				.then(function(response){
					deffered.resolve(response.data);
				}, function(response){
					deffered.reject(response.data);
				});
			return deffered.promise;

		};
		return service;
	}])
	.filter('retInnerPort', function(){
		return function(input){
			return input.split('/')[0];
		}
	})
	.filter('retProto', function(){
		return function(input){
			return input.split('/')[1];
		}
	});