'use strict';

(function () {

  var filter = document.querySelector('.map__filters-container');
  var filterFieldsets = filter.querySelectorAll('fieldset');
  var filterSelects = filter.querySelectorAll('select');

  var filterForm = filter.querySelector('.map__filters');

  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelectorAll('input[name=features]');

  function resetFilter() {
    filterForm.reset();
  }

  function disable() {
    resetFilter();
    for (var i = 0; i < Math.max(filterFieldsets.length, filterSelects.length); i++) {
      if (filterFieldsets[i]) {
        filterFieldsets[i].setAttribute('disabled', true);
      }
      if (filterSelects[i]) {
        filterSelects[i].setAttribute('disabled', true);
      }
    }
    filterForm.removeEventListener('change', filterAll);
  }

  function enable() {
    for (var i = 0; i < Math.max(filterFieldsets.length, filterSelects.length); i++) {
      if (filterFieldsets[i]) {
        filterFieldsets[i].removeAttribute('disabled');
      }
      if (filterSelects[i]) {
        filterSelects[i].removeAttribute('disabled');
      }
    }
    filterForm.addEventListener('change', filterAll);
  }

  function filterByType(item) {
    return item.offer.type === filterType.value || filterType.value === 'any';
  }

  function filterByPrice(item) {
    switch (filterPrice.value) {
      case 'any': return true;
      case 'middle': return item.offer.price >= 10000 && item.offer.price < 50000;
      case 'low': return item.offer.price < 10000;
      case 'high': return item.offer.price >= 50000;
      default: return true;
    }
  }

  function filterByRooms(item) {
    switch (filterRooms.value) {
      case 'any': return true;
      case '1': return item.offer.rooms === 1;
      case '2': return item.offer.rooms === 2;
      case '3': return item.offer.rooms === 3;
      default: return true;
    }
  }

  function filterByGuests(item) {
    switch (filterGuests.value) {
      case 'any': return true;
      case '0': return item.offer.guests === 100;
      case '1': return item.offer.guests === 1;
      case '2': return item.offer.guests === 2;
      default: return true;
    }
  }

  function filterByFeatures(item) {
    var currentFeatures = [];

    Array.from(filterFeatures).map(function (it) {
      if (it.checked) {
        currentFeatures.push(it.value);
      }
    });

    return window.util.compareArrayToArray(currentFeatures, item.offer.features);
  }

  // проверить debounce
  function filterAll() {
    window.debounce(function () {
      var filteredData = window.server.propertiesData
        .filter(filterByType)
        .filter(filterByPrice)
        .filter(filterByRooms)
        .filter(filterByGuests)
        .filter(filterByFeatures);
      window.map.renderAllPins(filteredData);
      window.card.removeAllCards();
    })();
  }

  window.filter = {
    disable: disable,
    enable: enable
  };

})();
