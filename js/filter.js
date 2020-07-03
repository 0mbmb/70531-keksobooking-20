'use strict';

(function () {

  var FILTER_DEFAULT = 'any';

  var priceRangeMap = {
    'low': {
      min: 0,
      max: 9999
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50001
    },
    'any': {
      min: 0
    }
  };

  var filter = document.querySelector('.map__filters-container');
  var filterFieldsets = filter.querySelectorAll('fieldset');
  var filterSelects = filter.querySelectorAll('select');
  var maxFieldsetsSelects = Math.max(filterFieldsets.length, filterSelects.length);

  var filterForm = filter.querySelector('.map__filters');

  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelectorAll('input[name=features]');

  function resetFilter() {
    filterForm.reset();
  }

  function disableElement(element) {
    if (element) {
      element.setAttribute('disabled', true);
    }
  }

  function enableElement(element) {
    if (element) {
      element.removeAttribute('disabled');
    }
  }

  function disable() {
    resetFilter();
    for (var i = 0; i < maxFieldsetsSelects; i++) {
      disableElement(filterFieldsets[i]);
      disableElement(filterSelects[i]);
    }
    filterForm.removeEventListener('change', filterAll);
  }

  function enable() {
    for (var i = 0; i < maxFieldsetsSelects; i++) {
      enableElement(filterFieldsets[i]);
      enableElement(filterSelects[i]);
    }
    filterForm.addEventListener('change', filterAll);
  }

  function filterByType(item) {
    return item.offer.type === filterType.value || filterType.value === FILTER_DEFAULT;
  }

  function filterByPrice(item) {
    if (!priceRangeMap[filterPrice.value].max) {
      return item.offer.price >= priceRangeMap[filterPrice.value].min;
    }
    return item.offer.price >= priceRangeMap[filterPrice.value].min && item.offer.price <= priceRangeMap[filterPrice.value].max;
  }

  function filterByRooms(item) {
    return item.offer.rooms === Number(filterRooms.value) || filterRooms.value === FILTER_DEFAULT;
  }

  function filterByGuests(item) {
    return item.offer.guests === Number(filterGuests.value) || filterGuests.value === FILTER_DEFAULT;
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
