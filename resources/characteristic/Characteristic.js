// contactModel.js
var mongoose = require('mongoose');
// Setup schema

var CharacteristicValue  = mongoose.Schema({
    isDefault: {
        type: Boolean
    },
    value: {
        type: String,
        required: true
    }
});

var CharacteristicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    valueType: {
        type: String,
        required: true
    },
    configurable: {
        type: Boolean,
        required: true
    },
    prodSpecCharacteristicValue : {
        type: [CharacteristicValue]
    }

});
// Export Contact model
var Characteristic = module.exports = mongoose.model('characteristics', CharacteristicSchema);

module.exports.schema = CharacteristicSchema;

module.exports.index = async function () {
    return Characteristic.find();
}

module.exports.create = async function(data) {
    
    const characteristic = new Characteristic(data);
    return characteristic.save()
}

module.exports.get = async function(id) {
    return Characteristic.findById(id);
}

module.exports.patch = async function(id, data) {

    let doc = new Characteristic();

    $logger.debug('-->> object.patch');

    return Characteristic.update(
        { _id: id },
        {
            $push: {
                productSpecCharacteristicValue: data
            }
        }
    );
}