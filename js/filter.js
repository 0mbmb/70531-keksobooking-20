'use strict';

(function () {

  // TODO: добавить map для фильтра по цене

  var mapFilter = document.querySelector('.map__filters-container');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');

  var mapFilterForm = mapFilter.querySelector('.map__filters');

  var mapFilterType = mapFilterForm.querySelector('#housing-type');
  var mapFilterPrice = mapFilterForm.querySelector('#housing-price');
  var mapFilterRooms = mapFilterForm.querySelector('#housing-rooms');
  var mapFilterGuests = mapFilterForm.querySelector('#housing-guests');
  var mapFilterFeatures = mapFilterForm.querySelectorAll('input[name=features]');

  function resetFilter() {
    mapFilterForm.reset();
  }

  function disableMapFilter() {
    resetFilter();
    for (var i = 0; i < Math.max(mapFilterFieldsets.length, mapFilterSelects.length); i++) {
      if (mapFilterFieldsets[i]) {
        mapFilterFieldsets[i].setAttribute('disabled', true);
      }
      if (mapFilterSelects[i]) {
        mapFilterSelects[i].setAttribute('disabled', true);
      }
    }
    mapFilterForm.removeEventListener('change', filterAll);
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
    mapFilterForm.addEventListener('change', filterAll);
  }

  function filterByType(item) {
    return item.offer.type === mapFilterType.value || mapFilterType.value === 'any';
  }

  function filterByPrice(item) {
    switch (mapFilterPrice.value) {
      case 'any': return true;
      case 'middle': return item.offer.price >= 10000 && item.offer.price < 50000;
      case 'low': return item.offer.price < 10000;
      case 'high': return item.offer.price >= 50000;
      default: return true;
    }
  }

  function filterByRooms(item) {
    switch (mapFilterRooms.value) {
      case 'any': return true;
      case '1': return item.offer.rooms === 1;
      case '2': return item.offer.rooms === 2;
      case '3': return item.offer.rooms === 3;
      default: return true;
    }
  }

  function filterByGuests(item) {
    switch (mapFilterGuests.value) {
      case 'any': return true;
      case '0': return item.offer.guests === 100;
      case '1': return item.offer.guests === 1;
      case '2': return item.offer.guests === 2;
      default: return true;
    }
  }

  function filterByFeatures(item) {
    var currentFeatures = [];

    Array.from(mapFilterFeatures).map(function (it) {
      if (it.checked) {
        currentFeatures.push(it.value);
      }
    });

    return window.util.compareArrayToArray(currentFeatures, item.offer.features);
  }

  var filterAll = window.debounce(function () {
    var filteredData = window.server.propertiesData
      .filter(filterByType)
      .filter(filterByPrice)
      .filter(filterByRooms)
      .filter(filterByGuests)
      .filter(filterByFeatures);
    window.map.renderAllPins(filteredData);
    window.card.removeAllCards();
  });

  window.filter = {
    disableMapFilter: disableMapFilter,
    enableMapFilter: enableMapFilter
  };

})();
