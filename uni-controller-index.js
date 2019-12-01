var schema = require('./schematator');

function Indexer(name, swagger) {
    this.swagger    = swagger;
    this.name       = name;
    this.schema     = swagger.responses['200'].schema.items['$ref'];
    console.log(`${this.name} ${this.schema}`);
    
    console.log(`create INDEXER for ${name}`);
}

Indexer.prototype.list = function(req, res) {
    console.log(`processing INDEX request for ${req.url}`)
    res.status('200').json({status: "ok"});
}

module.exports = Indexer;