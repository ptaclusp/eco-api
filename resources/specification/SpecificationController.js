// CandidateController.js

var Specification = require("./Specification");

module.exports = {
    index: async function (req, res) {
        try {
            const specifications = await Specification.index();

            res.json(specifications);
        }
        catch(err) {
            res.status(500).json({ message: err.message});
        }
    },
    create: async function (req, res) {
        try {
            const specification = await Specification.create(req.body);

            res.status(201).json(specification);
        }
        catch(err) {
            console.dir(err);
            res.status(500).json({ message: err.message});
        }
    }

}
