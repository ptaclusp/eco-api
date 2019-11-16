// Filename: api-routes.js
// Initialize express router
let router  = require('express').Router();
var cors    = require('cors')

router.all('*', cors());
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'ECO API v1.0',
        message: 'EcoSystem API implementation'
    });
});

var candidates = require("./resources/candidate/CandidateController");


router.route('/candidate')
    .get(candidates.index)
    .post(candidates.create)
    ;
// Export API routes
module.exports = router;