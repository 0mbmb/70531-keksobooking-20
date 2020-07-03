'use strict';

(function () {

  var propertyTypeMap = {
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало',
    'flat': 'Квартира'
  };

  function isMapActive() {
    var mapContainer = document.querySelector('.map');
    return !mapContainer.classList.contains('map--faded');
  }

  function onEnterKeydown(evt, executeFunction) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      executeFunction();
    }
  }

  function onEscKeydown(evt, executeFunction) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      executeFunction();
    }
  }

  function onLeftMouseClick(evt, executeFunction) {
    if (evt.button === 0) {
      evt.preventDefault();
      executeFunction();
    }
  }

  function getElementArea(element) {
    var box = element.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      bottom: box.top + pageYOffset + box.height,
      left: box.left + pageXOffset,
      rigth: box.left + pageXOffset + box.width,
      width: box.width
    };
  }

  function compareArrayToArray(firstArray, secondArray) {
    var contains = true;
    for (var i = 0; i < Math.min(firstArray.length, secondArray.length); i++) {
      contains = contains && secondArray.includes(firstArray[i]);
    }
    return firstArray.length === 0 || contains && (firstArray.length <= secondArray.length);
  }

  window.util = {
    propertyTypeMap: propertyTypeMap,
    isMapActive: isMapActive,
    onEnterKeydown: onEnterKeydown,
    onEscKeydown: onEscKeydown,
    onLeftMouseClick: onLeftMouseClick,
    getElementArea: getElementArea,
    compareArrayToArray: compareArrayToArray
  };

})();
