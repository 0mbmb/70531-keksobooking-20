'use strict';

(function () {

  var mainPin = document.querySelector('.map__pin--main');
  // var propertiesData = [];

  function onMainPinClick(evt) {
    window.util.onLeftMouseClick(evt, enablePage);
    window.map.onMainPinDrag(evt);
  }

  function onMainPinKeydown(evt) {
    window.util.onEnterKeydown(evt, enablePage);
  }

  function onLoadSuccess(propertiesData) {
    window.server.propertiesData = propertiesData;
    window.map.renderAllPins(propertiesData);
  }

  function enablePage() {
    if (!window.util.isMapActive()) {
      window.server.load(onLoadSuccess);
      window.map.enableMap();
      window.form.enableAdForm();
    }
  }

  window.filter.disableMapFilter();
  window.form.disableAdForm();
  window.map.displayAddress();

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinKeydown);

})();
