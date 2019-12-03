const chalk = require('chalk');
const mongoose = require('mongoose');
var   schema = require('./schema-provider');

/**
 * 
 * @param {*} name resource name
 * @param {*} path Swagger path section for GET operation
 */
function Index(name, path, definitions) {
    this.name = name;
    this.path = path;

    // determine data type
    let dataType = path.responses["200"].schema.items.$ref;
    console.debug(`data type: ${dataType}`);
}

// index resources
Index.prototype.exec = async function(req, res) {
    console.debug(chalk.yellow(`indexing resource ${this.name}`));

}

module.exports = Index;