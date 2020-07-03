'use strict';

(function () {

  var mainPin = document.querySelector('.map__pin--main');

  function onMainPinClick(evt) {
    window.util.onLeftMouseClick(evt, enablePage);
    window.map.onMainPinDrag(evt);
  }

  function onMainPinEnter(evt) {
    window.util.onEnterKeydown(evt, enablePage);
  }

  function onLoadSuccess(propertiesData) {
    window.server.propertiesData = propertiesData;
    window.map.renderAllPins(propertiesData);
  }

  function enablePage() {
    if (!window.util.isMapActive()) {
      window.map.enable();
      window.map.renderAllPins(window.server.propertiesData);
      window.form.enable();
    }
    if (!enablePage.didrun) {
      enablePage.didrun = true;
      window.server.load(onLoadSuccess);
    }
  }

  window.filter.disable();
  window.form.disable();
  window.map.displayAddress();

  mainPin.addEventListener('mousedown', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnter);

})();
