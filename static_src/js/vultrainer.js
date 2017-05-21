angular.module('vultrainer', [
    'ui.router',
    'vultrainer.platformNode'
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