let token;

const checkAuth = () => {
  token = getCookie('alias-token');
  return !!token;
};

const authHandler = (token) => {
  if (!token) {
    alert('You should log in firstly!');
    window.location.replace('/login');
  }
};

checkAuth();
authHandler(token);
