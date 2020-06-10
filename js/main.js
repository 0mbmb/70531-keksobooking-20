'use strict';

var SIMILAR_NUMBER = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_SIZE = ['50', '70'];
var propertyPinsList = document.querySelector('.map__pins');
var propertyPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

function getRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeClassFromElement(classToRemove, elementToRemoveFrom) {
  document.querySelector('.' + elementToRemoveFrom).classList.remove(classToRemove);
}

function createSimilarPropertiesList() {
  var similarList = [];
  for (var i = 0; i < SIMILAR_NUMBER; i++) {
    similarList[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        address: getRandomIntFromRange(0, 600) + ', ' + getRandomIntFromRange(0, 350),
        price: getRandomIntFromRange(500, 1000),
        type: getRandomFromArray(TYPES),
        rooms: getRandomIntFromRange(1, 5),
        guests: getRandomIntFromRange(1, 10),
        checkin: getRandomFromArray(CHECKIN),
        checkout: getRandomFromArray(CHECKOUT),
        features: getRandomFromArray(FEATURES),
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

function createSinglePropertyPin(propertyData) {
  var pin = propertyPinTemplate.cloneNode(true);
  var pinImage = pin.querySelector('img');

  pin.style.left = (propertyData.location.x - PIN_SIZE[0] / 2) + 'px';
  pin.style.top = (propertyData.location.y - PIN_SIZE[1]) + 'px';
  pinImage.src = propertyData.author.avatar;
  pinImage.alt = propertyData.offer.title;
  return pin;
}

function renderSimilarPropertyPins(propertiesData) {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < propertiesData.length; i++) {
    var similarProperty = createSinglePropertyPin(propertiesData[i]);
    pinsFragment.appendChild(similarProperty);
  }
  propertyPinsList.appendChild(pinsFragment);
}

removeClassFromElement('map--faded', 'map');
var similarProperties = createSimilarPropertiesList();
renderSimilarPropertyPins(similarProperties);
