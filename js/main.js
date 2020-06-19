'use strict';

var mainPin = document.querySelector('.map__pin--main');

function onMainPinClick(evt) {
  if (evt.button === 0) {
    enablePage();
  }
}

function onMainPinKeydown(evt) {
  if (evt.key === 'Enter') {
    enablePage();
  }
}

function enablePage() {
  if (!window.util.isMapActive()) {
    var similarProperties = window.data.createSimilarPropertiesList();
    window.map.renderAllPins(similarProperties);
    window.card.renderAllCards(similarProperties);
  }
  window.map.enableMap();
  window.form.enableAdForm();
}

window.map.disableMapFilter();
window.form.disableAdForm();
window.form.displayAddress();

mainPin.addEventListener('mousedown', onMainPinClick);
mainPin.addEventListener('keydown', onMainPinKeydown);
