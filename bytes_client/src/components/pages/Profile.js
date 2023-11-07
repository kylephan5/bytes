import { React, useEffect, useState } from 'react';
import axios from "axios";
// import '../../App.css';
import { useNavigate } from "react-router-dom";
import './Profile.css';

function Profile(props) {
    const [email, setEmail] = useState();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    // const [passwordChangeMessage, setPasswordChangeMessage] = useState(''); // show password success/fail to change to user?
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.isLoggedIn) {
            navigate("/");
            window.location.reload();
        }
    })
    const userLogout = () => {
        axios.post('logout/').then(function (response) {
            navigate("/");
            window.location.reload();
        }).catch(function (error) {
            console.error(error);
        })
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
    }, [email])
    //     return (
    //         <>
    //             <div>Profile Page</div>
    //             <div>{email}</div>
    //             <button onClick={() => userLogout()}>
    //                 Logout
    //             </button>

    //             <h2>Change Password</h2>
    //             <form>
    //                 <label>
    //                     Old Password:
    //                     <input
    //                         type="password"
    //                         value={oldPassword}
    //                         onChange={(e) => setOldPassword(e.target.value)}
    //                     />
    //                 </label>
    //                 <br />

    //                 <label>
    //                     New Password:
    //                     <input
    //                         type="password"
    //                         value={newPassword}
    //                         onChange={(e) => setNewPassword(e.target.value)}
    //                     />
    //                 </label>
    //                 <br />

    //                 <label>
    //                     Confirm New Password:
    //                     <input
    //                         type="password"
    //                         value={confirmNewPassword}
    //                         onChange={(e) => setConfirmNewPassword(e.target.value)}
    //                     />
    //                 </label>
    //                 <br />

    //                 <button type="button" onClick={changePassword}>
    //                     Change Password
    //                 </button>
    //             </form>
    //         </>
    //     )
    // }


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
            </form>
        </div>
    );
}

export default Profile;