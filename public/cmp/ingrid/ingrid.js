'use strict';

function Ingrid(container, ingredients, onChange) {
    function addClick(e) {
        var amount = parseInt(e.target.parentElement.querySelector('input').value);
        var index = parseInt(e.target.parentElement.attributes[0].value);
        ingredients[index].editing = false;
        ingredients[index].amount = amount;
        container.innerHTML = '';
        container.appendChild(Ingrid.render(ingredients, addClick, removeClick));
        var ingredientResult = ingredients.map((ingredient) => {
            return {
                food: ingredient.food,
                amount: ingredient.amount,
                unit: ingredient.unit
            };
        });
        onChange(ingredientResult);
    }

    function removeClick(e) {
        var index = parseInt(e.target.parentElement.attributes[0].value);
        ingredients.splice(index, 1);
        container.innerHTML = '';
        container.appendChild(Ingrid.render(ingredients, addClick, removeClick));
        var ingredientResult = ingredients.map((ingredient) => {
            return {
                food: ingredient.food,
                amount: ingredient.amount,
                unit: ingredient.unit
            };
        });
        onChange(ingredientResult);
    }

    this.add = function(food) {
        var ingredientList = container.querySelector('ul');
        ingredients.forEach((ingredient, index) => {
            if(ingredient.editing) {
                var amount = parseInt(ingredientList.querySelector('li[data-index="' + index + '"] input').value);
                ingredient.amount = isNaN(amount) ? 0 : amount;
            }
            ingredient.editing = false;
        });
        ingredients.push({
            food: food,
            editing: true,
            amount: null,
            unit: Ingrid.units.G
        });
        container.innerHTML = '';
        container.appendChild(Ingrid.render(ingredients, addClick, removeClick));
    };
    container.innerHTML = '';
    container.appendChild(Ingrid.render(ingredients, addClick, removeClick));

    this.render = function() {
        var ingredientList = document.createElement('ul');

        ingredients.forEach((ingredient, index) => {
            var ingredientItem = document.createElement('li');
            var food           = document.createElement('span');

            ingredientItem.setAttribute('data-index', index);
            ingredientItem.appendChild(food);
            food.innerHTML = ingredient.food;

            if(ingredient.editing) {
                var amountInput = document.createElement('input');
                var unitSelect  = document.createElement('select');
                var addButton   = document.createElement('button');

                for(var key in Ingrid.units) {
                    if(Ingrid.units.hasOwnProperty(key)) {
                        var unitOption = document.createElement('option');
                        unitOption.value = Ingrid.units[key];
                        unitOption.innerHTML = Ingrid.units[key];
                        unitSelect.appendChild(unitOption);
                    }
                }

                amountInput.value = ingredient.amount;
                addButton.textContent = 'Add';
                addButton.addEventListener('click', addClick);

                ingredientItem.appendChild(amountInput);
                ingredientItem.appendChild(unitSelect);
                ingredientItem.appendChild(addButton);
            }
            else {
                var amountDisplay = document.createElement('span');
                var removeButton = document.createElement('button');

                amountDisplay.innerHTML = ingredient.amount + ingredient.unit;
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', removeClick);

                ingredientItem.appendChild(amountDisplay);
                ingredientItem.appendChild(removeButton);
            }
            ingredientList.appendChild(ingredientItem);
        });
        return ingredientList;
    }
}

Ingrid.units = {
    G: 'g',
    MG: 'mg',
    OZ: 'oz',
    LB: 'lb',
    CUP: 'cup'
};

Ingrid.render = function(ingredients, addClick, removeClick) {
    var template =
        `<ul>
            {{#ingredients}}
            <li>
                <span>{{food}}</span>
            </li>
            {{/ingredients}}
        </ul>`;

    /*var ingredientList = document.createElement('ul');

    ingredients.forEach((ingredient, index) => {
        var ingredientItem = document.createElement('li');
        var food           = document.createElement('span');

        ingredientItem.setAttribute('data-index', index);
        food.innerHTML = ingredient.food;
        ingredientItem.appendChild(food);

        if(ingredient.editing) {
            var amountInput = document.createElement('input');
            var unitSelect  = document.createElement('select');
            var addButton   = document.createElement('button');

            for(var key in Ingrid.units) {
                if(Ingrid.units.hasOwnProperty(key)) {
                    var unitOption = document.createElement('option');
                    unitOption.value = Ingrid.units[key];
                    unitOption.innerHTML = Ingrid.units[key];
                    unitSelect.appendChild(unitOption);
                }
            }

            amountInput.value = ingredient.amount;
            addButton.textContent = 'Add';
            addButton.addEventListener('click', addClick);

            ingredientItem.appendChild(amountInput);
            ingredientItem.appendChild(unitSelect);
            ingredientItem.appendChild(addButton);
        }
        else {
            var amountDisplay = document.createElement('span');
            var removeButton = document.createElement('button');

            amountDisplay.innerHTML = ingredient.amount + ingredient.unit;
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', removeClick);

            ingredientItem.appendChild(amountDisplay);
            ingredientItem.appendChild(removeButton);
        }
        ingredientList.appendChild(ingredientItem);
    });*/

    var container = document.createElement('div');
    var x = Mustache.render(template, { ingredients: ingredients });
    container.innerHTML = x;
    return container;
};
