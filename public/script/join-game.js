const joinTeamContainer = document.querySelector('#join-team-container');

const joinGame = async (e) => {
  try {
    const team = e.target.dataset.id;
    if (!team) {
      return;
    }

    const regex = /\/games\/([a-fA-F0-9]+)/;
    const match = window.location.pathname.match(regex);
    const id = match[1];

    const joinGameRequest = await fetch(
      `/api/v1/games/${id}/join?team=${team}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getCookie('alias-token')}`,
        },
      },
    );
    const res = await joinGameRequest.json();

    if (!joinGameRequest.ok) {
      throw new Error(res.error);
    }

    window.location.replace(`/chat/${id}`);
  } catch (e) {
    alert(e);
    console.error(e);
  }
};
joinTeamContainer.addEventListener('click', joinGame);
