'use strict';
// globals: PubSub

(function(){
    const events = {
        FOOD_SELECT: 'FOOD_SELECT',
        INGREDIENTS_CHANGE: 'INGREDIENTS_CHANGE'
    };

    var foods = [
        {
            name: 'carrots',
            macros: {
                ch: 60,
                fat: 1,
                p: 5
            }
        },
        {
            name: 'cheese',
            macros: {
                ch: 5,
                fat: 50,
                p: 40
            }
        },
        {
            name: 'chicken',
            macros: {
                ch: 1,
                fat: 2,
                p: 20
            }
        },
        {
            name: 'chips',
            macros: {
                ch: 60,
                fat: 20,
                p: 3
            }
        }
    ];

    var server = {
        getFoodSuggestion: function(text, callback) {
            var results = [];
            foods.forEach((food) => {
                var regex = new RegExp('^' + text, 'gi');
                if(regex.test(food.name)) results.push({
                    text: food.name,
                    data: food
                });
            });
            setTimeout(function() {
                callback(results);
            }, 300);
        },
        getFood: function(food) {
            PubSub.publish(events.FOOD_SELECT, food);
        }
    };

    function onSave(ingredients) {
        PubSub.publish(events.INGREDIENTS_CHANGE, ingredients);
    }

    function pie() {
        PubSub.subscribe(events.INGREDIENTS_CHANGE, function(message, ingredients) {
            console.log(ingredients);
        });
    }

    pie();

    var ingredients = [
        {
            food: 'cheese',
            editing: true,
            amount: 200,
            unit: Ingrid.units.G
        },
        {
            food: 'chicken',
            editing: false,
            amount: 123,
            unit: Ingrid.units.G
        }
    ];

    var ingrid = new Ingrid(document.getElementById('ingrid_container'), ingredients, onSave);

    function foodSelected(message, data) {
        ingrid.add(data);
    }

    var foodSelectSubscription = PubSub.subscribe(events.FOOD_SELECT, foodSelected);

    Suggest(document.getElementById('suggest_container'), server.getFoodSuggestion, server.getFood);
})();
