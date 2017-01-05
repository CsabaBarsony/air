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
    var macros;
    return macros;
};