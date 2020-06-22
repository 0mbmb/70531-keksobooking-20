'use strict';

(function () {

  var SIMILAR_NUMBER = 8;
  var TYPES = {
    palace: 'Дворец',
    house: 'Дом',
    bungalo: 'Бунгало',
    flat: 'Квартира'
  };
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  function createSimilarPropertiesList() {
    var similarList = [];
    for (var i = 0; i < SIMILAR_NUMBER; i++) {
      similarList[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          address: window.util.getRandomIntFromRange(0, 600) + ', ' + window.util.getRandomIntFromRange(0, 350),
          price: window.util.getRandomIntFromRange(500, 5000),
          type: window.util.getRandomFromArray(Object.keys(TYPES)),
          rooms: window.util.getRandomIntFromRange(1, 5),
          guests: window.util.getRandomIntFromRange(2, 10),
          checkin: window.util.getRandomFromArray(CHECKIN),
          checkout: window.util.getRandomFromArray(CHECKOUT),
          features: window.util.removeRandomItemsFromArray(FEATURES),
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          photos: PHOTOS
        },
        location: {
          x: window.util.getRandomIntFromRange(0, 1200),
          y: window.util.getRandomIntFromRange(130, 630)
        }
      };
    }
    return similarList;
  }

  window.data = {
    createSimilarPropertiesList: createSimilarPropertiesList
  };

})();
