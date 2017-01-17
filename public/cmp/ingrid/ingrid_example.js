'use strict';
/* global nutrit, ingrid */

(function() {
    var Ingrid     = ingrid.Ingrid;
    var Food       = nutrit.Food;
    var Ingredient = nutrit.Ingredient;
    var Unit       = nutrit.Unit;
    var Macros     = nutrit.Macros;

    document.getElementById('add_ingredient').addEventListener('click', () => { component.add(new Food('new food', new Macros(10, 10, 10))); });

    var ingredients = [
        new Ingredient(new Food('avocado',  new Macros(10, 20, 30)), 200, Unit.G),
        new Ingredient(new Food('broccoli', new Macros(30, 20, 10)), 123, Unit.G)
    ];

    var component = new Ingrid(document.getElementById('ingrid_container'), ingredients, () => { console.log(ingredients); });
}());
