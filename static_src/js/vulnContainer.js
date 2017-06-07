//The module serve vulnContainer html 
angular.module('vulnContainer', ['ngTable'])
	// The service to obtain vuln container information
	.factory('vulnContainerService', ['$http', '$q', function($http, $q){
		var service = {};

		// Get all vulnContainer information
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

		// Operate the specified vulnContainer
		service.operateContainer = function(nodeId, containerId, action){
			var deffered = $q.defer();

			$http.get("/" + nodeId + "/vulnContainer/" + containerId + "/" + action)
				.then(function(response){
					deffered.resolve(response.data);
				}, function(response){
					deffered.reject(response.data);
				});
			return deffered.promise;
		}
		return service;
	}])

	// Format exposed port 
	.filter('retInnerPort', function(){
		return function(input){
			return input.split('/')[0];
		}
	})
	.filter('retProto', function(){
		return function(input){
			return input.split('/')[1];
		}
	})

	//vulnerale container information
    .controller('vulnContainerController', ['$rootScope', '$scope', '$timeout','vulnContainerService', 'NgTableParams',
        function($rootScope, $scope, $timeout, vulnContainerService, NgTableParams){  
           	var self = this;
           	//retrieve vulnerale container information
            function success(data){
                self.containerTableParams = new NgTableParams({},
                	{ 
                		dataset:data
                	}
                );	         
            };
            function error(err){
            	$scope.errorType = 'Retrieve Data Error : ';
            	// $scope.errorDetail = 'Can not get data!';
            	$scope.errorDetail = err;
                $scope.alertShown = true;
            }; 
            vulnContainerService.getVulnContainerList($rootScope.nodeId).then(success, error);

            //Process the container who has been selected
            $scope.containerCheckeds = [];
            $scope.selectContainer = function(vulnContainer){
                if (vulnContainer.checked == true) {
                    $scope.containerCheckeds.push(vulnContainer.id);
                }
                else{
                	for (var i=0; i<$scope.containerCheckeds.length; i++){
	                    if($scope.containerCheckeds[i] == vulnContainer.id){
	                      	$scope.containerCheckeds.splice(i, 1);
	                    }
                    }                  
                }

                console.log($scope.containerCheckeds);
            };

            $scope.containerAction = function(action){
            	function action_success(containerId){
                	vulnContainerService.getVulnContainerList($rootScope.nodeId).then(success, error);      
            	};
            	function action_error(err){
            		$scope.errorType = 'Operated Failed : ';
            		$scope.errorDetail = err;
                	$scope.alertShown = true;
            	}; 
            	console.log(action);
            	for(var i=0; i<$scope.containerCheckeds.length; i++){
            		vulnContainerService.operateContainer($rootScope.nodeId, $scope.containerCheckeds[i], action).then(action_success, action_error);
            	}

            	$scope.containerCheckeds = [];
            }
        }
   	]);