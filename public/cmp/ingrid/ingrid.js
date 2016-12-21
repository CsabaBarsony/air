'use strict';

function Ingrid(container, ingredients, onChange) {
    var List = React.createClass({
        getInitialState: function() {
            return { ingredients: this.props.ingredients };
        },
        displayName: 'List',
        render: function() {
            var items = this.state.ingredients.map((ingredient, index) => {
                var food = React.createElement('span', null, ingredient.food);
                var amount = ingredient.editing ?
                    React.createElement('input', { value: ingredient.amount, onChange: this.amountChange }) :
                    React.createElement('span',  null, ingredient.amount);
                var unit = ingredient.editing ?
                    React.createElement('input', { onChange: this.unitChange }) :
                    React.createElement('span', null, ingredient.unit);

                return React.createElement('li', { key: index, 'data-index': index }, food, amount, unit);
            });

            return React.createElement('ul', null, items);
        },
        amountChange: function(e) {
            var index = e.target.parentElement.dataset.index;
            var amount = parseInt(e.target.value);
            var ing = this.state.ingredients;
            ing[index].amount = amount;
            this.setState({ ingredients: ing });
        },
        unitChange: function(e) {
            var index = e.target.parentElement.dataset.index;
            var amount = Ingrid.units[e.target.value];
        }
    });

    ReactDOM.render(React.createElement(List, { ingredients: ingredients }), container);

    /*function addClick(e) {
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
    container.appendChild(Ingrid.render(ingredients, addClick, removeClick));*/
}

Ingrid.units = {
    G: 'g',
    MG: 'mg',
    OZ: 'oz',
    LB: 'lb',
    CUP: 'cup'
};

Ingrid.render = function(ingredients, addClick, removeClick) {
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
};
