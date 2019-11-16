// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var CandidateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },

});
// Export Contact model
var Candidate = module.exports = mongoose.model('candidates', CandidateSchema);

module.exports.index = async function () {
    return Candidate.find();
}

module.exports.create = async function(data) {
    
    const candidate = new Candidate(data);
    return candidate.save()

}