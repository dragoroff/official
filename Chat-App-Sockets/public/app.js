var socket = io();

socket.on('connect', () => {

  let uri = window.location.search;
  let params = {};
  uri.replace(
    new RegExp("([^?=&]+)(=([^&#]*))?", "g"),
    ($0, $1, $2, $3) => {
      params[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
    })


  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
    else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', users => {
  let str = "";
  users.forEach(user => {
    str += `<li class="btn btn-primary form-control">${user}</li>`;
  });

  document.querySelector('#users').innerHTML = str;
});

socket.on('newMessage', message => {
  let html = `
  <div class="alert alert-info" role="alert">
    <h4>${message.from}</h4>
    <p>${message.text}</p>
    <span>${message.createdAt}</span>
  </div>
  `
  let msgDiv = document.querySelector('#messages');
  msgDiv.innerHTML = html + msgDiv.innerHTML;
});

socket.on('newLocationMessage', message => {
  let html = `
  <div class="alert alert-info" role="alert">
    <h4>${message.from}</h4>
    <p>
      <a href="${message.url}" target="_blank">My current location</a>
    </p>
    <span>${message.createdAt}</span>
  </div>
  `;
  let msgDiv = document.querySelector('#messages');
  msgDiv.innerHTML = html + msgDiv.innerHTML;

});

let msgSender = document.querySelector('#message-send');
msgSender.addEventListener('click', () => {
  let messageTextbox = document.querySelector('[name=message]');
  socket.emit('createMessage',
    { text: messageTextbox.value },
    () => { messageTextbox.value = ('') });
});

let locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerHTML = ('Sending location...');

  navigator.geolocation.getCurrentPosition(position => {
    locationButton.removeAttribute('disabled');
    locationButton.innerHTML = ('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    locationButton.removeAttribute('disabled');
    locationButton.innerHTML = ('Send location');
    alert('Unable to fetch location.');
  });
});
