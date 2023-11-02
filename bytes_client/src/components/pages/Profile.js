import { React, useEffect, useState } from 'react';
import axios from "axios";
import '../../App.css';
import { Navigate } from 'react-router-dom';

function Profile({ setIsLoggedIn }) {
    const [email, setEmail] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    // const [passwordChangeMessage, setPasswordChangeMessage] = useState(''); // show password success/fail to change to user?

    const userLogout = ({ setIsLoggedIn }) => {
        axios.post('logout/').then(function (response) {
            console.log('signed out');
            console.log(setIsLoggedIn)
            setIsLoggedIn(false);
            console.log(setIsLoggedIn)
            Navigate('/');
        }).catch(function (error) {
            console.error(error);
        });
    }

    const changePassword = () => {
        axios.put('change_password/', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmNewPassword,
        }).then(function (response) {
            axios.post('login/', {
                email: email,
                password: newPassword,
            }).then(function (response) {
                console.log('signed in!');
            })

        }).catch(function (error) {
            console.error(error);
        });
    }


    useEffect(() => {
        axios.get('profile/').then(function (response) {
            console.log(response.data.user);
            setEmail(response.data.user['email'])
        }).catch(function (error) {
            console.error(error);
        })
    }, [])
    return (
        <>
            <div>Profile Page</div>
            <div>{email}</div>
            {<button onClick={userLogout(setIsLoggedIn)}>
                Logout
            </button>}

            <h2>Change Password</h2>
            <form>
                <label>
                    Old Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </label>
                <br />

                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <br />

                <label>
                    Confirm New Password:
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </label>
                <br />

                <button type="button" onClick={changePassword}>
                    Change Password
                </button>
            </form>
        </>
    )
}

export default Profile;