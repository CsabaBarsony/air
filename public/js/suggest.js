'use strict';
//globals: scion

function Suggest(container, callback) {
    var model = {
        states: [
            {
                id: 'blur',
                onEntry: onBlurEntry,
                transitions: [
                    {
                        target: 'focus',
                        event: 'select'
                    }
                ]
            },
            {
                id: 'focus',
                transitions: [
                    {
                        target: 'blur',
                        event: 'unselect'
                    }
                ],
                states: [
                    {
                        id: 'hidden',
                        transitions: [
                            {
                                target: 'loading',
                                event: 'type'
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
                                        target: 'suggesting',
                                        event: 'load'
                                    },
                                    {
                                        target: 'hidden',
                                        event: 'clear'
                                    }
                                ]
                            },
                            {
                                id: 'suggesting',
                                onEntry: onSuggestingEntry,
                                transitions: [
                                    {
                                        target: 'loading',
                                        event: 'type'
                                    },
                                    {
                                        target: 'hidden',
                                        event: 'clear'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
    var sc = new scion.Statechart(model, { logStatesEnteredAndExited: true });
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
        var list = document.createElement('ul');
        e.data.forEach((s) => {
            var listElement = document.createElement('li');
            listElement.innerHTML = s;
            list.appendChild(listElement);
        });
        suggestField.innerHTML = '';
        suggestField.appendChild(list);
    }

    function onBlurEntry() {
        suggestField.innerHTML = '';
        suggestField.style.display = 'none';
    }
}
