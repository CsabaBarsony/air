'use strict';
// globals: PubSub, suggest

(function(){
    const events = {
        FOOD_SELECT:        'FOOD_SELECT',
        INGREDIENTS_CHANGE: 'INGREDIENTS_CHANGE'
    };

    var foods = {
        avocado:  new nutrit.Food('avocado' , new nutrit.Macros(10, 60, 10)),
        broccoli: new nutrit.Food('broccoli', new nutrit.Macros(40, 5,  10)),
        carrots:  new nutrit.Food('carrots' , new nutrit.Macros(60, 1,  5 )),
        cheese:   new nutrit.Food('cheese'  , new nutrit.Macros(5,  50, 40)),
        chicken:  new nutrit.Food('chicken' , new nutrit.Macros(1,  2,  20)),
        chips:    new nutrit.Food('chips'   , new nutrit.Macros(60, 20, 3 ))
    };

    var server = {
        /**
         * @param {string} text
         * @param {function(Suggestion[])} callback
         */
        getFoodSuggestion: function(text, callback) {
            /* @type {Suggestion[]} */
            var results = Object.keys(foods).filter(key => {
                var r = new RegExp('^' + text, 'gi');
                if(r.test(foods[key].name)) return new suggest.Suggestion(foods[key].name, foods[key]);
            });
            setTimeout(function() {
                callback(results);
            }, 300);
        },
        /**
         * @param {Food} food
         */
        getFood: function(food) {
            PubSub.publish(events.FOOD_SELECT, food);
        }
    };

    function onSave(ingredients) {
        PubSub.publish(events.INGREDIENTS_CHANGE, ingredients);
    }

    var show = new Show(document.getElementById('show_container'));

    PubSub.subscribe(events.INGREDIENTS_CHANGE, function(message, ingredients) {
        show.update(ingredients);
    });

    var ingredients = [];
    ingredients.push(new nutrit.Ingredient(foods.avocado,  200, nutrit.Unit.G));
    ingredients.push(new nutrit.Ingredient(foods.broccoli, 123, nutrit.Unit.G));

    var ingrid = new Ingrid(document.getElementById('ingrid_container'), ingredients, onSave);

    function foodSelected(message, data) {
        ingrid.add(data.data);
    }

    PubSub.subscribe(events.FOOD_SELECT, foodSelected);

    new suggest.Suggest(document.getElementById('suggest_container'), server.getFoodSuggestion, server.getFood);
})();
