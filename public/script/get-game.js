const getGameButtons = document.querySelector('.join-game-button');

const getGame = async (e) => {
  try {
    const id = e.target.dataset.id;

    const getGameRequest = await fetch(`/api/v1/games/${id}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getCookie('alias-token')}`,
      },
    });
    const res = await getGameRequest.json();

    if (getGameRequest.ok) {
      res.redirect(`/games/${id}`);
    } else {
      throw new Error(res.error);
    }
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

getGameButtons.addEventListener('click', getGame);
