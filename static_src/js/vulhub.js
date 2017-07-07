angular.module('vulhub', ['ngWebSocket'])
    // The service to operate vulhub 
    .factory('vulhubService', ['$http', '$q', '$websocket', function($http, $q, $websocket){
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
        // service.createVulhubCase = function(nodeId, case_path, vuln_num, description, fileName){
        //     var deffered = $q.defer();
        //     var postData = {case_path:case_path, vuln_num: vuln_num, desc: description, rep_file: fileName};
        //     $http.post("/" + nodeId + "/vulhubMode/setup", postData)
        //         .then(function(response){
        //             deffered.resolve(response);
        //         }, function(response){
        //             deffered.reject(response);
        //         });
        //     return deffered.promise;
        // };

        service.createVulhubCase = function(server, nodeId, case_path, vuln_num, description, fileUploader){
            var dataStream = $websocket("ws://"+ server + "/" + nodeId +"/vulhubMode/setup");
            var collection = [];
            var build_success = false;
            var up_success = false;
            dataStream.onMessage(function(message){
                collection.push(JSON.parse(message.data));
                console.log(JSON.parse(message.data).build_success);
                console.log(JSON.parse(message.data).up_success);

                if (JSON.parse(message.data).build_success == 'ok'){
                    build_success = true;
                };
                if (JSON.parse(message.data).up_success == 'ok'){
                    up_success = true;
                };
                
                if (build_success && up_success){
                    console.log('Yes');
                    fileUploader.uploadAll();
                    var postData = {vuln_num: vuln_num, desc: description, rep_file: fileUploader.queue[0].file.name}
                    $http.post("/" + nodeId + "/vulhubMode/save", postData)

                }
                // collection.push(message);
            });

            var methods = {
                collection: collection,
                setup: function(){
                    dataStream.send(JSON.stringify({case_path:case_path, vuln_num: vuln_num, desc: description, rep_file: fileUploader.queue[0].file.name}));
                }
            };
            return methods;
        };

        return service;
    }]);