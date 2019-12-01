var indexer = require('./uni-controller-index');
var bypass  = require('./uni-controller-bypass');

function UniController() {

}

UniController.prototype.create = function(name, swagger) {

    //console.dir(swagger);
    // select proper GET handler
    if(name === 'get') {
        //console.dir(swagger.responses['200']);
        var responseSchema = swagger.responses['200'].schema;
        // если возвращается массив, то это операция индексации
        if(responseSchema.type === 'array') {
            return new indexer(name, swagger).list;
        }
    }

    return new bypass().process;
    
}



module.exports = UniController;