//The module serve platform node related operations
angular.module('vultrainer.platformNode', [])
	// The service to obtain platform node ID
    .service('nodeService', function () {
        this.nodeId = '';

        this.setNodeId = function (nodeId) {
            this.nodeId = nodeId;
        };

        this.getNodeId = function () {
            return this.nodeId;
        };
    });
