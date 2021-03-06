const chalk = require('chalk');
const mongoose = require('mongoose');
const util = require('util');
var schema = require('./schema-provider');

const PATCH_OPERATIONS = {
    ADD: "add",
    SET: "replace",
    REMOVE: "remove"
}


/**
 * 
 * @param {*} name resource name
 * @param {*} path Swagger path section for PATCH operation
 */
function Patch(name, path) {
    this.name = name;
    this.path = path;

    this.handler = null;

    try {
        this.handler = require(`./handlers/${this.name}`);
        console.log(`found handler for PATCH ${this.name} operations`);
    } catch (e) {
        // not a big deal
    }

    console.log(`PATCH ${name}`);
    console.dir(path);

    // determine data type from params
    // here's an assumption that for POST operations there exist only one parameter and it's in body
    let typeName = schema.extractTypeName(path.responses["200"].schema.$ref);
    this.model = schema.orm(schema.collectionName(name), schema.schemas[typeName]);
    console.debug(`GET type name ${typeName}`);
}

// index resources
Patch.prototype.exec = async function (req, res) {
    // let's check content type
    let contentType = req.get('Content-Type');

    if (contentType == 'application/json-patch+json') {
        console.debug(`JSON patch operation`)
        // perform JSON patch
        let item = await this.jsonpatch(req, res);
        console.log('patched');
        return res.status(200).json(item);
    } else { // other mechanisms are not supported
        return res.status(501).json({ message: "plain PATCH is not implemented yet" })
    }
}

Patch.prototype.jsonpatch = async function (req, res, orm) {
    console.debug('performing JSON patch operation');

    // load an object from DB for patching
    let item = await this.fetch(req);

    // iterate over operations
    /*
    req.body.forEach(async (operation) => {
        switch (operation.op.toLowerCase()) {
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
    */
    for (const operation of req.body) {
        switch (operation.op.toLowerCase()) {
            case PATCH_OPERATIONS.ADD: {
                // perform ADD operation
                console.debug(`JSON patch ADD ${operation.path}`)
                await this.add(item, operation.path, operation.value);
                break;
            }
            case PATCH_OPERATIONS.SET: {
                // perform ADD operation
                console.debug(`JSON patch SET ${operation.path}`)
                await this.set(item, operation.path, operation.value);
                break;
            }
            case PATCH_OPERATIONS.REMOVE: {
                // perform ADD operation
                console.debug(`JSON patch REMOVE ${operation.path}`)
                await this.remove(item, operation.path, operation.value);
                break;
            }
            default:
                console.error(`patch operation ${operation.op} is not implemented`);
        }

    }

    // update the object in DB
    return await item.save();
}

Patch.prototype.set = async function (item, path, value) {

    await this.iterate(item, path, async (current, element, attribute) => {
        // watch here for special rules
        //console.log(`name: ${this.name}, element: ${element}, attribute: ${attribute}`)

        element[attribute] = value;
        console.log(`setting ${attribute} to ${value}`);

        if (this.handler && this.handler.patch) {
            console.log('using handler');
            await this.handler.patch(item, path, value);
            console.log('handler applied');
        } else {
            await Promise.resolve(true);
        }

    });
}

Patch.prototype.remove = async function (item, path, value) {

    await this.iterate(item, path, async (current, element, attribute) => {
        // watch here for special rules
        //console.log(`name: ${this.name}, element: ${element}, attribute: ${attribute}`)

        // let's assume element is an array
        // надо найти элемент с соответствующим ID и убить его
        //console.log(`removine ${attribute} from ${element}`);
        if(element instanceof Array) {
            let item = element.find( data => {
                return data._id == attribute;
            })

            if(item) {
                console.log('REMOVE success');
                element.splice( element.indexOf(item), 1 );
            } else {
                console.log(`element ${attribute} not found in the array`);
            }

        } else {
            console.log(`cannot remove non-array elements`);
        }


        if (this.handler && this.handler.patch) {
            console.log('using handler');
            await this.handler.patch(item, path, value);
            console.log('handler applied');
        } else {
            await Promise.resolve(true);
        }

    });
}


Patch.prototype.add = async function (item, path, value) {
    this.iterate(item, path, (current, element, attribute) => {

        if (!current) {
            console.debug(`current is empty, creating new array with ${attribute}`);
            element[attribute] = [];
            current = element[attribute];
        }

        current.push(value);
    });
}


/**
 * Extract resource subitem and its selector from path
 * @argument item a resource object
 * @argument path a JSON patch op path
 * @argument process a handler for processing element operation
 * 
 */
Patch.prototype.iterate = async function (item, path, process) {

    // split path to array of strings
    let names = path.split('/');
    // init the current object structure
    let current = item;
    let context = null;
    let attribute = '';

    while (names.length) {
        // get next path element from array
        let name = names.shift();
        console.debug(`next name: ${name}`);

        // processing only non-empty names
        if (!name || name.length == 0) {
            continue;
        }

        if (name == '-') {
            continue;
        }

        context = current;
        attribute = name;
        current = this.step(current, name);
    }

    await process(current, context, attribute);
}

Patch.prototype.step = function (element, path) {
    if (element instanceof Array) {
        let ret = undefined;
        element.forEach((item) => {
            if (item._id == path) {
                ret = item;
            }
        })

        return ret;

    } else {
        return element[path];
    }
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