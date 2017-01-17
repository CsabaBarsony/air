'use strict';
/* global describe, it, expect, show, nutrit */

describe('Show', function() {
    var Show       = show.Show;
    var Ingredient = nutrit.Ingredient;
    var Food       = nutrit.Food;
    var Unit       = nutrit.Unit;
    var Macros     = nutrit.Macros;

    it('calculateMacros()', function() {
        var ingredients = [
            new Ingredient(new Food('avocado',  new Macros(10, 20, 10)), 100, Unit.G),
            new Ingredient(new Food('broccoli', new Macros(10, 20, 10)), 100, Unit.G)
        ];
        expect(Show.calculateMacros(ingredients)).toEqual(new Macros(25, 50, 25));
    });
});
