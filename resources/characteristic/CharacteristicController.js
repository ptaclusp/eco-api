// CandidateController.js
var $patcher = require('../../x-json-patcher-mongoose');
var $logger = require('../../logger')

var Characteristic = require("./characteristic");

module.exports = {
    index: async function (req, res) {
        try {
            console.log('requested')
            const characteristics = await Characteristic.index();

            res.json(characteristics);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    create: async function (req, res) {
        try {
            const characteristic = await Characteristic.create(req.body);

            res.status(201).json(characteristic);
        }
        catch (err) {
            console.dir(err);
            res.status(500).json({ message: err.message });
        }
    },
    get: async function (req, res) {
        try {
            const characteristic = await Characteristic.get(req.params.id);

            res.json(characteristic);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    patch: async function (req, res) {
        try {
            $logger.debug('-->> patch');
            await $patcher.patch(req, res, Characteristic);
            $logger.debug('<<-- patch');
        }
        catch (err) {
            console.dir(err);
            res.status(500).json({ message: err.message });
        }
    }

}
