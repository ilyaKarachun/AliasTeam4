const messagesContainer = document.querySelector('#message-container');
const messageInput = document.querySelector('#message-input');
const authToken = getCookie('alias-token');

const getSocketConnection = () => {
  try {
    const regex = /\/chat\/([a-fA-F0-9]+)/;
    const match = window.location.pathname.match(regex);
    const id = match[1];

    return new WebSocket(
      `ws://${window.location.host}/api/v1/games/${id}/chat?token=${authToken}`,
    );
  } catch (e) {
    alert('Something went wrong while socket connection!');
  }
};

const socket = getSocketConnection();

document.forms['messages-form'].onsubmit = function () {
  const outgoingMessage = this.message.value;
  socket.send(outgoingMessage);
  messageInput.value = '';

  return false;
};

socket.onmessage = function (event) {
  const message = event.data;
  const messageElem = document.createElement('div');
  messageElem.classList.add('message');
  messageElem.textContent = message;

  messagesContainer.prepend(messageElem);
};
