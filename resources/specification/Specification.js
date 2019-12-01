// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var SpecificationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }

});
// Export Contact model
var Specification = module.exports = mongoose.model('specifications', SpecificationSchema);

module.exports.index = async function () {
    return Specification.find();
}

module.exports.create = async function(data) {
    
    const specification = new Specification(data);
    return specification.save()
}

module.exports.get = async function(id) {
    return Specification.findById(id);
}