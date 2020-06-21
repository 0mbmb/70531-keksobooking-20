'use strict';

(function () {

  var PIN_SIZE = ['50', '70'];

  var mapContainer = document.querySelector('.map');

  var mapPins = mapContainer.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var mapFilter = mapContainer.querySelector('.map__filters-container');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function createSinglePin(propertyData) {
    var pin = pinTemplate.cloneNode(true);
    var pinImage = pin.querySelector('img');

    pin.classList.add('map__pin--similar');
    pin.style.left = (propertyData.location.x - PIN_SIZE[0] / 2) + 'px';
    pin.style.top = (propertyData.location.y - PIN_SIZE[1]) + 'px';
    pinImage.src = propertyData.author.avatar ? propertyData.author.avatar : 'img/avatars/default.png';
    pinImage.alt = propertyData.offer.title;
    return pin;
  }

  function onPinClickEnter(pin, propertyData) {
    function onPinRenderCard() {
      window.card.renderSingleCard(propertyData);
    }

    pin.addEventListener('click', function (evt) {
      window.util.onLeftMouseClick(evt, onPinRenderCard);
    });

    pin.addEventListener('keydown', function (evt) {
      window.util.onEnterKeydown(evt, onPinRenderCard);
    });
  }

  function renderAllPins(propertiesData) {
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < propertiesData.length; i++) {
      var similarPropertyPin = createSinglePin(propertiesData[i]);
      // similarPropertyPin.setAttribute('data-id', i);
      pinsFragment.appendChild(similarPropertyPin);

      onPinClickEnter(similarPropertyPin, propertiesData[i]);
    }
    mapPins.appendChild(pinsFragment);
  }

  function disableMapFilter() {
    for (var i = 0; i < Math.max(mapFilterFieldsets.length, mapFilterSelects.length); i++) {
      if (mapFilterFieldsets[i]) {
        mapFilterFieldsets[i].setAttribute('disabled', true);
      }
      if (mapFilterSelects[i]) {
        mapFilterSelects[i].setAttribute('disabled', true);
      }
    }
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
  }

  function enableMap() {
    mapContainer.classList.remove('map--faded');

    enableMapFilter();
  }

  function onMainPinDrag(evt) {
    evt.preventDefault();

    var startCoord = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var delta = {
        x: moveEvt.clientX - startCoord.x,
        y: moveEvt.clientY - startCoord.y
      };

      mainPin.style.top = mainPin.offsetTop + delta.y + 'px';
      mainPin.style.left = mainPin.offsetLeft + delta.x + 'px';

      window.form.displayAddress();

      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.map = {
    renderAllPins: renderAllPins,
    disableMapFilter: disableMapFilter,
    enableMap: enableMap,
    onMainPinDrag: onMainPinDrag
  };

})();
