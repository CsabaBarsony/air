'use strict';

(function() {
    /**
     * @param {string} name
     * @param {Macros} macros
     * @constructor
     */
    function Food(name, macros) {
        this.name   = name;
        this.macros = macros;
    }

    /**
     * @param {number} ch
     * @param {number} fat
     * @param {number} p
     * @constructor
     */
    function Macros(ch, fat, p) {
        this.ch  = ch;
        this.fat = fat;
        this.p   = p;
    }

    /**
     *
     * @enum {string}
     */
    var Unit = {
        G: 'g',
        MG: 'mg',
        OZ: 'oz',
        LB: 'lb'
    };

    /**
     *
     * @param {Food} food
     * @param {number} amount
     * @param {Unit} unit
     * @constructor
     */
    function Ingredient(food, amount, unit) {
        this.food = food;
        this.amount = amount;
        this.unit = unit;
    }

    window.nutrit = {
        Food:   Food,
        Macros: Macros,
        Unit: Unit,
        Ingredient: Ingredient
    };
}(window));