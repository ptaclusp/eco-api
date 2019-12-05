var mongoose = require('mongoose');
const chalk = require('chalk');

function SchemaProvider() {
    this.schemas = {};
}

var DataTypes = {
    "string": String,
    "integer": Number,
    "boolean": Boolean,
    "number": Number

}

SchemaProvider.prototype.import = function (definitions) {

    this.schemas['Any'] = String;   
    console.debug('processing schema');
    this.definitions = definitions;
    // iterate over definitions and import them
    Object.keys(definitions).forEach((name) => {
        this.importDefinition(name, definitions[name]);
    })
}

/**
 * Import a definition from schema to Mongoose schema and store it into internal schema dictionary
 * @param name definition name
 * @param definition definition body
 */
SchemaProvider.prototype.importDefinition = function (name, definition) {
    // processing only complex objects

    let content = {};

    if (definition.type == 'object') {
        Object.keys(definition.properties).forEach((propertyName) => {
            content[propertyName] = this.importProperty(propertyName, definition.properties[propertyName]);
        })
    } else {
        console.debug(chalk.red(`import of ${name} not implemented`));
    }

    console.debug(chalk.magenta(`${name}`))
    if(name=='ProductSpecificationCharacteristicValue') {
        console.dir(content);
    }
    this.schemas[name] = mongoose.Schema(content);
}

/**
 * Import a data type property
 * @param name property name
 * @param property property definition
 * @returns schema definition
 */
SchemaProvider.prototype.importProperty = function (name, property) {
    // if the property has a type - it is simple data type or array

    if (property.type == 'array') { // import an array
        return this.importArray(property);
    } else if (property.type) { // import plain type
        return this.importPlain(property);
    } else { // import a reference
        return this.importRef(property);
    }
}

/**
 * Import an array property
 */
SchemaProvider.prototype.importArray = function (property) {
    let typeName = this.extractTypeName(property.items.$ref);

    return [this.importRef(property.items)];
    //console.debug(chalk.red(`array import is not implemented`));
}

// import plain property definition
SchemaProvider.prototype.importPlain = function (property) {
    return {
        type: DataTypes[property.type]
    }
}

SchemaProvider.prototype.extractTypeName = function (ref) {
    return ref.replace('#/definitions/', '');
}

SchemaProvider.prototype.orm = function(name, schema) {
    let i = mongoose.modelNames().indexOf(name);

    if(i == -1) { // if model desn't exist
        return mongoose.model(name, schema);
    } else {
        return mongoose.model(name);
    }
}

// import reference
SchemaProvider.prototype.importRef = function (property) {

    let typeName = this.extractTypeName(property.$ref);
    let exists = this.schemas[typeName] ? true : false;

    if (!exists) {
        this.importDefinition(typeName, this.definitions[typeName]);
    } 

    return this.schemas[typeName];
}

SchemaProvider.prototype.collectionName = function (name) {
    return `${name}`;
}

module.exports = new SchemaProvider();