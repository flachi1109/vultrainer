//The module serve dashboard html 
angular.module('dashboard', ['platformNode'])
	// Obtain the current platform node basic info 
    .controller('nodeInfoController', ['$rootScope', '$scope', 'nodeService', 
        function($rootScope, $scope, nodeService){  
            function success(data){
                $scope.nodeInfo = data;              
            };
            function error(err){
                $scope.errorType = 'Retrieve Data Error : ';
                $scope.errorDetail = err;
                $scope.alertShown = true;
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

angular.module('vulhub', [])
    // The service to operate vulhub 
    .factory('vulhubService', ['$http', '$q', function($http, $q){
        var service = {};

        // Get all vulhub files tree
        service.getVulhubTree = function(nodeId){
            var deffered = $q.defer();

            $http.get("/" + nodeId + "/vulhubMode/tree")
                .then(function(response){
                    deffered.resolve(response.data);
                }, function(response){
                    deffered.reject(response.data);
                });
            return deffered.promise;
        };

        // Update the vulhub files tree
        service.updateVulhubTree = function(nodeId){
            var deffered = $q.defer();

            $http.get("/" + nodeId + "/vulhubMode/update")
                .then(function(response){
                    deffered.resolve(response.data);
                }, function(response){
                    deffered.reject(response.data);
                });
            return deffered.promise;
        };

        // create new vulhub case
        service.createVulhubCase = function(nodeId, case_path, vuln_num, description, fileName){
            var deffered = $q.defer();
            var postData = {case_path:case_path, vuln_num: vuln_num, desc: description, rep_file: fileName};
            $http.post("/" + nodeId + "/vulhubMode/setup", postData)
                .then(function(response){
                    deffered.resolve(response);
                }, function(response){
                    deffered.reject(response);
                });
            return deffered.promise;
        };

        return service;
    }]);
//The module serve vulnContainer html 
angular.module('vulnContainer', ['ngTable', 'ui.bootstrap', 'treeControl', 'vulhub', 'angularFileUpload'])
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
		};

        //Download steps doc files
        service.downloadRepStepsFiles = function(nodeId, containerId, fileName){
            var deffered = $q.defer();
            var postData = {file_name: fileName};
            $http.post("/" + nodeId + "/vulnContainer/" + containerId + "/download", postData, {responseType:'arraybuffer'})
                .then(function(response){
                    deffered.resolve(response);
                }, function(response){
                    deffered.reject(response);
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
    .controller('chooseAddMode', ['$scope', '$rootScope','$uibModalInstance', '$uibModal', 
        function($scope, $rootScope, $uibModalInstance,$uibModal) {
          $scope.modalAlert = false;
          $scope.confirm = function() {
            if (typeof($scope.addMode) == "undefined"){
                $scope.modalAlert = true; 
            }
            else{
                if ($scope.addMode == 1){
                    $scope.vulhubModal = function() {
                        $uibModal.open({
                            templateUrl : $rootScope.nodeId+'/vulhubMode',
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

    .controller('vulhubMode', ['$scope', '$rootScope' ,'vulhubService', '$uibModalInstance', '$uibModal', 
        function($scope, $rootScope, vulhubService, $uibModalInstance, $uibModal){
        $scope.vulhubTreeOptions = {
            nodeChildren: "children",
            dirSelectable: false
        }

        function success(data){
            $scope.vulhubData = data      
        };
        function error(err){
            $scope.modalAlert = true; 
        }; 

        $scope.selectedNode = '';
        $scope.showSelected = function(node){
            $scope.selectedNode = node;
        };
        vulhubService.getVulhubTree($rootScope.nodeId).then(success, error);
        
        $scope.updateStatus = 0;
        function update_success(data){
            console.log(data['status']);
            if (data['status'] == 'ok'){
                $scope.updateStatus = 0;
                vulhubService.getVulhubTree($rootScope.nodeId).then(success, error);
            }
        }

        $scope.update = function(){
            $scope.updateStatus = 1;
            vulhubService.updateVulhubTree($rootScope.nodeId).then(update_success, error);
        }

        $scope.next = function() {
            $scope.createVulhubModal = function() {
                $uibModal.open({
                    templateUrl : $rootScope.nodeId+'/vulhubMode/create',
                    controller : 'createVulhubController',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        cur_case: $scope.selectedNode
                    }
                })
            }
            $uibModalInstance.close($scope.createVulhubModal());             
          };

        $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
          }
    }])

    // Fill out the vulnerability information
    .controller('createVulhubController', ['$scope', '$rootScope' ,'vulhubService', '$uibModalInstance', '$uibModal', 'FileUploader', 'cur_case',
        function($scope, $rootScope, vulhubService, $uibModalInstance, $uibModal, FileUploader, cur_case){
            $scope.cur_case = cur_case;
            $scope.vuln_number = "";
            $scope.description = "";
            $scope.fileUploader = new FileUploader({
                url: '1/vulhubMode/upload',
                alias: 'rep_steps',
                queueLimit: 1
            });

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            }
            $scope.confirm = function() {
                // console.log($scope.fileUploader.queue[0].file.name);
                // console.log(cur_case);
                function success(response){
                    console.log(response.data);
                    if(response.data['status'] == 'ok'){
                        fileUploader.uploadAll()
                    }
                }
                function error(response){

                }
                vulhubService.createVulhubCase($rootScope.nodeId, cur_case.full_path, $scope.vuln_number, $scope.description, $scope.fileUploader.queue[0].file.name)
                    .then(success, error);
            }

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
            	for(var i=0; i<$scope.containerCheckeds.length; i++){
            		vulnContainerService.operateContainer($rootScope.nodeId, $scope.containerCheckeds[i], action).then(action_success, action_error);
            	}

            	$scope.containerCheckeds = [];
            }

            $scope.downloadAction = function(containerId, fileName){
                function action_success(response){
                    var file = new Blob([response.data], {type: response.headers('Content-Type')})
                    var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);
                };
                function action_error(err){
                    $scope.errorType = 'Download Failed : ';
                    $scope.errorDetail = err;
                    $scope.alertShown = true;
                }; 

                vulnContainerService.downloadRepStepsFiles($rootScope.nodeId, containerId, fileName).then(action_success, action_error);
            }
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
        })
        .state('vulnContainer', {
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

