//make the endpoint info table have the same height 
;angular.module('vultrainer.platformNode', [])
    .provider('nodeIdProvider', function () {
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
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'nodeIdProvider',
        function($stateProvider, $urlRouterProvider, nodeIdProvider){
            
            $nodeIdProvider.setNodeId(1);
            
            $urlRouterProvider.otherwise('/dashboard/');
            
            $stateProvider.state('dashboard', {
                    url: '/dashboard/',
                    templateUrl: '/dashboard/'
            });
}]);

angular.module('vultrainer')
    .controller('vultrainerCtrl', function($scope, nodeIdProvider){
            $scope.nodeId  = nodeIdProvider.getNodeId();
    });