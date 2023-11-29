import { React, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

function Profile(props) {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.isLoggedIn) {
            navigate("/");
            window.location.reload();
        }
    }, [props.isLoggedIn, navigate]);

    const userLogout = () => {
        axios.post('logout/')
            .then(function (response) {
                navigate("/");
                window.location.reload();
            })
            .catch(function (error) {
                console.error(error);
            });
    }


    const changePassword = () => {
        axios.put('change_password/', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmNewPassword,
        })
            .then(function (response) {
                axios.post('login/', {
                    email: email,
                    password: newPassword,
                })
                    .then(function (response) {
                        setPasswordChangeMessage('Password changed successfully.');

                        setOldPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');

                        setTimeout(() => {
                            setPasswordChangeMessage('');
                        }, 3000);
                        console.log('signed in!');
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            })
            .catch(function (error) {
                if (error.response.status === 400) {
                    setPasswordChangeMessage('Invalid old password or new passwords do not match.');
                } else {
                    console.error(error);
                }
                setTimeout(() => {
                    setPasswordChangeMessage('');
                }, 3000);
            });
    }
    useEffect(() => {
        axios.get('profile/')
            .then(function (response) {
                setEmail(response.data.user['email'])
            })
            .catch(function (error) {
                console.error(error);
            })
    }, [email])


    return (
        <div className="profile-container">
            <div className="profile-header">Profile Page</div>
            <div className="user-email">{email}</div>
            <button onClick={() => userLogout()} className="profile-logout-button">
                Logout
            </button>

            <h2 className="password-header">Change Password</h2>
            <form>
                <label className="password-label">
                    Old Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="password-input"
                    />
                </label>
                <br />

                <label className="password-label">
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                    />
                </label>
                <br />

                <label className="password-label">
                    Confirm New Password:
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="password-input"
                    />
                </label>
                <br />

                <button type="button" onClick={changePassword} className="change-password-button">
                    Change Password
                </button>

                {passwordChangeMessage && (
                    <p className={`password-message ${passwordChangeMessage.includes('success') ? 'password-success' : 'password-error'}`}>
                        {passwordChangeMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Profile;