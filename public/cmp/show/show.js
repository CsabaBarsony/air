'use strict';
//globals: nutrit, Handlebars

/**
 * Show component
 *
 * @param {HTMLElement} container
 * @constructor
 */
function Show(container) {
    /* @type {Ingredient[]} */
    var ingredients = [];

    /**
     * @param {Ingredient[]} newIngredients
     */
    this.update = function(newIngredients) {
        ingredients = newIngredients;
        render();
    };

    function render() {
        if(ingredients.length === 0) {
            container.innerHTML = '';
        }
        else {
            var templateString =
                `<ul>
                    {{#each macros}}
                    <li>
                        <span>{{@key}}: {{this}}</span>
                    </li>
                    {{/each}}
                </ul>
            `;

            container.innerHTML = Handlebars.compile(templateString)({ macros: Show.calculateMacros(ingredients) });
        }
    }
}

/**
 * @param {Ingredient[]} ingredients
 * @returns {Macros}
 */
Show.calculateMacros = function(ingredients) {
    /**
     * @param {Ingredient} ingredient
     * @returns {Ingredient}
     */
    function convertToGram(ingredient) {
        // TODO
        return ingredient;
    }

    var sumCh  = 0;
    var sumFat = 0;
    var sumP   = 0;

    ingredients.forEach((ingredient) => {
        ingredient = convertToGram(ingredient);
        sumCh  += ingredient.food.macros.ch  * ingredient.amount;
        sumFat += ingredient.food.macros.fat * ingredient.amount;
        sumP   += ingredient.food.macros.p   * ingredient.amount;
    });

    var sumMacros = sumCh + sumFat + sumP;

    var ch  = (sumCh  / sumMacros * 100);
    var fat = (sumFat / sumMacros * 100);
    var p   = (sumP   / sumMacros * 100);

    return new nutrit.Macros(ch, fat, p);
};