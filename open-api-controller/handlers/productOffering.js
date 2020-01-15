const fetch = require('node-fetch');

function ProductOfferingHandler() {

    this.rules = [
        {
            expression: new RegExp('/productSpecification'),
            handler: this.setSpecificationHandler
        }
    ]
}

ProductOfferingHandler.prototype.patch = async function (item, path, value) {

    for (rule of this.rules) {
        console.log(`testing regexp ${rule} against ${path}`);
        if (rule.expression.test(path)) {
            console.log(`MATCHED`);
            await rule.handler.call(this, item, value);
        }
    }

}

/**
 * Инициализация значений характеристик из спецификации
 * @argument item the pobject being patched
 * @argument value Specification reference object
 * @argument items characteristic array to append
 */
ProductOfferingHandler.prototype.setSpecificationHandler = async function (item, value) {
    //await new Promise(r => setTimeout(r, 5000));

    console.log('setting offering params');
    /*
     TODO
     - загрузить спецификацию
     - загрузить свзянанные спецификации
     - заполнить объект
     - конец
     */



    try {

        // заполним значения продуктового предложения характеристиками спецификации
        //console.dir(specification);
        item['prodSpecCharValueUse'] = await this.aggregateCharacteristics(value);
        return Promise.resolve(1);

    } catch (e) {
        console.dir(e);

    }


}

ProductOfferingHandler.prototype.aggregateCharacteristics = async function (ref) {

    // init characteristic array
    let items = [];

    // загрузка спецификации
    console.log(`fetching specification ${ref.name} at ${ref.href}`);
    try {
        let response = await fetch(ref.href);
        let specification = await response.json(); // got specification

        // load nested specs
        for (subspec of specification.bundledProductSpecification) {
            subitems = await this.aggregateCharacteristics(subspec)
            items = items.concat(subitems);
        }

        // extract all characteristics from the spec
        specification.productSpecCharacteristic.forEach((characteristic) => {
            const data = { name, description, valueType, minCardinality, maxCardinality } = characteristic;
            console.log(`${data.name}`);
            data.productSpecification = ref;
            items.push(data);
        });
    }
    catch (e) {
        console.dir(e);
    }

    return items;
}


module.exports = new ProductOfferingHandler();
console.dir(module.exports);