'use strict';

var SIMILAR_NUMBER = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_TRANSLATION = {
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало',
  flat: 'Квартира'
};
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_SIZE = ['50', '70'];

var mapContainer = document.querySelector('.map');

var mapPins = mapContainer.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var mapFilter = mapContainer.querySelector('.map__filters-container');

function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeClassFromElement(classToRemove, element) {
  document.querySelector('.' + element).classList.remove(classToRemove);
}

function removeRandomItemsFromArray(array) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    if (getRandomIntFromRange(0, 1)) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}

function createSimilarPropertiesList() {
  var similarList = [];
  for (var i = 0; i < SIMILAR_NUMBER; i++) {
    similarList[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        address: getRandomIntFromRange(0, 600) + ', ' + getRandomIntFromRange(0, 350),
        price: getRandomIntFromRange(500, 5000),
        type: getRandomFromArray(TYPES),
        rooms: getRandomIntFromRange(1, 5),
        guests: getRandomIntFromRange(2, 10),
        checkin: getRandomFromArray(CHECKIN),
        checkout: getRandomFromArray(CHECKOUT),
        features: removeRandomItemsFromArray(FEATURES),
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        photos: PHOTOS
      },
      location: {
        x: getRandomIntFromRange(0, 1200),
        y: getRandomIntFromRange(130, 630)
      }
    };
  }
  return similarList;
}

function createSinglePin(propertyData) {
  var pin = pinTemplate.cloneNode(true);
  var pinImage = pin.querySelector('img');

  pin.style.left = (propertyData.location.x - PIN_SIZE[0] / 2) + 'px';
  pin.style.top = (propertyData.location.y - PIN_SIZE[1]) + 'px';
  pinImage.src = 'img/avatars/default.png';
  if (propertyData.author.avatar) {
    pinImage.src = propertyData.author.avatar;
  }
  pinImage.alt = propertyData.offer.title;
  return pin;
}

function renderAllPins(propertiesData) {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < propertiesData.length; i++) {
    var similarPropertyPin = createSinglePin(propertiesData[i]);
    if (!propertiesData[i].author.avatar) {
      similarPropertyPin.src = 'img/avatars/default.png';
    }
    pinsFragment.appendChild(similarPropertyPin);
  }
  mapPins.appendChild(pinsFragment);
}

function renderCardTextElement(propertyCard, propertyData, dataObjectKey1, dataObjectKey2, elementClass) {
  var textElement = propertyCard.querySelector('.' + elementClass);
  if (propertyData[dataObjectKey1][dataObjectKey2]) {
    textElement.textContent = propertyData[dataObjectKey1][dataObjectKey2];
  } else {
    textElement.textContent = '';
  }
}

function renderCardPrice(propertyCard, propertyData) {
  var priceElement = propertyCard.querySelector('.popup__text--price');
  if (propertyData.offer.price) {
    priceElement.innerHTML = propertyData.offer.price + ' \u20BD<span>/ночь</span>';
  } else {
    priceElement.textContent = '';
  }
}

function renderCardType(propertyCard, propertyData) {
  var typeElement = propertyCard.querySelector('.popup__type');
  typeElement.textContent = propertyData.offer.type ? TYPES_TRANSLATION[propertyData.offer.type] : '';
}

function renderCardAvatar(propertyCard, propertyData) {
  var avatarElement = propertyCard.querySelector('.popup__avatar');
  if (propertyData.author.avatar) {
    avatarElement.src = propertyData.author.avatar;
  } else {
    avatarElement.src = 'img/avatars/default.png';
  }
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
  var features = propertyCard.querySelectorAll('.popup__feature');

  var featuresFragment = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var feature = featuresList.querySelector('.popup__feature--' + propertyData.offer.features[i]);
    if (feature) {
      featuresFragment.appendChild(feature.cloneNode());
    }
    features[i].remove();
  }
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

function renderAllCards(propertiesData) {
  var cardsFragment = document.createDocumentFragment();
  for (var i = 0; i < propertiesData.length; i++) {
    var similarPropertyCard = createSinglePropertyCard(propertiesData[i]);
    cardsFragment.appendChild(similarPropertyCard);
  }
  mapContainer.insertBefore(cardsFragment, mapFilter);
}

removeClassFromElement('map--faded', 'map');
var similarProperties = createSimilarPropertiesList();
renderAllPins(similarProperties);
renderAllCards(similarProperties);
