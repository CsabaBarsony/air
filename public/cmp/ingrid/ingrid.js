'use strict';

function Ingrid(container) {
    const units = {
        G: 'g',
        MG: 'mg',
        OZ: 'oz',
        LB: 'lb',
        CUP: 'cup'
    };
    var editing = true;
    this.container = container;

    var ingredients = [
        {
            food: 'avocado',
            editing: true,
            amount: 200,
            unit: units.G
        },
        {
            food: 'broccoli',
            editing: false,
            amount: 123,
            unit: units.G
        }
    ];

    var render = () => {
        this.container.innerHTML = '';
        var title = document.createElement('div');
        title.innerHTML = 'Ingredients';

        var ingredientList = document.createElement('ul');
        ingredients.forEach((ingredient, index) => {
            var ingredientItem = document.createElement('li');
            ingredientItem.setAttribute('data-index', index);
            var food = document.createElement('span');
            food.innerHTML = ingredient.food;
            ingredientItem.appendChild(food);

            if(ingredient.editing) {
                var amountInput = document.createElement('input');
                amountInput.value = ingredient.amount;
                var unitSelect = document.createElement('select');
                for(var key in units) {
                    if(units.hasOwnProperty(key)) {
                        var unitOption = document.createElement('option');
                        unitOption.value = units[key];
                        unitOption.innerHTML = units[key];
                        unitSelect.appendChild(unitOption);
                    }
                }
                ingredientItem.appendChild(amountInput);
                ingredientItem.appendChild(unitSelect);
            }
            else {
                var amountDisplay = document.createElement('span');
                amountDisplay.innerHTML = ingredient.amount + ingredient.unit;
                ingredientItem.appendChild(amountDisplay);
            }
            ingredientList.appendChild(ingredientItem);
        });

        this.container.appendChild(title);
        this.container.appendChild(ingredientList);
    };

    this.add = function(food) {
        var ingredientList = this.container.querySelector('ul');
        if(editing) {
            ingredients.forEach((ingredient, index) => {
                if(ingredient.editing) {
                    ingredient.amount = parseInt(ingredientList.querySelector('li[data-index="' + index + '"] input').value);
                }
                ingredient.editing = false;
            });
        }
        ingredients.push({
            food: food,
            editing: true,
            amount: null,
            unit: units.G
        });
        render();
    };

    render();
}
