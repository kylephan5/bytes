import { React, useEffect, useState } from 'react';
import axios from "axios";
import '../../App.css';

function Profile() {
    const [email, setEmail] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordChangeMessage, setPasswordChangeMessage] = useState(''); // State variable for the message

    const userLogout = () => {
        axios.post('logout/').then(function (response) {
            console.log('signed out');
        })
    }

    const changePassword = () => {
        axios.put('change_password/', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmNewPassword,
        }).then(function (response) {
            console.log(response);
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
            {<button onClick={userLogout}>
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