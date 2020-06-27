'use strict';

(function () {

  // TODO: добавить карту для фильтра по цене

  var mapFilter = document.querySelector('.map__filters-container');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');
  var mapFilterType = mapFilter.querySelector('#housing-type');
  var mapFilterPrice = mapFilter.querySelector('#housing-price');
  var mapFilterRooms = mapFilter.querySelector('#housing-rooms');
  var mapFilterGuests = mapFilter.querySelector('#housing-guests');

  function disableMapFilter() {
    for (var i = 0; i < Math.max(mapFilterFieldsets.length, mapFilterSelects.length); i++) {
      if (mapFilterFieldsets[i]) {
        mapFilterFieldsets[i].setAttribute('disabled', true);
      }
      if (mapFilterSelects[i]) {
        mapFilterSelects[i].setAttribute('disabled', true);
      }
    }
    mapFilterType.removeEventListener('change', filterByType);
    mapFilterPrice.removeEventListener('change', filterByPrice);
    mapFilterRooms.removeEventListener('change', filterByRooms);
    mapFilterGuests.removeEventListener('change', filterByGuests);
  }

  function enableMapFilter() {
    for (var i = 0; i < Math.max(mapFilterFieldsets.length, mapFilterSelects.length); i++) {
      if (mapFilterFieldsets[i]) {
        mapFilterFieldsets[i].removeAttribute('disabled');
      }
      if (mapFilterSelects[i]) {
        mapFilterSelects[i].removeAttribute('disabled');
      }
    }
    mapFilterType.addEventListener('change', filterByType);
    mapFilterPrice.addEventListener('change', filterByPrice);
    mapFilterRooms.addEventListener('change', filterByRooms);
    mapFilterGuests.addEventListener('change', filterByGuests);
  }

  function filterByType(evt) {
    var filteredData = window.server.propertiesData.filter(function (item) {
      return item.offer.type === evt.target.value;
    });
    window.map.renderAllPins(filteredData);
    window.card.removeAllCards();
  }

  function filterByPrice(evt) {
    var filteredData = window.server.propertiesData.filter(function (item) {
      switch (evt.target.value) {
        case 'any': return true;
        case 'middle': return item.offer.price >= 10000 && item.offer.price < 50000;
        case 'low': return item.offer.price < 10000;
        case 'high': return item.offer.price >= 50000;
        default: return true;
      }
    });
    window.map.renderAllPins(filteredData);
    window.card.removeAllCards();
  }

  function filterByRooms() {
    window.card.removeAllCards();
  }

  function filterByGuests() {
    window.card.removeAllCards();
  }

  window.filter = {
    disableMapFilter: disableMapFilter,
    enableMapFilter: enableMapFilter
  };

})();
