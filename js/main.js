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

function removeClassFromClass(removeFrom, remove) {
  document.querySelector('.' + removeFrom).classList.remove(remove);
}

function createSimilarPropertiesList() {
  var similarList = [];
  for (var i = 0; i < SIMILAR_NUMBER; i++) {
    similarList[i] = {
      author: {},
      offer: {},
      location: {}
    };

    similarList[i].author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    similarList[i].offer.title = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    similarList[i].offer.address = getRandomIntFromRange(0, 600) + ', ' + getRandomIntFromRange(0, 350);
    similarList[i].offer.price = getRandomIntFromRange(500, 1000);
    similarList[i].offer.type = getRandomFromArray(TYPES);
    similarList[i].offer.rooms = getRandomIntFromRange(1, 5);
    similarList[i].offer.guests = getRandomIntFromRange(1, 10);
    similarList[i].offer.checkin = getRandomFromArray(CHECKIN);
    similarList[i].offer.checkout = getRandomFromArray(CHECKOUT);
    similarList[i].offer.features = getRandomFromArray(FEATURES);
    similarList[i].offer.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    similarList[i].offer.photos = PHOTOS;

    similarList[i].location.x = getRandomIntFromRange(0, 1200);
    similarList[i].location.y = getRandomIntFromRange(130, 630);
  }
  return similarList;
}

function createSinglePropertyPin(propertyData) {
  var pin = propertyPinTemplate.cloneNode(true);
  var pinImage = pin.querySelector('img'); // pin.children[0] ?

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

removeClassFromClass('map', 'map--faded');
var similarProperties = createSimilarPropertiesList();
renderSimilarPropertyPins(similarProperties);
