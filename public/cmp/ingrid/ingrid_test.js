describe('Ingrid', function() {
    var addClick = function(e) {};
    var ingredients = [
        {
            food: 'food 1',
            editing: false,
            amount: 1,
            unit: 'g'
        },
        {
            food: 'food 2',
            editing: false,
            amount: 2,
            unit: 'g'
        },
        {
            food: 'food 3',
            editing: false,
            amount: 3,
            unit: 'g'
        }
    ];

    describe('render() with no selected item should render', function() {
        var ingredientList = Ingrid.render(ingredients, addClick);

        it('ul', function() {
            expect(ingredientList.tagName.toLowerCase()).toBe('ul');
        });

        it('3 li in ul', function() {
            expect(ingredientList.children.length).toBe(3);
        });
    });

    describe('render() with a selected item should render', function() {
        ingredients[0].editing = true;
        var ingredientList = Ingrid.render(ingredients, addClick);

        it('input field', function() {
            expect(ingredientList.children[0].querySelector('input')).not.toBeNull();
        });

        it('select', function() {
            expect(ingredientList.children[0].querySelector('select')).not.toBeNull();
        });
    });
});