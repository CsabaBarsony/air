'use strict';
/* global suggest, describe, it, expect, beforeEach */

describe('Suggest', function() {
    var Suggest   = suggest.Suggest;
    var Direction = suggest.Direction;
    
    describe('selectSuggestion()', function() {
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
                var result = Suggest.selectSuggestion(suggestions, Direction.UP);
                expect(result[2]).toEqual({ text: 'third', selected: true });
            });

            it('select the previous suggestion and deselect the actual', function() {
                suggestions[2].selected = true;
                expected[1].selected = true;
                var result = Suggest.selectSuggestion(suggestions, Direction.UP);
                expect(result).toEqual(expected);
            });

            it('deselect the first suggestion when the first is selected', function() {
                suggestions[0].selected = true;
                var result = Suggest.selectSuggestion(suggestions, Direction.UP);
                expect(result).toEqual(expected);
            });
        });

        describe('on direction \'down\' should', function() {
            it('select the first suggestion when none is selected', function() {
                expected[0].selected = true;
                var result = Suggest.selectSuggestion(suggestions, Direction.DOWN);
                expect(result).toEqual(expected);
            });

            it('select the next suggestion and deselect the actual', function() {
                suggestions[0].selected = true;
                expected[1].selected = true;
                var result = Suggest.selectSuggestion(suggestions, Direction.DOWN);
                expect(result).toEqual(expected);
            });

            it('deselect the last suggestion when the last is selected', function() {
                suggestions[2].selected = true;
                var result = Suggest.selectSuggestion(suggestions, Direction.DOWN);
                expect(result).toEqual(expected);
            });
        });

        describe('should throw Error when', function() {
            it('suggestions contain more selected', function() {
                suggestions[0].selected = true;
                suggestions[1].selected = true;
                expect(function() { Suggest.selectSuggestion(suggestions, Direction.UP); }).toThrow(new Error('more than one suggestion is selected'));
            });
        });
    });
});
