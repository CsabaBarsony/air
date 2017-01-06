'use strict';
//globals: scion, Handlebars

function Suggest(container, onType, onSelect) {
    var suggestions = [];
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
                onType(input.value, function(incomingList) {
                    // Entry point of list, maybe a type check would be necessary
                    pendingLoadings--;
                    // TODO: right sequence of callbacks is not guaranteed
                    if(pendingLoadings === 0) {
                        var suggestions = incomingList.map((item) => {
                            item.selected = false;
                            return item;
                        });
                        sc.gen('load', suggestions);
                    }
                });
            },
            exit: function() {
                suggestField.innerHTML = '';
            }
        },
        suggesting: {
            entry: function(e) {
                suggestions = e.data;
                render();
            }
        },
        excited: {
            entry: function(e) {
                suggestions = Suggest.selectSuggestion(suggestions, e.data);
                render();
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

    var sc = new scion.Statechart({ states: states }, { logStatesEnteredAndExited: false });
    sc.start();

    var suggestContainer = document.createElement('div');
    suggestContainer.addEventListener('keydown', function(e) {
        var selected;
        suggestions.forEach((s) => {
            if(s.selected) selected = s;
        });
        if(e.key === 'Enter') {
            sc.gen('choose', selected);
        }
    });
    suggestContainer.className += 'suggest';
    container.appendChild(suggestContainer);

    var input = Suggest.renderInput(function() {
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

    var suggestField = Suggest.renderSuggestField();

    suggestContainer.appendChild(suggestField);

    function render() {
        var template = `
            <ul>
                {{#each suggestions}}
                <li{{#if selected}} class="selected"{{/if}}>{{text}}</li>
                {{/each}}            
            </ul>`;
        suggestField.innerHTML = Handlebars.compile(template)({ suggestions: suggestions });
    }
}

Suggest.renderInput = function(onFocus, onBlur, onInput, onKeydown) {
    var input = document.createElement('input');
    input.className += 'suggest_input';
    input.onfocus = onFocus;
    input.onblur = onBlur;
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);
    return input;
};

Suggest.renderSuggestField = function() {
    var suggestField = document.createElement('div');
    suggestField.className += 'suggest_field';
    suggestField.style.display = 'none';
    return suggestField;
};

/**
 * @param {Array} suggestions Array of suggestions
 * @param {string} direction 'up' or 'down'
 * @returns {Array} Array of suggestions
 */
Suggest.selectSuggestion = function(suggestions, direction) {
    if(!Array.isArray(suggestions) || suggestions.length === 0) throw new Error('Suggestions parameter should be an array containing at least one element.');
    if(!(direction === 'up' || direction === 'down')) throw new Error('Direction parameter should be \'up\' or \'down\'.');
    var selected, selectedIndex, first, last, count = 0;
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
