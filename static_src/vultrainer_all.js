//The module serve dashboard html 
angular.module('dashboard', ['platformNode'])
	// Obtain the current platform node basic info 
    .controller('nodeInfoController', ['$rootScope', '$scope', 'nodeService', 
        function($rootScope, $scope, nodeService){  
            function success(data){
                $scope.nodeInfo = data;              
            };
            function error(err){
                console.log("Can't get data!");
            };
            nodeService.getNodeInfo($rootScope.nodeId).then(success, error);
    }]);

//The module serve platform node related operations
angular.module('platformNode', [])

	// The service to obtain platform node ID
    .service('nodeService', ['$http', '$q', function ($http, $q){
        this.nodeId = '';

        this.setNodeId = function (nodeId) {
            this.nodeId = nodeId;
        };

        this.getNodeId = function () {
            return this.nodeId;
        };

        this.getNodeInfo = function(nodeId){
            var deffered = $q.defer();

            $http.get("/" + nodeId + "/dashboard/nodeinfo")
                .then(function(response){
                    deffered.resolve(response.data);
                }, function(response){
                    deffered.reject(response.data);
                });
            return deffered.promise;
        };
    }]);

//The module serve vulnContainer html 
angular.module('vulnContainer', ['ngTable'])
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
                    console.log($scope.containerCheckeds);
                }
                else{
                    for (var i=0; i<$scope.containerCheckeds.length; i++){
                        if($scope.containerCheckeds[i] == vulnContainer.id){
                            $scope.containerCheckeds.splice(i, 1);
                        }
                    }
                    console.log($scope.containerCheckeds);                   
                }
            };

            $scope.selectAllItems = function(allChecked){
            	console.log(allChecked);
            	if (allChecked == true){
            		$scope.vulnContainer
            	}
            };
        }
   	]);
//The main module which can specify the default path and controll all function.
angular.module('vultrainer', [
    'ui.router',
    'platformNode',
    'dashboard',
    'vulnContainer'
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
        }]);

