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

    // determine data type
    let typeName = schema.extractTypeName(path.responses["200"].schema.items.$ref);
    console.debug(`type name ${typeName}`);
    console.debug(chalk.cyan(`${schema.collectionName(typeName)}`));
    this.model = mongoose.model(schema.collectionName(typeName), schema.schemas[typeName]);
    console.debug(`data type: ${typeName}`);
}

// index resources
Index.prototype.exec = async function(req, res) {
    console.debug(chalk.yellow(`indexing resource ${this.name}`));
    let items = await this.model.find();

    res.status(200).json(items);
}

module.exports = Index;