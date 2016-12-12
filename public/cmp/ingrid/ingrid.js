'use strict';

function Ingrid(container, ingredients, onSave) {
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
        container.appendChild(Ingrid.render(ingredients, function() { alert('majom');   }));
    };
    container.innerHTML = '';
    container.appendChild(Ingrid.render(ingredients, function() { alert('majom'); }));
}

Ingrid.units = {
    G: 'g',
    MG: 'mg',
    OZ: 'oz',
    LB: 'lb',
    CUP: 'cup'
};

Ingrid.render = function(ingredients, addClick) {
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
            for(var key in Ingrid.units) {
                if(Ingrid.units.hasOwnProperty(key)) {
                    var unitOption = document.createElement('option');
                    unitOption.value = Ingrid.units[key];
                    unitOption.innerHTML = Ingrid.units[key];
                    unitSelect.appendChild(unitOption);
                }
            }
            var addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.addEventListener('click', addClick);
            ingredientItem.appendChild(amountInput);
            ingredientItem.appendChild(unitSelect);
            ingredientItem.appendChild(addButton);
        }
        else {
            var amountDisplay = document.createElement('span');
            amountDisplay.innerHTML = ingredient.amount + ingredient.unit;
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            ingredientItem.appendChild(amountDisplay);
            ingredientItem.appendChild(removeButton);
        }
        ingredientList.appendChild(ingredientItem);
    });
    return ingredientList;
};
