//The module serve vulnContainer html 
angular.module('vulnContainer', ['ngTable', 'ui.bootstrap', 'treeControl'])
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
    //popup add_vuln_container.html page
    .controller('addVulnContainerModal', ['$scope', '$rootScope', '$uibModal', function($scope, $rootScope, $uibModal) {
        $scope.openModal = function() {
                var uibModalInstance = $uibModal.open({
                    templateUrl : $rootScope.nodeId+'/vulnContainer/add',
                    controller : 'chooseAddMode',
                    backdrop: 'static',
                })
            }
    }])
    //Controller for choose adding mode
    .controller('chooseAddMode', ['$scope', '$rootScope','$uibModalInstance', '$uibModal', function($scope, $rootScope, $uibModalInstance,$uibModal) {
          $scope.modalAlert = false;
          $scope.confirm = function() {
            if (typeof($scope.addMode) == "undefined"){
                $scope.modalAlert = true; 
            }
            else{
                if ($scope.addMode == 1){
                    $scope.vulhubModal = function() {
                        $uibModal.open({
                            templateUrl : $rootScope.nodeId+'/vulnContainer/vulhubMode',
                            controller : 'vulhubMode',
                            backdrop: 'static',
                        })
                    }
                    $uibModalInstance.close($scope.vulhubModal());
                }              
            }
            
          };
          $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
          }
    }])
    .controller('vulhubMode', ['$scope', function($scope){
        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: false,
        }
        $scope.vulhubData = [
            {id:1, name:'first',children:[]},
            {id:2, name:'second',children:[
                {id:10, name:'children of second', children:[]}
            ]}
        ]
    }])
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
            	// console.log(action);
            	for(var i=0; i<$scope.containerCheckeds.length; i++){
            		vulnContainerService.operateContainer($rootScope.nodeId, $scope.containerCheckeds[i], action).then(action_success, action_error);
            	}

            	$scope.containerCheckeds = [];
            }
        }
   	]);