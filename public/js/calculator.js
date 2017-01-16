'use strict';

function foo() {
    var x = this;
}

foo.call('majom');

/*
'use strict';

(function(){
    const events = {
        FOOD_SELECT:        'FOOD_SELECT',
        INGREDIENTS_CHANGE: 'INGREDIENTS_CHANGE'
    };

    /!**
     * @type {{avocado: Food, broccoli: Food, carrots: Food, cheese: Food, chicken: Food, chips: Food}}
     *!/
    var foods = {
        avocado:  new nutrit.Food('avocado' , new nutrit.Macros(10, 60, 10)),
        broccoli: new nutrit.Food('broccoli', new nutrit.Macros(40, 5,  10)),
        carrots:  new nutrit.Food('carrots' , new nutrit.Macros(60, 1,  5 )),
        cheese:   new nutrit.Food('cheese'  , new nutrit.Macros(5,  50, 40)),
        chicken:  new nutrit.Food('chicken' , new nutrit.Macros(1,  2,  20)),
        chips:    new nutrit.Food('chips'   , new nutrit.Macros(60, 20, 3 ))
    };

    var server = {
        /!**
         * @param {string} text
         * @param {function(Suggestion[])} callback
         *!/
        getSuggestions: function(text, callback) {
            /!* @type {Suggestion[]} *!/
            var results = [];
            Object.keys(foods).forEach(key => {
                if(new RegExp('^' + text, 'gi').test(foods[key].name)) results.push(new suggest.Suggestion(foods[key].name, foods[key]));
            });
            setTimeout(function() {
                callback(results);
            }, 300);
        },
        /!**
         * @param {Suggestion} suggestion
         *!/
        getSelectedSuggestion: function(suggestion) {
            PubSub.publish(events.FOOD_SELECT, suggestion.data);
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

    function foodSelected(message, food) {
        ingrid.add(food);
    }

    PubSub.subscribe(events.FOOD_SELECT, foodSelected);

    new suggest.Suggest(document.getElementById('suggest_container'), server.getSuggestions, server.getSelectedSuggestion);
})();
*/
