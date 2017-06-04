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
