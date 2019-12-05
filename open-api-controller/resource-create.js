const chalk = require('chalk');
const mongoose = require('mongoose');
var schema = require('./schema-provider');

/**
 * 
 * @param {*} name resource name
 * @param {*} path Swagger path section for GET operation
 */
function Create(name, path) {
    this.name = name;
    this.path = path;

    // determine data type from params
    // here's an assumption that for POST operations there exist only one parameter and it's in body
    let typeName = schema.extractTypeName(path.parameters[0].schema.$ref);
    this.model = schema.orm(schema.collectionName(name), schema.schemas[typeName]);
    console.debug(`CREATE type name ${typeName}`);
    /*
let typeName = schema.extractTypeName(path.responses["200"].schema.items.$ref);
console.debug(`type name ${typeName}`);
console.debug(chalk.cyan(`${schema.collectionName(typeName)}`));
this.model = mongoose.model(schema.collectionName(typeName), schema.schemas[typeName]);
console.debug(`data type: ${typeName}`);*/
}

// index resources
Create.prototype.exec = async function (req, res) {
    console.debug(chalk.yellow(`creating resource ${this.name}`));
    let item = new this.model(req.body);
    item = await item.save();

    res.status(201).json(item);
}

module.exports = Create;