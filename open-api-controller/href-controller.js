
function HrefController() {

    this.url = "http://localhost:8080/api/";
}

HrefController.prototype.linkify = function(name, data) {
    if(data instanceof Array) {
        data.forEach(item => {
            item["href"] = `${this.url}${name}/${item._id}`;
        })
    } else {
        data["href"] = `${this.url}${name}/${data._id}`;
    }
}

module.exports = new HrefController();