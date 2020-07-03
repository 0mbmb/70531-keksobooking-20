'use strict';

(function () {

  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var PRICE_MAX = 1000000;
  var IMAGE_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var minPriceMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('fieldset');

  var formAvatar = form.querySelector('.ad-form-header__preview img');
  var avatarDefaultImg = formAvatar.src;
  var formAvatarInput = form.querySelector('.ad-form-header__input');

  var formTitle = form.querySelector('#title');
  var formPrice = form.querySelector('#price');
  var formAddress = form.querySelector('input[name=address]');
  var formRooms = form.querySelector('#room_number');
  var formCapacity = form.querySelector('#capacity');
  var formType = form.querySelector('#type');
  var formCheckin = form.querySelector('#timein');
  var formCheckout = form.querySelector('#timeout');
  var checkoutOptions = Array.from(formCheckout.options);
  var checkinOptions = Array.from(formCheckin.options);

  var formImageContainer = form.querySelector('.ad-form__photo-container');
  var formImageTemplate = form.querySelector('.ad-form__photo');
  var formImageInput = form.querySelector('.ad-form__input');

  var formReset = form.querySelector('.ad-form__reset');

  var mainRoot = document.querySelector('main');

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  function setAvatarToDefault() {
    formAvatar.src = avatarDefaultImg;
  }

  function validateGuests() {
    var currentRooms = Number(formRooms.value);
    var currentCapacity = Number(formCapacity.value);

    for (var i = 0; i < formCapacity.length; i++) {
      var capacityItem = Number(formCapacity[i].value);
      if (currentRooms === 100 && capacityItem === 0) {
        formCapacity[i].removeAttribute('disabled');
        if (currentCapacity === capacityItem) {
          formCapacity.setCustomValidity('');
        }
      } else if (currentRooms === 100) {
        formCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          formCapacity.setCustomValidity('100 комнат не подходят для размещения гостей.');
        }
      } else if (currentRooms < capacityItem && capacityItem !== 0) {
        formCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          formCapacity.setCustomValidity('Количество гостей не может быть больше количества комнат.');
        }
      } else if (capacityItem === 0) {
        formCapacity[i].setAttribute('disabled', true);
        if (currentCapacity === capacityItem) {
          formCapacity.setCustomValidity('Выберите хотя бы одного гостя.');
        }
      } else {
        formCapacity[i].removeAttribute('disabled');
        if (currentCapacity === capacityItem) {
          formCapacity.setCustomValidity('');
        }
      }
    }
  }

  function validateTitle() {
    if (formTitle.validity.tooShort) {
      formTitle.setCustomValidity('Минимальная длина: ' + TITLE_MIN_LENGTH + '. Максимальная длина: ' + TITLE_MAX_LENGTH + '. Осталось ввести: ' + (TITLE_MIN_LENGTH - formTitle.value.length));
    } else if (formTitle.validity.tooLong) {
      formTitle.setCustomValidity('Максимальная длина: ' + TITLE_MAX_LENGTH + '. Осталось удалить: ' + (formTitle.value.length - TITLE_MAX_LENGTH));
    } else if (formTitle.validity.valueMissing) {
      formTitle.setCustomValidity('Обязательное поле');
    } else {
      formTitle.setCustomValidity('');
    }
  }

  function validatePrice() {
    var currentType = formType.value;
    var minPrice = 0;
    minPrice = minPriceMap[currentType];

    formPrice.setAttribute('min', minPrice);
    formPrice.setAttribute('placeholder', 'от ' + minPrice + ' руб.');

    if (formPrice.validity.rangeOverflow) {
      formPrice.setCustomValidity('Максимальная цена: ' + PRICE_MAX);
    } else if (formPrice.validity.rangeUnderflow) {
      formPrice.setCustomValidity('Минимальная цена для типа жилья «' + window.util.propertyTypeMap[formType.value].toLowerCase() + '»: ' + minPrice);
    } else if (formPrice.validity.valueMissing) {
      formPrice.setCustomValidity('Обязательное поле');
    } else {
      formPrice.setCustomValidity('');
    }
  }

  function validateCheckinCheckout(evt) {
    var optionValue = evt ? evt.target.value : formCheckin.value;

    checkoutOptions.forEach(function (option, i) {
      option.selected = (option.value === optionValue) ? true : false;
      checkinOptions[i].selected = (option.value === optionValue) ? true : false;
    });
  }

  function onCapacityChange() {
    formCapacity.setCustomValidity('');
  }

  function validateForm() {
    validateGuests();
    validateTitle();
    validatePrice();
    validateCheckinCheckout();
  }

  function resetForm() {
    disable();
    form.reset();
    setAvatarToDefault();
    removeImages();
    window.map.disable();
  }

  function onAvatarChange() {
    var file = formAvatarInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = IMAGE_FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        formAvatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function removeImages() {
    var images = formImageContainer.querySelectorAll('.ad-form__photo');
    images.forEach(function (image) {
      image.remove();
    });
    formImageContainer.appendChild(formImageTemplate);
  }

  function onImageChange() {
    var file = formImageInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = IMAGE_FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var newImageContainer = formImageTemplate.cloneNode(true);
        var newImage = newImageContainer.querySelector('img');
        newImage.src = reader.result;
        newImage.style.width = '100%';
        formImageContainer.appendChild(newImageContainer);
        formImageTemplate.remove();
      });

      reader.readAsDataURL(file);
    }
  }

  function disable() {
    formFieldsets.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', true);
    });

    form.classList.add('ad-form--disabled');

    formAvatarInput.removeEventListener('change', onAvatarChange);
    formTitle.removeEventListener('input', validateTitle);
    formPrice.removeEventListener('input', validatePrice);
    formRooms.removeEventListener('change', validateGuests);
    formType.removeEventListener('change', validatePrice);
    formCheckin.removeEventListener('change', validateCheckinCheckout);
    formCheckout.removeEventListener('change', validateCheckinCheckout);
    formCapacity.removeEventListener('change', onCapacityChange);
    formImageInput.removeEventListener('change', onImageChange);
    formReset.removeEventListener('click', resetForm);
  }

  function enable() {
    formFieldsets.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    formAddress.setAttribute('readonly', true);
    form.classList.remove('ad-form--disabled');

    window.map.displayAddress();

    validateForm();

    formAvatarInput.addEventListener('change', onAvatarChange);
    formTitle.addEventListener('input', validateTitle);
    formPrice.addEventListener('input', validatePrice);
    formType.addEventListener('change', validatePrice);
    formRooms.addEventListener('change', validateGuests);
    formCheckin.addEventListener('change', validateCheckinCheckout);
    formCheckout.addEventListener('change', validateCheckinCheckout);
    formCapacity.addEventListener('change', onCapacityChange);
    formImageInput.addEventListener('change', onImageChange);
    formReset.addEventListener('click', resetForm);

    form.addEventListener('submit', onFormSubmit);
  }

  function onSubmitSuccess(successMessage) {
    var successWindow = successTemplate.cloneNode(true);
    var successMessageContainer = successWindow.querySelector('.success__message');
    successWindow.setAttribute('tabindex', 0);
    successMessageContainer.textContent = successMessage;
    mainRoot.appendChild(successWindow);
    successWindow.focus();

    function closeSuccess() {
      successWindow.remove();
    }

    function onSuccessEscape(evt) {
      window.util.onEscKeydown(evt, closeSuccess);
    }

    function onSuccessClick(evt) {
      window.util.onLeftMouseClick(evt, closeSuccess);
    }

    successWindow.addEventListener('keydown', onSuccessEscape);
    successWindow.addEventListener('click', onSuccessClick);

    resetForm();
  }

  function onSubmitError(errorMessage) {
    var errorWindow = errorTemplate.cloneNode(true);
    var errorMessageContainer = errorWindow.querySelector('.error__message');
    var errorClose = errorWindow.querySelector('.error__button');
    errorMessageContainer.textContent = errorMessage;
    mainRoot.appendChild(errorWindow);
    errorClose.focus();

    function closeError() {
      errorWindow.remove();
    }

    function onErrorEscape(evt) {
      window.util.onEscKeydown(evt, closeError);
    }

    function onErrorClick(evt) {
      window.util.onLeftMouseClick(evt, closeError);
    }

    errorWindow.addEventListener('keydown', onErrorEscape);
    errorWindow.addEventListener('click', onErrorClick);
  }

  function onFormSubmit(evt) {
    var formData = new FormData(form);
    window.server.save(formData, onSubmitSuccess, onSubmitError);
    evt.preventDefault();
  }

  window.form = {
    disable: disable,
    enable: enable
  };

})();
