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
            var macros = [
                {
                    name: 'ch',
                    value: 10
                },
                {
                    name: 'fat',
                    value: 20
                },
                {
                    name: 'protein',
                    value: 30
                }
            ];

            var templateString =
                `<ul>
                {{#each macros}}
                <li>
                    <span>{{name}}: {{value}}</span>
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

    var sumCh = 0;
    var sumFat = 0;
    var sumProtein = 0;

    ingredients.forEach((ingredient) => {
        ingredient = convertToGram(ingredient);
        sumCh += ingredient;
    });

    return new nutrit.Macros(10, 20, 30);
};