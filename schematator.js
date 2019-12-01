function Schematator() {

}

Schematator.prototype.import = function (swagger) {
    this.swagger = swagger;
    this.schemas = {};

    Object.keys(this.swagger.definitions).forEach((name) => {
        //console.log(`def: ${definition}`);
        var definition = this.swagger.definitions[name];
        //console.dir(definition);
        if (definition.properties) {

            var schema = {};
            Object.keys(definition.properties).forEach((propertyName) => {
                var property = definition.properties[propertyName];

                if(property.type) {
                    //console.log(this.type(property.type));
                    schema[propertyName] = {
                        type: this.type(property.type)
                    }
                } else {

                }
                //console.dir(property);
            });

            //console.dir(schema);


        };
    })
}

Schematator.prototype.type = function(name) {
    switch(name) {
        case "string"       : return String;
        case "boolean"      : return Boolean;
        case "number"       : return Number;
        case "integer"      : return Number;
        default: {
            console.log(`unknown type: ${name}`);
            return Object
        }
    }
}

module.exports = new Schematator();