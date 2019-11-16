// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var CandidateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
// Export Contact model
var Candidate = module.exports = mongoose.model('candidates', CandidateSchema);
module.exports.get = function (callback, limit) {
    Candidate.find(callback).limit(limit);
}