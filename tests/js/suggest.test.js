describe('Suggest', function() {
    describe('selectSuggestion', function() {
        var suggestions;

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
        });

        it('should select the first suggestion on direction \'down\' when none is selected', function() {
            var result = Suggest.selectSuggestion(suggestions, 'down');
            expect(result[0]).toEqual({ text: 'first', selected: true });
        });

        it('should select the last suggestion on direction \'up\' when none is selected', function() {
            var result = Suggest.selectSuggestion(suggestions, 'up');
            expect(result[2]).toEqual({ text: 'third', selected: true });
        });

        it('should select the next suggestion on direction \'down\' and deselect the actual', function() {
            suggestions[0].selected = true;
            var result = Suggest.selectSuggestion(suggestions, 'down');
            expect(result[0]).toEqual({ text: 'first', selected: false });
            expect(result[1]).toEqual({ text: 'second', selected: true });
        });

        it('should select the previous suggestion on direction \'up\' and deselect the actual', function() {
            suggestions[2].selected = true;
            var result = Suggest.selectSuggestion(suggestions, 'up');
            expect(result[2]).toEqual({ text: 'third', selected: false });
            expect(result[1]).toEqual({ text: 'second', selected: true });
        });

        it('should throw Error when suggestions parameter is not array or empty array', function() {
            var errorMessage = 'Suggestions parameter should be an array containing at least one element.';
            expect(function() { Suggest.selectSuggestion([], 'up'); }).toThrow(new Error(errorMessage));
            expect(function() { Suggest.selectSuggestion('I am an array - no, I am joking.', 'up'); }).toThrow(new Error(errorMessage));
        });

        it('should throw Error when direction is different than \'up\' or \'down\'', function() {
            expect(function() { Suggest.selectSuggestion(suggestions, 'left'); }).toThrow(new Error('Direction parameter should be \'up\' or \'down\'.'));
        });

        it('should throw Error when suggestions contain more selected', function() {
            suggestions[0].selected = true;
            suggestions[1].selected = true;
            expect(function() { Suggest.selectSuggestion(suggestions, 'up'); }).toThrow(new Error('more than one suggestion is selected'));
        });
    });
});
