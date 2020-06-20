'use strict';

(function () {

  var mainPin = document.querySelector('.map__pin--main');

  function onMainPinClick(evt) {
    window.util.onLeftMouseClick(evt, enablePage);
  }

  function onMainPinKeydown(evt) {
    window.util.onEnterKeydown(evt, enablePage);
  }

  function enablePage() {
    if (!window.util.isMapActive()) {
      var similarProperties = window.data.createSimilarPropertiesList();
      window.map.renderAllPins(similarProperties);
    }
    window.map.enableMap();
    window.form.enableAdForm();
  }

  window.map.disableMapFilter();
  window.form.disableAdForm();
  window.form.displayAddress();

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinKeydown);

})();
