//make the endpoint info table have the same height 
;angular.module('vultrainer.platformNode', [])
    .service('nodeService', function () {
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
    'vultrainer.platformNode'
    ])
    .config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        // get the connection of the specified platformNode

        $urlRouterProvider.otherwise('/dashboard/');
            
        $stateProvider.state('dashboard', {
            url: '/dashboard/',
            templateUrl: '/dashboard/',
            controller: 'vultrainerController'
        });
    }])
    .controller('vultrainerController', ['$scope', 'nodeService', function($scope, nodeService){
            nodeService.setNodeId(1);
            $scope.nodeId = nodeService.getNodeId();
    }]);

