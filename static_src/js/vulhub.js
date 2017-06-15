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
        service.createVulhubCase = function(nodeId, case_path, vuln_num, description, fileUploader){
            var deffered = $q.defer();
            var postData = {case_path:case_path, vuln_num: vuln_num, desc: description};
            $http.get("/" + nodeId + "/vulhubMode/setup")
                .then(function(response){
                    if(response.data["status"]=="ok"){
                        fileUploader.uploadAll()
                    }   
                    deffered.resolve(response.data);
                }, function(response){
                    deffered.reject(response.data);
                });
            return deffered.promise;
        };

        return service;
    }]);