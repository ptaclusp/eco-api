const chalk = require('chalk');
const mongoose = require('mongoose');
var   schema = require('./schema-provider');


/**
 * 
 * @param {*} name resource name
 * @param {*} path Swagger path section for GET operation
 */
function Index(name, path) {
    this.name = name;
    this.path = path;

    // regex for processing query parameters according to the TMF API design guide
    this.queryParameterFilterRegex = new RegExp('(\\w+)(\\W+)');

    // determine data type
    let typeName = schema.extractTypeName(path.responses["200"].schema.items.$ref);
    console.debug(`type name ${typeName}`);
    console.debug(chalk.cyan(`${schema.collectionName(typeName)}`));
    this.model = schema.orm(schema.collectionName(name), schema.schemas[typeName]);
    console.debug(`data type: ${typeName}`);
}

// index resources
Index.prototype.exec = async function(req, res) {
    console.debug(chalk.yellow(`indexing resource ${this.name}`));

    console.dir(req.query);
    let params = Object.keys(req.query);
    let findOptions = {};

    if(params && params.length > 0) { // if query params exist
        params.forEach((param) => {
            let matches = this.queryParameterFilterRegex.exec(param);
            if(matches && matches.length == 3) { // if match succeeded
                let attribute = matches[1];
                let filter = matches[2];

                switch(filter) {
                    case '*' : { // LIKE
                        findOptions[attribute] = new RegExp(req.query[param], 'i');
                    }

                    break;
                }
            }
        });

    }

    console.dir(findOptions);
    let items = await this.model.find(findOptions);

    res.status(200).json(items);
}

module.exports = Index;