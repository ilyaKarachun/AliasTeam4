const getGameButtons = document.querySelectorAll('#join-game-button');

const getGame = (button) => {
  try {
    const id = button.dataset.id;
    window.location.href = `/games/${id}`;
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

getGameButtons.forEach((button) => {
  button.addEventListener('click', () => getGame(button));
});
