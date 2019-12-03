
// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
var cors = require('cors')
var engine = require('./js-boot-swagger')
var swagger = require('./pc.swagger.json');
//var UniController = require('./uni-controller');
//var schema = require('./schematator');
const $logger = require('./logger')
const $controller = require('./open-api-controller');



router.all('*', cors());
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'ECO API v1.0',
        message: 'EcoSystem API implementation'
    });
});

$controller.import(swagger, router);
engine.logger($logger);
engine.import(swagger);

// парсим JSON

/*
var builder = new UniController();
schema.import(swagger);

Object.keys(swagger.paths).forEach((route) => {

    console.log(`route: ${route}`);
    // iterate over resource paths
    Object.keys(swagger.paths[route]).forEach((operation) => {

        router.route(`${route}`)[operation](builder.create(operation, swagger.paths[route][operation]));
    })

});
*/
<<<<<<< HEAD

=======
>>>>>>> 5ee349ce64bfbc5662414fac0243e6bfb2f4c2cb
/*
var candidates = require("./resources/candidate/CandidateController");
var specifications = require("./resources/specification/SpecificationController");
var characteristics = require('./resources/characteristic/CharacteristicController');


router.route('/Candidate')
    .get(candidates.index)
    .post(candidates.create)
    ;

router.route('/Specification')
    .get(specifications.index)
    .post(specifications.create)
    ;

router.route('/Specification/:id')
    .get(specifications.get)
    ;

router.route('/Characteristic')
    .get(characteristics.index)
    .post(characteristics.create)
    ;

router.route('/Characteristic/:id')
    .get(characteristics.get)
    .patch(characteristics.patch)
    ;
*/
// Export API routes
*/
module.exports = router;