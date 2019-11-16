// CandidateController.js

var Candidate = require("./Candidate");

module.exports = {
    index: function (req, res) {
        Candidate.get(function (err, candidates) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json(
                candidates
            );
        });
    },
    create: function (req, resp) {
        //console.dir(req);
    }

}
