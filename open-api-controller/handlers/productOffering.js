const fetch = require('node-fetch');

function ProductOfferingHandler() {

    this.rules = [
        {
            expression: new RegExp(''),
            handler: this.setSpecificationHandler
        }
    ]
}

ProductOfferingHandler.prototype.patch = async function (item, path, value) {

    for(rule of this.rules) {
        if (rule.expression.test(path)) {
            await rule.handler(item, value);
        }
    }

}

/**
 * Инициализация значений характеристик из спецификации
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

    // загрузка спецификации
    console.log(`fetching specification`);
    try {
        let response = await fetch(value.href);
        let specification = await response.json();

        // заполним значения продуктового предложения характеристиками спецификации
        console.dir(specification);
        let items = [];

        specification.productSpecCharacteristic.forEach((characteristic) => {
            //const char = (({ name, description, valueType, minCardinality, maxCardinality }) => ({ name, description, valueType, minCardinality, maxCardinality }))(object);
            const char = { name, description, valueType, minCardinality, maxCardinality } = characteristic;
            console.log(`${char.name}`);
            char.productSpecification = value;
            items.push(char);
        });

        item['prodSpecCharValueUse'] = items;
        return Promise.resolve(1);

    } catch (e) {
        console.dir(e);

    }

}

module.exports = new ProductOfferingHandler();