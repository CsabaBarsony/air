'use strict';
/* global scion, Handlebars */

var suggest = function() {
    /**
     * Suggest component
     *
     * @param {HTMLElement} container
     * @param {function(string, function)} onType
     * @param {function(Food)} onSelect
     * @constructor
     */
    function Suggest(container, onType, onSelect) {
        this.suggestions = [];
        this.container = container;
        var pendingLoadings = 0;
        var actions = {
            visible: {
                entry: function() {
                    suggestField.style.display = 'block';
                },
                exit: function() {
                    suggestField.style.display = 'none';

                }
            },
            loading: {
                entry: function() {
                    pendingLoadings++;
                    suggestField.innerHTML = 'loading...';
                    onType(input.value, function(suggestions) {
                        pendingLoadings--;
                        // TODO: right sequence of callbacks is not guaranteed
                        if(pendingLoadings === 0) sc.gen('load', suggestions);
                    });
                },
                exit: function() {
                    suggestField.innerHTML = '';
                }
            },
            suggesting: {
                entry: (e) => {
                    this.suggestions = e.data;
                    this.render();
                }
            },
            excited: {
                entry: (e) => {
                    this.suggestions = Suggest.selectSuggestion(this.suggestions, e.data);
                    this.render();
                }
            },
            blur: {
                entry: function() {
                    suggestField.innerHTML = '';
                    suggestField.style.display = 'none';
                }
            },
            chosen: {
                entry: function(e) {
                    onSelect(e.data);
                    input.value = '';
                    suggestField.innerHTML = '';
                }
            }
        };
        var states = [
            {
                id: 'blur',
                onEntry: actions.blur.entry,
                transitions: [
                    {
                        event: 'select',
                        target: 'focus'
                    }
                ]
            },
            {
                id: 'focus',
                transitions: [
                    {
                        event: 'unselect',
                        target: 'blur'
                    }
                ],
                states: [
                    {
                        id: 'hidden',
                        transitions: [
                            {
                                event: 'type',
                                target: 'loading'
                            }
                        ]
                    },
                    {
                        id: 'visible',
                        onEntry: actions.visible.entry,
                        onExit: actions.visible.exit,
                        states: [
                            {
                                id: 'loading',
                                onEntry: actions.loading.entry,
                                onExit: actions.loading.exit,
                                transitions: [
                                    {
                                        event: 'load',
                                        target: 'typing'
                                    },
                                    {
                                        event: 'clear',
                                        target: 'hidden'
                                    },
                                    {
                                        event: 'type',
                                        target: 'loading'
                                    }
                                ]
                            },
                            {
                                id: 'suggesting',
                                onEntry: actions.suggesting.entry,
                                transitions: [
                                    {
                                        event: 'type',
                                        target: 'loading'
                                    },
                                    {
                                        event: 'clear',
                                        target: 'hidden'
                                    },
                                    {
                                        event: 'choose',
                                        target: 'chosen'
                                    }
                                ],
                                states: [
                                    {
                                        id: 'typing',
                                        transitions: [
                                            {
                                                event: 'excite',
                                                target: 'excited'
                                            }
                                        ]
                                    },
                                    {
                                        id: 'excited',
                                        onEntry: actions.excited.entry,
                                        transitions: [
                                            {
                                                event: 'excite',
                                                target: 'excited'
                                            },
                                            {
                                                event: 'bore',
                                                target: 'typing'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'chosen',
                        onEntry: actions.chosen.entry,
                        transitions: [
                            {
                                event: 'type',
                                target: 'loading'
                            }
                        ]
                    }
                ]
            }
        ];

        var sc = new scion.Statechart({ states: states }, { logStatesEnteredAndExited: true });
        sc.start();

        var suggestContainer = document.createElement('div');
        suggestContainer.addEventListener('keydown', (e) => {
            var selected = false;
            this.suggestions.forEach((s) => {
                if(s.selected) selected = s;
            });
            if(e.key === 'Enter') {
                sc.gen('choose', selected);
            }
        });
        suggestContainer.className += 'suggest';
        container.appendChild(suggestContainer);

        var input = renderInput(function() {
            sc.gen('select');
        }, function() {
            sc.gen('unselect');
        }, function(e) {
            if(e.target.value === '') {
                sc.gen('clear');
            }
            else {
                sc.gen('type');
            }
        }, function(e) {
            if(e.key === 'ArrowDown') {
                sc.gen('excite', 'down');
            }
            else if(e.key === 'ArrowUp') {
                sc.gen('excite', 'up');
            }
        });

        suggestContainer.appendChild(input);

        var suggestField = renderSuggestField();

        suggestContainer.appendChild(suggestField);
    }

    function renderInput(onFocus, onBlur, onInput, onKeydown) {
        var input = document.createElement('input');
        input.className += 'suggest_input';
        input.onfocus = onFocus;
        input.onblur = onBlur;
        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeydown);
        return input;
    }

    function renderSuggestField() {
        var suggestField = document.createElement('div');
        suggestField.className += 'suggest_field';
        suggestField.style.display = 'none';
        return suggestField;
    }

    Suggest.prototype.render = function() {
        var suggestField = this.container.querySelector('.suggest_field');
        var template = `
            <ul>
                {{#each suggestions}}
                <li{{#if selected}} class="selected"{{/if}}>{{text}}</li>
                {{/each}}
            </ul>`;
        suggestField.innerHTML = Handlebars.compile(template)({ suggestions: this.suggestions });
    };

    /**
     * @param {Suggestion[]} suggestions
     * @param {Direction} direction
     * @returns {Suggestion[]}
     */
    Suggest.selectSuggestion = function(suggestions, direction) {
        var selected = null, selectedIndex = null, first, last, count = 0;
        suggestions.forEach((s, i) => {
            if(s.selected) {
                count++;
                selected = s;
                selectedIndex = i;
                if(i === 0) first = true;
                else if(i === suggestions.length - 1) last = true;
            }
        });
        if(count > 1) throw new Error('more than one suggestion is selected');
        if(!selected) {
            if(direction === 'up') {
                suggestions[suggestions.length - 1].selected = true;
            }
            else {
                suggestions[0].selected = true;
            }
        }
        else {
            selected.selected = false;
            if(direction === 'up' && !first) {
                suggestions[selectedIndex - 1].selected = true;
            }
            else if(direction === 'down' && !last) {
                suggestions[selectedIndex + 1].selected = true;
            }
        }
        return suggestions;
    };

    /**
     * @param {string} text
     * @param {Object} [data]
     * @constructor
     */
    function Suggestion(text, data) {
        this.text = text;
        this.data = data;
        this.selected = false;
    }

    /**
     * @enum {string}
     */
    var Direction = {
        UP: 'up',
        DOWN: 'down'
    };

    return {
        Suggest: Suggest,
        Suggestion: Suggestion,
        Direction: Direction
    };
}();
