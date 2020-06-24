'use strict';

(function () {

  var mainPin = document.querySelector('.map__pin--main');

  function onMainPinClick(evt) {
    window.util.onLeftMouseClick(evt, enablePage);
    window.map.onMainPinDrag(evt);
  }

  function onMainPinKeydown(evt) {
    window.util.onEnterKeydown(evt, enablePage);
  }

  function enablePage() {
    if (!window.util.isMapActive()) {
      window.server.load(window.map.renderAllPins);
      window.map.enableMap();
      window.form.enableAdForm();
    }
  }

  window.map.disableMapFilter();
  window.form.disableAdForm();
  window.map.displayAddress();

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinKeydown);

})();
