const chalk = require('chalk');
const mongoose = require('mongoose');
var   schema = require('./schema-provider');

const PATCH_OPERATIONS = {
    ADD: "add",
    SET: "replace"
}


/**
 * 
 * @param {*} name resource name
 * @param {*} path Swagger path section for PATCH operation
 */
function Patch(name, path) {
    this.name = name;
    this.path = path;

    console.log(`PATCH ${name}`);
    console.dir(path);

    // determine data type from params
    // here's an assumption that for POST operations there exist only one parameter and it's in body
    let typeName = schema.extractTypeName(path.responses["200"].schema.$ref);
    this.model = schema.orm(schema.collectionName(name), schema.schemas[typeName]);
    console.debug(`GET type name ${typeName}`);
}

// index resources
Patch.prototype.exec = async function(req, res) {
    // let's check content type
    let contentType = req.get('Content-Type');

    if (contentType == 'application/json-patch+json') {
        console.debug(`JSON patch operation`)
        // perform JSON patch
        let item = await this.jsonpatch(req, res);
        res.status(200).json(item);
    } else { // other mechanisms are not supported
        res.status(501).json({ message: "plain PATCH is not implemented yet" })
    }
}

Patch.prototype.jsonpatch = async function(req, res, orm) {
    console.debug('performing JSON patch operation');

    // load an object from DB for patching
    let item = await this.fetch(req);

    // iterate over operations
    req.body.forEach((operation) => {
        switch(operation.op.toLowerCase()) {
            case PATCH_OPERATIONS.ADD: {
                // perform ADD operation
                console.debug(`JSON patch ADD ${operation.path}`)
                this.add(item, operation.path, operation.value);
                break;
            }
            case PATCH_OPERATIONS.SET: {
                // perform ADD operation
                console.debug(`JSON patch SET ${operation.path}`)
                this.set(item, operation.path, operation.value);
                break;
            }
            default: 
                console.error(`patch operation ${operation.op} is not implemented`);
        }
    });

    // update the object in DB
    return await item.save();
}

Patch.prototype.set = function(item, path, value) {

    let container = this.iterate(item, path);
    container.owner[container.attribute] = value;
    /*
    if(attribute instanceof Array) {
        throw 'SET operation for arrays not supported';
    } else {
        attribute = value;
    }
    */

}

Patch.prototype.iterate = function(item, path) {

    let names = path.split('/');
    let current = item;
    let selector = '';
    let attribute = names.pop();

    names.forEach((name) => {

        // processing only non-empty names
        if(!name || name.length == 0) {
            return;
        }

        // skipping special symbols like dash
        if(name == '-') {
            return;
        }

        if(selector.length == 0) {
            selector = name;
        } else {
            selector = `${selector}.${name}`;
        }

        console.debug(`path: ${selector}.${name}`)
        current = current[name];
        attribute = name;
    });

    return { owner: current, attribute: attribute };
}


/**
 * Fetch a single resource item from DB
 * 
 */
Patch.prototype.fetch = async function (req) {
    // search in DB
    console.debug('fetching single object');
    return this.model.findById(
        this.getID(req)
    );
}

/**
 * 
 * @param incoming HTTP request
 * @returns a resource ID
 */
Patch.prototype.getID = function (req) {
    return req.params.id;
}


module.exports = Patch;