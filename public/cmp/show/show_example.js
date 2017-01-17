'use strict';
/* global nutrit, show */

(function() {
    var Show       = show.Show;
    var Ingredient = nutrit.Ingredient;
    var Food       = nutrit.Food;
    var Macros     = nutrit.Macros;
    var Unit       = nutrit.Unit;

    var showComponent = new Show(document.getElementById('show_container'));
    showComponent.update([ new Ingredient(new Food('avocado', new Macros(10, 20, 30)), 123, Unit.G)]);
}());
