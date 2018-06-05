console.log('Hello');
const socket = io();

// Ask server for users data
socket.emit('want-users-list');

// Listen for users array replacement from server.
socket.on('users-list', function (usersArray) {
  var listElement = document.getElementById('usersList');
  // For each user in Users array...
  usersArray.forEach((user) => {
    const newElement = document.createElement('li');
    newElement.textContent = user.username;
    listElement.appendChild(newElement);
  });
});

// Ask server for searches data
socket.emit('want-searches-list');

// Listen for users array replacement from server.
socket.on('searches-list', function (searchesArray) {
  var listElement = document.getElementById('searchesList');
  // For each user in Users array...
  searchesArray.forEach((search) => {
    const newElement = document.createElement('li');
    newElement.textContent = search.keyword;
    listElement.appendChild(newElement);
  });
});
