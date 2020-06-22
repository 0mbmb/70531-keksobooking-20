'use strict';

(function () {

  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var PRICE_MAX = 1000000;

  var MAIN_PIN_DEFAULT_SIZE = [62, 62];
  var MAIN_PIN_ACTIVE_SIZE = [62, 84];

  var TYPES = {
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунгало',
    flat: 'Квартира'
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormTitle = adForm.querySelector('#title');
  var adFormPrice = adForm.querySelector('#price');
  var adFormAddress = adForm.querySelector('input[name=address]');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormType = adForm.querySelector('#type');

  var adFormCheckin = adForm.querySelector('#timein');
  var adFormCheckout = adForm.querySelector('#timeout');

  var mainPin = document.querySelector('.map__pin--main');

  function getPinCoordinates() {
    var xOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE[0] / 2 : MAIN_PIN_DEFAULT_SIZE[0] / 2;
    var yOffset = window.util.isMapActive() ? MAIN_PIN_ACTIVE_SIZE[1] : MAIN_PIN_DEFAULT_SIZE[1] / 2;

    return [parseInt(mainPin.style.left, 10) + xOffset, parseInt(mainPin.style.top, 10) + yOffset];
  }

  function displayAddress() {
    var pinCoordinates = getPinCoordinates();
    adFormAddress.value = pinCoordinates[0] + ', ' + pinCoordinates[1];
  }

  function validateGuests() {
    var currentRooms = parseInt(adFormRooms.value, 10);
    var currentCapacity = parseInt(adFormCapacity.value, 10);

    for (var i = 0; i < adFormCapacity.length; i++) {
      var capacityItem = parseInt(adFormCapacity[i].value, 10);
      if (currentRooms === 100 && capacityItem === 0) {
        adFormCapacity[i].removeAttribute('disabled');
        if (currentCapacity === capacityItem) {
          adFormCapacity.setCustomValidity('');
        }
      } else if (currentRooms === 100) {
        adFormCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          adFormCapacity.setCustomValidity('100 комнат не подходят для размещения гостей.');
        }
      } else if (currentRooms < capacityItem && capacityItem !== 0) {
        adFormCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          adFormCapacity.setCustomValidity('Количество гостей не может быть больше количества комнат.');
        }
      } else if (capacityItem === 0) {
        adFormCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          adFormCapacity.setCustomValidity('Выберите хотя бы одного гостя.');
        }
      } else {
        adFormCapacity[i].removeAttribute('disabled');
        if (currentCapacity === capacityItem) {
          adFormCapacity.setCustomValidity('');
        }
      }
    }
  }

  function validateTitle() {
    if (adFormTitle.validity.tooShort) {
      adFormTitle.setCustomValidity('Минимальная длина: ' + TITLE_MIN_LENGTH + '. Максимальная длина: ' + TITLE_MAX_LENGTH + '. Осталось ввести: ' + (TITLE_MIN_LENGTH - adFormTitle.value.length));
    } else if (adFormTitle.validity.tooLong) {
      adFormTitle.setCustomValidity('Максимальная длина: ' + TITLE_MAX_LENGTH + '. Осталось удалить: ' + (adFormTitle.value.length - TITLE_MAX_LENGTH));
    } else if (adFormTitle.validity.valueMissing) {
      adFormTitle.setCustomValidity('Обязательное поле');
    } else {
      adFormTitle.setCustomValidity('');
    }
  }

  function validatePrice() {
    var currentType = adFormType.value;
    var minPrice = 0;
    switch (currentType) {
      case 'bungalo':
        minPrice = 0;
        break;
      case 'flat':
        minPrice = 1000;
        break;
      case 'house':
        minPrice = 5000;
        break;
      case 'palace':
        minPrice = 10000;
        break;
    }
    adFormPrice.setAttribute('min', minPrice);
    adFormPrice.setAttribute('placeholder', 'от ' + minPrice + ' руб.');

    if (adFormPrice.validity.rangeOverflow) {
      adFormPrice.setCustomValidity('Максимальная цена: ' + PRICE_MAX);
    } else if (adFormPrice.validity.rangeUnderflow) {
      adFormPrice.setCustomValidity('Минимальная цена для типа жилья «' + TYPES[adFormType.value].toLowerCase() + '»: ' + minPrice);
    } else if (adFormPrice.validity.valueMissing) {
      adFormPrice.setCustomValidity('Обязательное поле');
    } else {
      adFormPrice.setCustomValidity('');
    }
  }

  function validateCheckinCheckout(evt) {
    var optionValue = evt ? evt.target.value : adFormCheckin.value;

    for (var i = 0; i < adFormCheckout.options.length; i++) {
      adFormCheckout.options[i].selected = false;
      adFormCheckin.options[i].selected = false;
      if (adFormCheckout.options[i].value === optionValue) {
        adFormCheckout.options[i].selected = true;
        adFormCheckin.options[i].selected = true;
      }
    }
  }

  function validateForm() {
    displayAddress();
    validateGuests();
    validateTitle();
    validatePrice();
    validateCheckinCheckout();
  }

  function disableAdForm() {
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].setAttribute('disabled', true);
    }
    adForm.classList.add('ad-form--disabled');

    adFormTitle.removeEventListener('input', validateTitle);
    adFormPrice.removeEventListener('input', validatePrice);
    adFormRooms.removeEventListener('change', validateGuests);
    adFormType.removeEventListener('change', validatePrice);
    adFormCheckin.removeEventListener('change', validateCheckinCheckout);
    adFormCheckout.removeEventListener('change', validateCheckinCheckout);
  }

  function enableAdForm() {
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].removeAttribute('disabled');
    }
    adFormAddress.setAttribute('disabled', true);
    adForm.classList.remove('ad-form--disabled');

    validateForm();

    adFormTitle.addEventListener('input', validateTitle);
    adFormPrice.addEventListener('input', validatePrice);
    adFormRooms.addEventListener('change', validateGuests);
    adFormType.addEventListener('change', validatePrice);
    adFormCheckin.addEventListener('change', validateCheckinCheckout);
    adFormCheckout.addEventListener('change', validateCheckinCheckout);

    // удалить этот обработчик:
    adFormCapacity.addEventListener('change', function () {
      adFormCapacity.setCustomValidity('');
    });
  }

  window.form = {
    displayAddress: displayAddress,
    disableAdForm: disableAdForm,
    enableAdForm: enableAdForm
  };

})();
