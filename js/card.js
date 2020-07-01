'use strict';

(function () {

  var mapContainer = document.querySelector('.map');
  var mapFilter = mapContainer.querySelector('.map__filters-container');

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  function renderCardTextElement(propertyCard, propertyData, dataKey1, dataKey2, elementClass) {
    var textElement = propertyCard.querySelector('.' + elementClass);
    textElement.textContent = propertyData[dataKey1][dataKey2] ? propertyData[dataKey1][dataKey2] : '';
  }

  function renderCardPrice(propertyCard, propertyData) {
    var priceElement = propertyCard.querySelector('.popup__text--price');
    priceElement.innerHTML = propertyData.offer.price ? propertyData.offer.price + ' \u20BD<span>/ночь</span>' : '';
  }

  function renderCardType(propertyCard, propertyData) {
    var typeElement = propertyCard.querySelector('.popup__type');
    typeElement.textContent = propertyData.offer.type ? window.util.propertyTypeMap[propertyData.offer.type] : '';
  }

  function renderCardAvatar(propertyCard, propertyData) {
    var avatarElement = propertyCard.querySelector('.popup__avatar');
    avatarElement.src = propertyData.author.avatar ? propertyData.author.avatar : 'img/avatars/default.png';
  }

  function renderCardCapacity(propertyCard, propertyData) {
    var capacityElement = propertyCard.querySelector('.popup__text--capacity');
    capacityElement.textContent = '';
    if (propertyData.offer.rooms) {
      capacityElement.textContent = propertyData.offer.rooms + ' комнаты';
      if (propertyData.offer.guests) {
        capacityElement.textContent += ' для ' + propertyData.offer.guests + ' гостей';
      }
    } else if (propertyData.offer.guests) {
      capacityElement.textContent = 'Для ' + propertyData.offer.guests + ' гостей';
    }
  }

  function renderCardTime(propertyCard, propertyData) {
    var timeElement = propertyCard.querySelector('.popup__text--time');
    timeElement.textContent = '';
    if (propertyData.offer.checkin) {
      timeElement.textContent = 'Заезд после ' + propertyData.offer.checkin;
      if (propertyData.offer.checkout) {
        timeElement.textContent += ', выезд до ' + propertyData.offer.checkout;
      }
    } else if (propertyData.offer.checkout) {
      timeElement.textContent = 'Выезд до ' + propertyData.offer.checkout;
    }
  }

  function renderCardFeatures(propertyCard, propertyData) {
    var featuresList = propertyCard.querySelector('.popup__features');
    var featuresFragment = document.createDocumentFragment();

    propertyData.offer.features.forEach(function (feature) {
      var currentFeature = featuresList.querySelector('.popup__feature--' + feature).cloneNode();
      featuresFragment.appendChild(currentFeature);
    });
    featuresList.innerHTML = '';
    featuresList.appendChild(featuresFragment);
  }

  function renderCardImages(propertyCard, propertyData) {
    var photosContainer = propertyCard.querySelector('.popup__photos');
    var photosFragment = document.createDocumentFragment();
    var imageThumbnailTemplate = photosContainer.querySelector('.popup__photo');
    for (var i = 0; i < propertyData.offer.photos.length; i++) {
      var imageThumbnail = imageThumbnailTemplate.cloneNode(true);
      imageThumbnail.src = propertyData.offer.photos[i];
      photosFragment.appendChild(imageThumbnail);
    }
    photosContainer.appendChild(photosFragment);
    imageThumbnailTemplate.remove();
  }

  function createSinglePropertyCard(propertyData) {
    var propertyCard = cardTemplate.cloneNode(true);

    renderCardAvatar(propertyCard, propertyData);
    renderCardTextElement(propertyCard, propertyData, 'offer', 'title', 'popup__title');
    renderCardTextElement(propertyCard, propertyData, 'offer', 'address', 'popup__text--address');
    renderCardPrice(propertyCard, propertyData);
    renderCardType(propertyCard, propertyData);
    renderCardCapacity(propertyCard, propertyData);
    renderCardTime(propertyCard, propertyData);
    renderCardFeatures(propertyCard, propertyData);
    renderCardTextElement(propertyCard, propertyData, 'offer', 'description', 'popup__description');
    renderCardImages(propertyCard, propertyData);

    return propertyCard;
  }

  function deactivateAllPins() {
    var similarPins = mapContainer.querySelectorAll('.map__pin--similar');
    similarPins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  }

  function removeAllCards() {
    var allCards = mapContainer.querySelectorAll('.map__card');
    allCards.forEach(function (card) {
      card.remove();
    });
  }

  function render(propertyData) {
    removeAllCards();
    var newCard = createSinglePropertyCard(propertyData);
    var newCardClose = newCard.querySelector('.popup__close');
    mapContainer.insertBefore(newCard, mapFilter);

    function removeNewCard() {
      newCard.remove();
      deactivateAllPins();
    }

    newCardClose.addEventListener('click', function (evt) {
      window.util.onLeftMouseClick(evt, removeNewCard);
    });

    newCardClose.addEventListener('keydown', function (evt) {
      window.util.onEnterKeydown(evt, removeNewCard);
    });

    mapContainer.addEventListener('keydown', function (evt) {
      window.util.onEscKeydown(evt, removeNewCard);
    });
  }

  window.card = {
    render: render,
    removeAllCards: removeAllCards,
    deactivateAllPins: deactivateAllPins
  };

})();
