console.log('Hello');
const socket = io();

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOMContentLoaded');
  if (document.getElementById('usersList')) {
    // Ask server for users data
    socket.emit('want-users-list');

    // Listen for users array replacement from server.
    socket.on('users-list', function (usersArray) {
      var listElement = document.getElementById('usersList');
      if (listElement) {
        // For each user in Users array...
        usersArray.forEach((user) => {
          const newElement = document.createElement('li');
          newElement.textContent = user.username;
          listElement.appendChild(newElement);
        });
      }
    });
  }

  if (document.getElementById('searchesList')) {
    // Ask server for searches data
    socket.emit('want-searches-list');

    // Listen for users array replacement from server.
    socket.on('searches-list', function (searchesArray) {
      var listElement = document.getElementById('searchesList');
      if (listElement) {
        // For each user in Users array...
        searchesArray.forEach((search) => {
          const newElement = document.createElement('li');
          newElement.textContent = search.keyword + ' ' + search.url + ' ' + search.matches + ' ' + search.date;
          listElement.appendChild(newElement);
        });
      }
    });
  }
});
