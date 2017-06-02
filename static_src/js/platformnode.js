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
