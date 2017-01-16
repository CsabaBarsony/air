describe('Suggest', function() {
    var suggestions = ['first', 'second', 'third'].map((s) => {
        return new Suggestion(s);
    });
    var instance = new Suggest(document.createElement('div'), () => {}, () => {}, suggestions);

    it('select suggestion', function() {
        instance.selectSuggestion(suggest.Direction.DOWN);
        expect(ins)
    });

    /*describe('selectSuggestion()', function() {
        var suggestions, expected;

        beforeEach(function() {
            suggestions = [
                {
                    text: 'first',
                    selected: false
                },
                {
                    text: 'second',
                    selected: false
                },
                {
                    text: 'third',
                    selected: false
                }
            ];

            expected = [
                {
                    text: 'first',
                    selected: false
                },
                {
                    text: 'second',
                    selected: false
                },
                {
                    text: 'third',
                    selected: false
                }
            ];
        });

        describe('on direction \'up\' should', function() {
            it('select the last suggestion when none is selected', function() {
                expected[2].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'up');
                expect(result[2]).toEqual({ text: 'third', selected: true });
            });

            it('select the previous suggestion and deselect the actual', function() {
                suggestions[2].selected = true;
                expected[1].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'up');
                expect(result).toEqual(expected);
            });

            it('deselect the first suggestion when the first is selected', function() {
                suggestions[0].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'up');
                expect(result).toEqual(expected);
            });
        });

        describe('on direction \'down\' should', function() {
            it('select the first suggestion when none is selected', function() {
                expected[0].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'down');
                expect(result).toEqual(expected);
            });

            it('select the next suggestion and deselect the actual', function() {
                suggestions[0].selected = true;
                expected[1].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'down');
                expect(result).toEqual(expected);
            });

            it('deselect the last suggestion when the last is selected', function() {
                suggestions[2].selected = true;
                var result = suggest.Suggest.selectSuggestion(suggestions, 'down');
                expect(result).toEqual(expected);
            });
        });

        describe('should throw Error when', function() {
            it('suggestions parameter is not array or is empty array', function() {
                var errorMessage = 'Suggestions parameter should be an array containing at least one element.';
                expect(function() { suggest.Suggest.selectSuggestion([], 'up'); }).toThrow(new Error(errorMessage));
                expect(function() { suggest.Suggest.selectSuggestion('I am an array - no, I am joking.', 'up'); }).toThrow(new Error(errorMessage));
            });

            it('suggestions contain more selected', function() {
                suggestions[0].selected = true;
                suggestions[1].selected = true;
                expect(function() { suggest.Suggest.selectSuggestion(suggestions, 'up'); }).toThrow(new Error('more than one suggestion is selected'));
            });
        });
    });*/
});
