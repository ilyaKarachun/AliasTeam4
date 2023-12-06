/* eslint-disable @typescript-eslint/naming-convention */
const loginForm = document.querySelector('.loginForm');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };
  fetch('/api/v1/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error !== undefined) alert(data.error);
      const token = data.token;
      document.cookie = `alias-token=${token}`;
      const userId = data.user.id;
      const email = data.user.email;

      localStorage.setItem('userId', `${userId}`);
      localStorage.setItem('email', `${email}`);
      if (token !== undefined) {
        window.location.pathname = '/games';
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
