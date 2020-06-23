'use strict';

(function () {

  var GET_URL = 'https://javascript.pages.academy/keksobooking/data';
  var TIMEOUT = 10000;
  var statusCode = {
    OK: 200
  };

  function onError(errorMessage) {
    var node = document.createElement('div');
    node.style = 'position: fixed; left: 0; right: 0; z-index: 100; margin: auto auto; text-align: center; background-color: white;';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  function load(onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === statusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', GET_URL);
    xhr.send();
  }

  window.server = {
    load: load
  };

})();
