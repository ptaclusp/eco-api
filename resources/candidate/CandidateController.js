// CandidateController.js

var Candidate = require("./Candidate");

module.exports = {
    index: async function (req, res) {
        try {
            const candidates = await Candidate.index();

            res.json(candidates);
        }
        catch(err) {
            res.status(500).json({ message: err.message});
        }
    },
    create: async function (req, res) {
        try {
            const candidate = await Candidate.create(req.body);

            res.status(201).json(candidate);
        }
        catch(err) {
            console.dir(err);
            res.status(500).json({ message: err.message});
        }
    }

}
