import './App.css';
import axios from 'axios';
function App() {
  axios.defaults.baseURL = 'http://127.0.0.1:8000/';

  const sendRequest = () => {
    axios.get('users/', {
        format: 'json',
    })
    .then(function (response) {
      console.log(response);
    }).catch(function(response) {
      console.log(response);
    })
  }

  // sendUser
  const sendUser = (email, password) => {
    axios.post('register/', {
      email: email,
      password: password,
    })
  }

const getSpecific = (id) => {
  axios.get(`users/`, {
    params: { id: id },
    headers: { 'Content-Type': 'application/json' } // You can specify the request headers here
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });
}

  return (
    <div className="App">
      <h1> Hello</h1>
      <button onClick={sendRequest}>Click me to send a request</button>
      <button onClick={() => getSpecific(2)}>Get a specific item</button>
      <button onClick={() => sendUser('jaynephan@mgmail.com', 'test123')}>Click me to send a user</button>
    </div>
  );
}

export default App;
