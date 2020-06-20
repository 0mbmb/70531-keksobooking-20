'use strict';

(function () {

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

  window.util = {
    getRandomFromArray: getRandomFromArray,
    getRandomIntFromRange: getRandomIntFromRange,
    removeRandomItemsFromArray: removeRandomItemsFromArray,
    isMapActive: isMapActive
  };

})();
