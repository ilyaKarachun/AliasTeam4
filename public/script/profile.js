// const profile = document.querySelector('#profile-page');

const userId = localStorage.getItem('userId');
const accessToken = getCookie('alias-token');

document
  .getElementById('delete-button-profile')
  .addEventListener('click', async () => {
    if (!userId || !accessToken) {
      console.error('User ID or access token is missing.');
      return;
    }

    const deleteConfirmation = confirm(
      'Are you sure you want to delete your profile?',
    );

    if (deleteConfirmation) {
      try {
        const response = await fetch(`api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          alert('User profile deleted successfully.');
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
