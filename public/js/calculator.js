'use strict';
/* global PubSub, nutrit, ingrid, show */

(function(){
    var Ingrid  = ingrid.Ingrid;
    var Suggest = suggest.Suggest;
    var Show    = show.Show;
    var Food    = nutrit.Food;
    var Macros  = nutrit.Macros;

    const events = {
        FOOD_SELECT:        'FOOD_SELECT',
        INGREDIENTS_CHANGE: 'INGREDIENTS_CHANGE'
    };

    /** @type {Food[]} */ var foods = [
        new Food('avocado' , new Macros(10, 60, 10)),
        new Food('broccoli', new Macros(40, 5,  10)),
        new Food('carrots' , new Macros(60, 1,  5 )),
        new Food('cheese'  , new Macros(5,  50, 40)),
        new Food('chicken' , new Macros(1,  2,  20)),
        new Food('chips'   , new Macros(60, 20, 3 ))
    ];

    var server = {
        /**
         * @param {string} text
         * @param {function(Suggestion[])} callback
         */
        getSuggestions: function(text, callback) {
            /** @type {Suggestion[]} */ var results = [];
            foods.forEach(food => {
                if(new RegExp('^' + text, 'gi').test(food.name)) results.push(new suggest.Suggestion(food.name, food));
            });
            setTimeout(function() {
                callback(results);
            }, 300);
        },
        /**
         * @param {Suggestion} suggestion
         */
        getSelectedSuggestion: function(suggestion) {
            PubSub.publish(events.FOOD_SELECT, suggestion.data);
        }
    };

    function onSave(ingredients) {
        PubSub.publish(events.INGREDIENTS_CHANGE, ingredients);
    }

    var showComponent = new Show(document.getElementById('show_container'));

    PubSub.subscribe(events.INGREDIENTS_CHANGE, function(message, ingredients) {
        showComponent.update(ingredients);
    });

    var ingredients = [];
    ingredients.push(new nutrit.Ingredient(foods[0], 200, nutrit.Unit.G));
    ingredients.push(new nutrit.Ingredient(foods[1], 123, nutrit.Unit.G));

    var ingridComponent = new Ingrid(document.getElementById('ingrid_container'), ingredients, onSave);

    function foodSelected(message, food) {
        ingridComponent.add(food);
    }

    PubSub.subscribe(events.FOOD_SELECT, foodSelected);

    new Suggest(document.getElementById('suggest_container'), server.getSuggestions, server.getSelectedSuggestion);
}());
