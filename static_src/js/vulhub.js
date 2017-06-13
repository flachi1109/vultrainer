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
        return service;
    }]);