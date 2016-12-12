'use strict';
//globals: scion

function Suggest(container, onType, onSelect, options) {
    if(!options) options = {
        logStatesEnteredAndExited: false
    };
    var suggestions = [];
    var chart = {
        states: [
            {
                id: 'blur',
                onEntry: onBlurEntry,
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
                        onEntry: onVisibleEntry,
                        onExit: onVisibleExit,
                        states: [
                            {
                                id: 'loading',
                                onEntry: onLoadingEntry,
                                onExit: onLoadingExit,
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
                                onEntry: onSuggestingEntry,
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
                                        onEntry: onExcitedEntry,
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
                        onEntry: onChosenEntry,
                        transitions: [
                            {
                                event: 'type',
                                target: 'loading'
                            }
                        ]
                    }
                ]
            }
        ]
    };
    var sc = new scion.Statechart(chart, { logStatesEnteredAndExited: options.logStatesEnteredAndExited });
    sc.start();

    var suggestContainer = document.createElement('div');
    suggestContainer.addEventListener('keydown', function(e) {
        var selected;
        suggestions.forEach((s) => {
            if(s.selected) selected = s.text;
        });
        if(e.key === 'Enter') sc.gen('choose', selected);
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

    function onVisibleEntry() {
        suggestField.style.display = 'block';
    }

    function onVisibleExit() {
        suggestField.style.display = 'none';
    }

    var pendingLoadings = 0;

    function onLoadingEntry() {
        pendingLoadings++;
        suggestField.innerHTML = 'loading...';
        onType(input.value, function(suggestions) {
            pendingLoadings--;
            // TODO: right sequence of callbacks is not guaranteed
            if(pendingLoadings === 0) {
                sc.gen('load', suggestions);
            }
        });
    }

    function onLoadingExit() {
        suggestField.innerHTML = '';
    }

    function onSuggestingEntry(e) {
        suggestions = e.data.map(function(d) {
            return {
                text: d,
                selected: false
            };
        });
        var list = document.createElement('ul');
        suggestions.forEach((s) => {
            var listElement = document.createElement('li');
            listElement.innerHTML = s.text;
            list.appendChild(listElement);
        });
        suggestField.innerHTML = '';
        suggestField.appendChild(list);
    }

    function onExcitedEntry(e) {
        var newSuggestions = Suggest.selectSuggestion(suggestions, e.data);
        var list = document.createElement('ul');
        newSuggestions.forEach((s) => {
            var listElement = document.createElement('li');
            listElement.innerHTML = s.text;
            if(s.selected) listElement.className += 'selected';
            list.appendChild(listElement);
        });
        suggestField.innerHTML = '';
        suggestField.appendChild(list);
    }

    function onBlurEntry() {
        suggestField.innerHTML = '';
        suggestField.style.display = 'none';
    }

    function onChosenEntry(e) {
        onSelect(e.data);
        input.value = e.data;
        suggestField.innerHTML = '';
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
