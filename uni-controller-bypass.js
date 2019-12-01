function Bypass() {

}

Bypass.prototype.process = function(req, res) {
    res.status(501).json({ message: "operation not implemented"});

}

module.exports = Bypass;