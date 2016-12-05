'use strict';
//globals: scion

function Suggest(container, callback) {
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
                    }
                ]
            }
        ]
    };
    var sc = new scion.Statechart(chart, { logStatesEnteredAndExited: true });
    sc.start();

    var suggestContainer = document.createElement('div');
    suggestContainer.className += 'suggest';
    container.appendChild(suggestContainer);

    var input = document.createElement('input');
    input.className += 'suggest-input';
    input.onfocus = function() {
        sc.gen('select');
    };
    input.onblur = function() {
        sc.gen('unselect');
    };
    input.addEventListener('input', function(e) {
        if(e.target.value === '') {
            sc.gen('clear');
        }
        else {
            sc.gen('type');
        }
    });
    input.addEventListener('keydown', function(e) {
        if(e.key === 'ArrowDown') {
            sc.gen('excite', 'down');
        }
        else if(e.key === 'ArrowUp') {
            sc.gen('excite', 'up');
        }
    });
    suggestContainer.appendChild(input);

    var suggestField = document.createElement('div');
    suggestField.className += 'suggest-field';
    suggestField.style.display = 'none';
    suggestContainer.appendChild(suggestField);

    function onVisibleEntry() {
        suggestField.style.display = 'block';
    }

    function onVisibleExit() {
        suggestField.style.display = 'none';
    }

    function onLoadingEntry() {
        suggestField.innerHTML = 'loading...';
        var p = new Promise(function(resolve) {
            callback('a', resolve);
        });
        p.then(function(suggestions) {
            sc.gen('load', suggestions);
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
        console.log(e);
    }

    function onBlurEntry() {
        suggestField.innerHTML = '';
        suggestField.style.display = 'none';
    }

    return {
        name: 'I am a Suggest instance'
    };
}

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
            suggestions[2].selected = true;
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
