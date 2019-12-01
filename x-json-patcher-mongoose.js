var $logger = require('./logger');

const PATCH_OPERATIONS = {
    ADD: "add"
}

function UniMongooseController() {

}

/**
 * JSON PATCH support for mongoose schemas
 * @param req incoming HTTP request object
 * @param res HTTP response object
 * @param dao Mongoose model
 */
UniMongooseController.prototype.patch = async function (req, res, dao) {

    // let's check content type
    let contentType = req.get('Content-Type');

    if (contentType == 'application/json-patch+json') {
        $logger.debug(`JSON patch operation`)
        // perform JSON patch
        let item = await this.jsonpatch(req, res, dao);
        res.status(200).json(item);
    } else { // other mechanisms are not supported
        res.status(501).json({ message: "plain PATCH is not implemented yet" })
    }


/*
    req.body.forEach((op) => {
        $logger.debug(`${op.op} element ${op.path}`)

        var names = op.path.split('/');

        names.forEach((name) => {
            if (name.length) { // processing only non-empty names
                param = dao.schema.path(name);

                if (param) {
                    if (param.instance == 'Array') {
                        item[name].push(op.value);
                    }
                }
                //$logger.debug(`processing attribute ${name}`);
                //$logger.debug(`path`, dao.schema.paths[name].instance);
                //console.dir(schema.path(name));
                //console.log(dao.schema.path(name).instance);
            }

        })

    });

    item.save();
    /*
            const characteristic = await Characteristic.patch(req.params.id, req.body);
    
            // result
            res.json(characteristic);
    */
}

/**
 * 
 * @param incoming HTTP request
 * @returns a resource ID
 */
UniMongooseController.prototype.getID = function (req) {
    return req.params.id;
}

/**
 * Fetch a single resource item from DB
 * 
 */
UniMongooseController.prototype.fetch = async function (req, dao) {
    // search in DB
    $logger.debug('fetching single object');
    return dao.findById(
        this.getID(req)
    );
}

UniMongooseController.prototype.jsonpatch = async function (req, res, dao) {

    $logger.debug('performing JSON patch operation');

    // load an object from DB for patching
    let item = await this.fetch(req, dao);

    // iterate over operations
    req.body.forEach((operation) => {
        switch(operation.op.toLowerCase()) {
            case PATCH_OPERATIONS.ADD: {
                // perform ADD operation
                $logger.debug(`JSON patch ADD ${operation.path}`)
                this.add(item, operation.path, operation.value);
                break;
            }
            default: 
                $logger.error(`patch operation ${operation.op} is not implemented`);
        }
    });

    // update the object in DB
    return await item.save();
}

UniMongooseController.prototype.add = function(item, path, value) {

    let attribute = this.iterate(item, path);

    if(attribute instanceof Array) {
        attribute.push(value);
    }


}

UniMongooseController.prototype.iterate = function(item, path) {

    let names = path.split('/');
    let current = item;
    let selector = '';

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

        $logger.debug(`path: ${selector}`)
        current = current[name];
    });

    return current;
}

module.exports = new UniMongooseController();