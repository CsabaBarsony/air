'use strict';
// globals: PubSub

(function(){
    const events = {
        FOOD_SELECT: 'FOOD_SELECT',
        INGREDIENTS_CHANGE: 'INGREDIENTS_CHANGE'
    };
    const foods = [
        "asparagus",
        "apples",
        "avocado",
        "alfalfa",
        "almond",
        "arugala",
        "artichoke",
        "applesauce",
        "antelope",
        "albacore tuna",
        "Apple juice",
        "Avocado roll",
        "Bruscetta",
        "bacon",
        "black beans",
        "bagels",
        "baked beans",
        "BBQ",
        "bison",
        "barley",
        "beer",
        "bisque",
        "bluefish",
        "bread",
        "broccoli",
        "buritto",
        "babaganoosh",
        "Cabbage",
        "cake",
        "carrots",
        "carne asada",
        "celery",
        "cheese",
        "chicken",
        "catfish",
        "chips",
        "chocolate",
        "chowder",
        "clams",
        "coffee",
        "cookies",
        "corn",
        "cupcakes",
        "crab",
        "curry",
        "cereal",
        "chimichanga",
        "dates",
        "dips",
        "duck",
        "dumplings",
        "donuts",
        "eggs",
        "enchilada",
        "eggrolls",
        "English muffins",
        "edimame",
        "eel sushi",
        "fajita",
        "falafel",
        "franks",
        "fondu",
        "French toast",
        "French dip",
        "Garlic",
        "ginger",
        "gnocchi",
        "goose",
        "granola",
        "grapes",
        "green beans",
        "Guancamole",
        "gumbo",
        "grits",
        "Graham crackers",
        "ham",
        "halibut",
        "honey",
        "huenos rancheros",
        "hash browns",
        "hot dogs",
        "haiku roll",
        "hummus",
        "ice cream",
        "Irish stew",
        "Indian food",
        "Italian bread",
        "jambalaya",
        "jelly / jam",
        "jerky",
        "jalape�o",
        "kale",
        "kabobs",
        "ketchup",
        "kiwi",
        "kidney beans",
        "kingfish",
        "lobster",
        "Lamb",
        "Linguine",
        "Lasagna",
        "Meatballs",
        "Moose",
        "Milk",
        "Milkshake",
        "Noodles",
        "Ostrich",
        "Pizza",
        "Pepperoni",
        "Porter",
        "Pancakes",
        "Quesadilla",
        "Quiche",
        "Reuben",
        "Spinach",
        "Spaghetti",
        "Tater tots",
        "Toast",
        "Venison",
        "Waffles",
        "Wine",
        "Walnuts",
        "Yogurt",
        "Ziti",
        "Zucchini"
    ];

    function onType(text, callback) {
        var regex = new RegExp('^' + text, 'gi');
        var results = [];
        foods.forEach((food) => {
            if(regex.test(food)) results.push(food);
        });
        setTimeout(function() {
            callback(results);
        }, 300);
    }

    function onSelect(foodName) {
        PubSub.publish(events.FOOD_SELECT, foodName);
    }

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
            food: 'avocado',
            editing: true,
            amount: 200,
            unit: Ingrid.units.G
        },
        {
            food: 'broccoli',
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

    Suggest(document.getElementById('suggest_container'), onType, onSelect);
})();
