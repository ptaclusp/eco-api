const index = require('./resource-index');
const create = require('./resource-create');
const get = require('./resource-get');
const chalk = require('chalk');
const schema = require('./schema-provider');


// verb mapping for non-parametrized requests
const mapping = {
    get: 'index',
    post: 'create'
}

function ApiController() {

    this.routeExpression = new RegExp('\\W+(\\w+)');
    this.routeParamExpression = new RegExp('\\W+(\\w+)\\W+\{(\\w+)\\}')

    this.methods = {
        index: index,
        create: create,
        get: get
    }
}

/**
 * Import a swagger file and setup Express routes
 * @param swagger a Swagger file
 * @param router  an Express router instance
 */
ApiController.prototype.import = function (swagger, router) {
    // prepare schema
    schema.import(swagger.definitions);
    // iterate over paths
    Object.keys(swagger.paths).forEach((pathName) => {
        //console.debug(`путь: ${pathName}`);

        // check if this a parametrized route
        let matches = this.routeParamExpression.exec(pathName);

        if (matches) {
            //console.debug(`${matches[1]} has parameter ${matches[2]}`);
            // iterate over methods
            Object.keys(swagger.paths[pathName]).forEach((method) => {
                if (this.methods[method]) {
                    let name = matches[1];
                    let param = matches[2];
                    let route = `/${name}/:${param}`;
                    let handler = new this.methods[method](name, swagger.paths[pathName][method]);
                    // add route to this handler with instance binding
                    router.route(route)[method](handler.exec.bind(handler));
                     
                } else {
                    console.debug(chalk.red(`operation ${method} for parametrized routes is not implemented`));
                }
            });
        } else { // this is a non-parametrized resource route
            matches = this.routeExpression.exec(pathName);
            let name = '';

            if (matches) {
                name = matches[1];
            } else {
                // this is a bogus resource name
                return;
            }

            Object.keys(swagger.paths[pathName]).forEach((method) => {

                // determine processing function name
                let handlerName = mapping[method];

                if (handlerName && this.methods[handlerName]) { // if mapping and handler for this method exists

                    console.debug(chalk.green(`adding handler for operation ${pathName} - ${handlerName}`));
                    // create handler instance
                    let handler = new this.methods[handlerName](name, swagger.paths[pathName][method]);
                    // add route to this handler with instance binding
                    router.route(pathName)[method](handler.exec.bind(handler));
                } else {
                    console.debug(chalk.red(`operation ${method} for non-parametrized routes is not implemented`));
                }
            });
        }

    });

}

module.exports = new ApiController();