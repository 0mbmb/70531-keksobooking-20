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

  var mapContainer = document.querySelector('.map');

  var mapPins = mapContainer.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var mapFilter = mapContainer.querySelector('.map__filters-container');
  var mapFilterFieldsets = mapFilter.querySelectorAll('fieldset');
  var mapFilterSelects = mapFilter.querySelectorAll('select');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function getPinCoordinates() {
    var xOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE.width / 2 : MAIN_PIN_DEFAULT_SIZE.width / 2;
    var yOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE.height : MAIN_PIN_DEFAULT_SIZE.height / 2;

    return {
      x: parseInt(mainPin.style.left, 10) + xOffset,
      y: parseInt(mainPin.style.top, 10) + yOffset
    };
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
        if (
          mainPin.offsetLeft + MAIN_PIN_ACTIVE_SIZE.width / 2 + delta.x < 0 ||
          mainPin.offsetLeft + MAIN_PIN_ACTIVE_SIZE.width / 2 + delta.x > mapArea.width ||
          mainPin.offsetTop + MAIN_PIN_ACTIVE_SIZE.height + delta.y < MAP_AREA.yMin ||
          mainPin.offsetTop + MAIN_PIN_ACTIVE_SIZE.height + delta.y > MAP_AREA.yMax
        ) {
          return true;
        }
        return false;
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
      // есть пересечение подключаемых функций между map.js и form.js. такое допустимо,
      // если подключить модуль, который использует подключаемую функцию в обработчике
      // события (т.е. произойдет после загрузки всех модулей), ниже другого? либо
      // стоит избавиться от пересечения, даже если придется продублировать код в одном из модулей?
      window.form.displayAddress();
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
    getPinCoordinates: getPinCoordinates,
    renderAllPins: renderAllPins,
    disableMapFilter: disableMapFilter,
    enableMap: enableMap,
    onMainPinDrag: onMainPinDrag
  };

})();
