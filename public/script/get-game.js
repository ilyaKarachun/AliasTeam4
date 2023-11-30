const getGameButton = document.querySelector('.join-game-button');

const getGame = async () => {
  try {
    const id = getGameButton.dataset.id;
    window.location.href = `/games/${id}`;
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

getGameButton.addEventListener('click', getGame);
