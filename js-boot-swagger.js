var query = require('./js-path');

function JsBootSwagger() {

}

JsBootSwagger.prototype.logger = function(logger) {
    this.logger = logger;
    logger.info(`JS boot swagger ready`);
}

/**
 * import a swagger file and set up all required express routes
 */
JsBootSwagger.prototype.import = function(swagger) {

    this.logger.debug('JS boot swagger IMPORT');
    var paths = swagger.paths;

    // perform only if paths is a valid array
    if(paths && Object.keys(paths)) {
        // iterate each path
        Object.keys(paths).forEach((path) => {
            this.logger.debug(`route: ${path}`);

            // iterate operations
            Object.keys(paths[path]).forEach((operation) => {
                this.logger.debug(`${operation}`);

                switch(operation) {
                    case 'get' : {
                        break;
                    }
                    default:
                        this.logger.debug(`operation ${operation} not supported`)
                }
            })
        })

    }
}

JsBootSwagger.prototype.get = function() {
    
}

module.exports = new JsBootSwagger();