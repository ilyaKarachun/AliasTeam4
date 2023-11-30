/* eslint-disable @typescript-eslint/naming-convention */
const registerForm = document.querySelector('.registerForm');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (password.value !== confirmPassword.value) {
    alert(
      'Password and Confirm Password do not match. Please enter matching passwords.',
    );
  } else {
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    console.log(data);
    fetch('/api/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = data.message;
        alert(message);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
