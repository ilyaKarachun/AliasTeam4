// const profile = document.querySelector('#profile-page');

const userId = localStorage.getItem('userId');

async function getUserData(userId, accessToken) {
  try {
    const response = await fetch(`/users/${userId}`, {
      method: 'GET',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await response.json();

    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userMail').textContent = userData.mail;
    document.getElementById('userStatus').textContent = userData.status;
    document.getElementById('gameName').textContent = userData.gameName;
    document.getElementById('level').textContent = userData.level;
    document.getElementById('score').textContent = userData.score;
    document.getElementById('won').textContent = userData.won;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
getUserData(userId, accesToken);


document.getElementById('deleteButton').addEventListener('click', async () => {
  if (!userId || !accessToken) {
    console.error('User ID or access token is missing.');
    return;
  }

  const deleteConfirmation = confirm(
    'Are you sure you want to delete your profile?',
  );

  if (deleteConfirmation) {
    try {
      const response = await fetch(`/users/${userId}`, {
        method: 'DELETE',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        alert('User profile deleted successfully.');

        !!!clean ckookie token "this is a special commentary against oblivion"

        localStorage.removeItem('userId');
      } else {
        console.error(
          'Error deleting user profile:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }
});
