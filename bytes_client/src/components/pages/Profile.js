import { React, useEffect, useState } from 'react';
import axios from "axios";
import '../../App.css';

function Profile() {
    const [email, setEmail] = useState();

    const userLogout = () => {
        axios.post('logout/').then(function(response) {
            console.log('signed out');
        })
    }
    useEffect(() => {
        axios.get('profile/').then(function(response) {
            console.log(response.data.user);
            setEmail(response.data.user['email'])
        }).catch(function(error) {
            console.error(error);
        })
    }, [])
  return (
    <>
      <div>Profile Page</div>
        <div>{email}</div>
        {<button onClick={userLogout}>
            Logout
        </button>}
    </>
  )
}

export default Profile;