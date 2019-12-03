function JsPath() {

}

JsPath.prototype.get - function (source, path) {

    let steps = path.split('.');
    let res = source;

    steps.forEarch((step) => {

        if(res[step]) {
            res = res[step];
        } else {
            return null;
        }

    })

    return res;

}

module.exports = new JsPath();