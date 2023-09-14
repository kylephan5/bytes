import './App.css';
import axios from 'axios';
function App() {
  axios.defaults.baseURL = 'http://127.0.0.1:8000'

  const sendRequest = () => {
    axios.get('mealspiration_api/users/', {
        format: 'json',
    })
    .then(function (response) {
      console.log(response);
    })
  }

  const sendUser = (email, favorited_items, username, password) => {
    axios.post('mealspiration_api/users/', {
      email: email,
      favorited_items: favorited_items,
      username: username,
      password: password,
    })
  }

  const getSpecific = (id) => {
    axios.get(`mealspiration_api/users/${id}`, {
      format: 'json'
    }).then(function(response) {
      console.log(response);
    })
  }

  return (
    <div className="App">
      <h1> Hello</h1>
      <button onClick={sendRequest}>Click me to send a request</button>
      <button onClick={() => getSpecific(2)}>Get a specific item</button>
      <button onClick={() => sendUser('kphan2@nd.edu', null, 'kdp', 'test123')}>Click me to send a user</button>
    </div>
  );
}

export default App;
