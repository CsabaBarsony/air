'use strict';
//globals: Handlebars

function Show(container) {
    var ingredients = [];

    this.update = function(newIngredients) {
        ingredients = newIngredients;
        render();
    };

    function render() {
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
        var template = Handlebars.compile(templateString);
        container.innerHTML = template({ macros: macros });
    }
}

Show.calculateMacros = function(ingredients) {
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

    var macros;
    return macros;
};