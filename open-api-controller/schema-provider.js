var mongoose = require('mongoose');

function SchemaProvider() {

}

var DataTypes = {
    "string": String
}

SchemaProvider.prototype.import = function (definitions) {
    console.debug('processing schema');
    Object.keys(definitions).forEach((name) => {
        let data = definitions[name];
        let schema = {

        }
        // processing only complex objects
        if (data.type == 'object') {
            Object.keys(data.properties).forEach((propertyName) => {

                var property = data.properties[propertyName];
                // if the property has a type - it is simple data type
                if (property.type) {
                    schema[propertyName] = {
                        type: DataTypes[property.type]
                    }
                }
                /*
                schema[property] {

                }
                */
            })
            console.dir(schema);
        }

        //console.dir(data);  
    })
}


SchemaProvider.prototype.collectionName = function (name) {
    return `${name}Collection`;
}

module.exports = new SchemaProvider();