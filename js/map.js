'use strict';

(function () {

  var PIN_SIZE = {
    width: 50,
    height: 70
  };
  var MAIN_PIN_DEFAULT_SIZE = {
    width: 64,
    height: 64
  };
  var MAIN_PIN_ACTIVE_SIZE = {
    width: 64,
    height: 84
  };
  var MAP_AREA = {
    yMin: 130,
    yMax: 630
  };
  var MAX_NUMBER_OF_PINS = 5;

  var mapContainer = document.querySelector('.map');

  var mapPins = mapContainer.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var mainPinDefaultCoords = {
    top: mainPin.style.top,
    left: mainPin.style.left
  };

  function moveMainPinToDefault() {
    mainPin.style.top = mainPinDefaultCoords.top;
    mainPin.style.left = mainPinDefaultCoords.left;
  }

  var adFormAddress = document.querySelector('input[name=address]');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function getPinCoordinates() {
    var xOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE.width / 2 : MAIN_PIN_DEFAULT_SIZE.width / 2;
    var yOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE.height : MAIN_PIN_DEFAULT_SIZE.height / 2;

    return {
      x: parseInt(mainPin.style.left, 10) + xOffset,
      y: parseInt(mainPin.style.top, 10) + yOffset
    };
  }

  function displayAddress() {
    var pinCoordinates = getPinCoordinates();
    adFormAddress.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function createSinglePin(propertyData) {
    var pin = pinTemplate.cloneNode(true);
    var pinImage = pin.querySelector('img');

    pin.classList.add('map__pin--similar');
    pin.style.left = (propertyData.location.x - PIN_SIZE.width / 2) + 'px';
    pin.style.top = (propertyData.location.y - PIN_SIZE.height) + 'px';
    pinImage.src = propertyData.author.avatar ? propertyData.author.avatar : 'img/avatars/default.png';
    pinImage.alt = propertyData.offer.title;
    return pin;
  }

  function onPinClickEnter(pin, propertyData) {
    function onPinClick() {
      window.card.render(propertyData);
      window.card.deactivateAllPins();
      pin.classList.add('map__pin--active');
    }

    pin.addEventListener('click', function (evt) {
      window.util.onLeftMouseClick(evt, onPinClick);
    });

    pin.addEventListener('keydown', function (evt) {
      window.util.onEnterKeydown(evt, onPinClick);
    });
  }

  function removeAllPins() {
    var similarPins = mapPins.querySelectorAll('.map__pin--similar');
    similarPins.forEach(function (pin) {
      pin.remove();
    });
  }

  function renderAllPins(propertiesData) {
    removeAllPins();
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < Math.min(propertiesData.length, MAX_NUMBER_OF_PINS); i++) {
      if (propertiesData[i].offer) {
        var similarPropertyPin = createSinglePin(propertiesData[i]);
        pinsFragment.appendChild(similarPropertyPin);

        onPinClickEnter(similarPropertyPin, propertiesData[i]);
      }
    }
    mapPins.appendChild(pinsFragment);
  }

  function enable() {
    mapContainer.classList.remove('map--faded');

    window.filter.enable();
  }

  function disable() {
    mapContainer.classList.add('map--faded');

    window.filter.disable();
    window.card.removeAllCards();
    removeAllPins();
    moveMainPinToDefault();
    displayAddress();
  }

  function onMainPinDrag(evt) {
    evt.preventDefault();

    var mapArea = window.util.getElementArea(mapPins);

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

      function isCursorOutside() {
        return mainPin.offsetLeft + MAIN_PIN_ACTIVE_SIZE.width / 2 + delta.x < 0 ||
          mainPin.offsetLeft + MAIN_PIN_ACTIVE_SIZE.width / 2 + delta.x > mapArea.width ||
          mainPin.offsetTop + MAIN_PIN_ACTIVE_SIZE.height + delta.y < MAP_AREA.yMin ||
          mainPin.offsetTop + MAIN_PIN_ACTIVE_SIZE.height + delta.y > MAP_AREA.yMax;
      }

      if (isCursorOutside()) {
        mainPin.style.left = mainPin.offsetLeft + 'px';
        mainPin.style.top = mainPin.offsetTop + 'px';
        startCoord = {
          x: moveEvt.clientX - delta.x,
          y: moveEvt.clientY - delta.y
        };
      } else {
        mainPin.style.left = mainPin.offsetLeft + delta.x + 'px';
        mainPin.style.top = mainPin.offsetTop + delta.y + 'px';
        startCoord = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
      }
      displayAddress();
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
    displayAddress: displayAddress,
    renderAllPins: renderAllPins,
    removeAllPins: removeAllPins,
    enable: enable,
    disable: disable,
    onMainPinDrag: onMainPinDrag
  };

})();
