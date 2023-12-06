const gameName = document.querySelector('#game-name');
const team = document.querySelector('#team-number');
const level = document.querySelector('#level');
const createGameButton = document.querySelector('#create-game-button');

const createGame = async () => {
  try {
    if (!gameName.value) {
      alert('Name for game is required!');
    } else {
      const body = {
        name: gameName.value,
        teamSize: Number(team.value),
        gameLevel: level.value,
      };

      const createGameRequest = await fetch(`/api/v1/games/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('alias-token')}`,
        },
        body: JSON.stringify(body),
      });

      const res = await createGameRequest.json();

      if (createGameRequest.ok) {
        const gameId = res.gameID;
        localStorage.setItem('gameId', `${gameId}`);
        window.location.href = `/chat/${gameId},
        )}`;
      } else {
        throw new Error(res.error);
      }
    }
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

createGameButton.addEventListener('click', createGame);
