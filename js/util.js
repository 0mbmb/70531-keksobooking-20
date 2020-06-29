'use strict';

(function () {

  var propertyTypeMap = {
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало',
    'flat': 'Квартира'
  };

  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function removeRandomItemsFromArray(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      if (window.util.getRandomIntFromRange(0, 1)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  }

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

  window.util = {
    propertyTypeMap: propertyTypeMap,
    getRandomFromArray: getRandomFromArray,
    getRandomIntFromRange: getRandomIntFromRange,
    removeRandomItemsFromArray: removeRandomItemsFromArray,
    isMapActive: isMapActive,
    onEnterKeydown: onEnterKeydown,
    onEscKeydown: onEscKeydown,
    onLeftMouseClick: onLeftMouseClick,
    getElementArea: getElementArea
  };

})();
