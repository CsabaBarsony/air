'use strict';

/*function Component() {
    this.container = container;
    this.model = model ? model : {};
    this.callback = callback ? callback : undefined;
    debugger

    this.render = function(template) {
        debugger
    }
}

function Ing(container, model, callback) {
    this.model = model ? model : { foods: [] };

    this.add = function(food) {
        this.model.foods.push(food);
        this.render();
    }
}

Ing.prototype = new Component();

var ing = new Ing(document.createElement('div'), null);
ing.add('avocado');
debugger*/

function Ingrid(container, ingredients, onChange) {
    var model = {
        ingredients: ingredients
    };

    function addClick(e) {
        var amount = parseInt(e.target.parentElement.querySelector('input').value);
        var ingredient = model.ingredients[e.target.parentElement.dataset.index];
        ingredient.editing = false;
        ingredient.amount = amount;
        container.innerHTML = '';
        container.appendChild(render());
        var ingredientResult = model.ingredients.map((ingredient) => {
            return {
                food: ingredient.food,
                amount: ingredient.amount,
                unit: ingredient.unit
            };
        });
        onChange(ingredientResult);
    }

    function removeClick(e) {
        model.ingredients.splice(e.target.parentElement.dataset.index, 1);
        container.innerHTML = '';
        container.appendChild(render());
        var ingredientResult = model.ingredients.map((ingredient) => {
            return {
                food: ingredient.food,
                amount: ingredient.amount,
                unit: ingredient.unit
            };
        });
        onChange(ingredientResult);
    }

    function render() {
        var templateString =
            `{{#each ingredients}}
            <li data-index="{{@index}}">
                {{#if editing}}
                <span>{{food}}</span>
                <input type="text" value="{{amount}}" />
                <select name="" id="">
                    {{#each ../units}}
                    <option>{{.}}</option>
                    {{/each}}
                </select>
                <button class="add">Add</button>
                {{else}}
                <span>{{food}}</span>
                <span>{{amount}}</span>
                <span>{{unit}}</span>
                <button class="remove">Remove</button>
                {{/if}}
            </li>
            {{/each}}
            `;

        var list = document.createElement('ul');
        var templateData = {
            ingredients: model.ingredients,
            units: Ingrid.units
        };
        var template = Handlebars.compile(templateString, templateData);
        list.innerHTML = template(templateData);
        list.querySelectorAll('button.add')   .forEach(b => b.onclick = addClick);
        list.querySelectorAll('button.remove').forEach(b => b.onclick = removeClick);
        return list;
    }

    this.add = function(food) {
        var ingredientList = container.querySelector('ul');
        model.ingredients.forEach((ingredient, index) => {
            if(ingredient.editing) {
                var amount = parseInt(ingredientList.querySelector('li[data-index="' + index + '"] input').value);
                ingredient.amount = isNaN(amount) ? 0 : amount;
            }
            ingredient.editing = false;
        });
        model.ingredients.push({
            food: food,
            editing: true,
            amount: null,
            unit: Ingrid.units.G
        });
        container.innerHTML = '';
        container.appendChild(render());
    };

    container.innerHTML = '';
    container.appendChild(render());
}

Ingrid.units = {
    G: 'g',
    MG: 'mg',
    OZ: 'oz',
    LB: 'lb',
    CUP: 'cup'
};
