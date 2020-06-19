'use strict';

(function () {

  window.util = {
    getRandomFromArray: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    getRandomIntFromRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    removeRandomItemsFromArray: function (array) {
      var newArray = [];
      for (var i = 0; i < array.length; i++) {
        if (window.util.getRandomIntFromRange(0, 1)) {
          newArray.push(array[i]);
        }
      }
      return newArray;
    },
    isMapActive: function () {
      var mapContainer = document.querySelector('.map');
      return !mapContainer.classList.contains('map--faded');
    },
    onEnterClick: function (evt, executeFunction) {
      if (evt.key === 'Enter') {
        executeFunction();
      }
    }
  };

})();
