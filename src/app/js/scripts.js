/*
Select - Code by Zsolt Kiraly
v1.0.9 - 2018-03-29
*/

var select = function() {

    if (!Element.prototype.matches)
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                    Element.prototype.webkitMatchesSelector;
                                    
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1); 
            return null;
        };
    }

    function show(element, placeholder) {
        element.classList.remove('hide');
        placeholder.setAttribute('arrow', 'active');

        setTimeout(function() {
            element.classList.add('show');
        }, 50);
    }

    function hide(element, placeholder) {
        element.classList.remove('show');
        placeholder.removeAttribute('arrow');
        element.classList.add('hide');
    }

    function selectDOM(globalClass, config) {
        var i = 0,
            lenDOM = globalClass.length;

        if(lenDOM > 0) {
            for(; i < lenDOM; i++) {

                var containers = globalClass[i],
                    selects = containers.querySelector('select.real-select');

                if(selects) {
                    var selectName = selects.getAttribute('name'),
                        selectId = selects.getAttribute('id');

                    var newSelectDiv = document.createElement('DIV');

                    newSelectDiv.setAttribute('data-name', selectName);
                    newSelectDiv.setAttribute('data-id', selectId);
                    newSelectDiv.setAttribute('class', 'select-element');
                    containers.appendChild(newSelectDiv);

                    newSelectDiv.innerHTML = '<div class="select-placeholder"></div><div class="select-options"><ul></ul></div>';

                    var ulDOM = newSelectDiv.querySelector('ul');
                    
                    var options = selects.querySelectorAll('option'),
                        stop = 0;

                    while (stop < options.length) {
                        ulDOM.innerHTML += '<li class="selected-element"><span></span></li>';
                        stop++;
                    }

                    selects.classList.remove('real-select');
                }

            }
        }

        var selectLis = document.querySelectorAll('.' + config.selectGlobalClass + ' li'),
            selectOps = document.querySelectorAll('.' + config.selectGlobalClass + ' option');

        var selectLiArray = [],
            i = 0,
            lenList = selectLis.length;
        if(lenList > 0) {
            for(; i < lenList; i++) {
                var selectLi = selectLis[i];
                selectLiArray.push(selectLi);
            }
        }

        var dataValueArray = [],
            i = 0,
            lenOps = selectOps.length,
            liArrayLen = selectLiArray.length;

        if(lenOps > 0 && liArrayLen > 0) {
            for(; i < lenOps && liArrayLen; i++) {
                var selectOp = selectOps[i],
                    select = selectLiArray[i],
                    selectSpan = selectLiArray[i].querySelector('span');

                dataValueArray.push(selectOp);

                var liContent = selectOp.innerHTML,
                    selectValue = selectOp.value;

                select.setAttribute('data-value', selectValue);
                selectSpan.innerHTML = liContent;

                var placeholder = select.closest('.select-element').querySelector('.select-placeholder');

                if(selectOp.getAttribute('selected','selected') && selectOp.getAttribute('value') == select.getAttribute('data-value')) {
                    var liInnerHtml = select.innerHTML;
                    placeholder.innerHTML = liInnerHtml;

                    if(select.getAttribute('data-value') !== config.defaultTag) {
                        select.classList.add('selected'); 
                    }
                }

                select.addEventListener('click', function() {

                    var obj = this;

                    var placeholder = obj.closest('.select-element').querySelector('.select-placeholder'),
                        liElement = obj.closest('ul').querySelectorAll('li'),
                        optionElement = obj.closest('.' + config.selectGlobalClass + '').querySelectorAll('select option'),
                        selectOptions = obj.closest('.select-options');

                    if(config.selectOpenAlways == false) {
                        hide(selectOptions, placeholder);
                    }

                    var i = 0,
                        lenLiElement = liElement.length,
                        lenOptionElement = optionElement.length;

                    if(lenLiElement > 0 && lenOptionElement > 0) {
                        for(; i < lenLiElement && lenOptionElement; i++) {

                            var liElements = liElement[i];
                            var optionElements = optionElement[i];

                            if(obj.getAttribute('data-value') == optionElements.getAttribute('value')) {
                                optionElements.selected = true;
                                optionElements.setAttribute('selected','selected');

                            } else {
                                optionElements.removeAttribute('selected','');
                                optionElements.selected = false;
                            }

                            if(optionElements.getAttribute('selected','selected') && optionElements.getAttribute('value') == liElements.getAttribute('data-value')) {
                                if(liElements.getAttribute('data-value') !== config.defaultTag) {
                                    liElements.classList.add('selected');
                                }

                                placeholder.innerHTML = liElements.innerHTML;

                            } else {
                                liElements.classList.remove('selected');
                            }
                        }
                    }
                }, false);
            }
        }
    }

    function toggler(globalClass, config) {
        var i = 0,
            lenTog = globalClass.length,
            globalClassArray = [];

        if(lenTog > 0) {
            for(; i < lenTog; i++) {

                var containers = globalClass[i],
                    placeholderElement = containers.querySelector('.select-placeholder'),
                    selectElement = containers.querySelector('.select-options');

                globalClassArray.push(containers);
                selectElement.classList.add('hide');

                placeholderElement.addEventListener('click', function(){

                    var obj = this;

                    if(config.selectOneExpand == true) {

                        var i = 0,
                        lenToggler = globalClassArray.length;

                        if(lenToggler > 0) {
                            for(; i < lenToggler; i++) {

                                var togglerContent = globalClassArray[i],
                                    selectElementList = togglerContent.querySelector('.select-element'),
                                    placeholderList = selectElementList.querySelector('.select-placeholder'),
                                    optionsList = selectElementList.querySelector('.select-options');

                                if(placeholderList == obj) {
                                    if(optionsList.classList.contains('hide')) {
                                        show(optionsList, placeholderList);

                                    } else {
                                        hide(optionsList, placeholderList);
                                    }

                                } else {
                                    hide(optionsList, placeholderList);
                                }
                            }
                        }
                    }

                    var objOptions = obj.closest('.select-element').querySelector('.select-options');

                    if(config.selectOneExpand == false) {
                        if(objOptions.classList.contains('hide')) {
                            show(objOptions, obj);

                        } else {
                            hide(objOptions, obj);
                        }
                    }

                }, false);
            }
        }
    }

    function closeAll(globalClass, config) {
        document.addEventListener('click', function(event) {
            var i = 0,
                lenClose = globalClass.length;

            if(lenClose > 0) {
                for(; i < lenClose; i++) {
                    var containers = globalClass[i],
                        placeholderTarget = containers.querySelector('.select-placeholder'),
                        selectOptionsTarget = containers.querySelector('.select-options');

                    if(config.selectAllClose == true) {
                        if(event.target !== placeholderTarget.querySelector('span') && event.target.className !== 'select-placeholder' && event.target.className !== 'selected-element selected') {
                            hide(selectOptionsTarget, placeholderTarget);
                        }
                    }
                }
            }
        }, false);
    }

    function app(config) {
        var globalClass = document.querySelectorAll('div.' + config.selectGlobalClass);

        if(globalClass) {
            selectDOM(globalClass, config);
            toggler(globalClass, config);
            closeAll(globalClass, config);
        }
    }

    return {
        app:app
    }

}();