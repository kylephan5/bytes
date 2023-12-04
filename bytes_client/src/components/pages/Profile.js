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

    const [glutenFree, setGlutenFree] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isLactoseIntolerant, setIsLactoseIntolerant] = useState(false);
    const [isKeto, setIsKeto] = useState(false);
    const [nutAllergy, setNutAllergy] = useState(false);
    const [shellfishAllergy, setShellfishAllergy] = useState(false);

    const updatePreferences = () => {
        axios.put('user_preferences/', {
            email: email,
            gluten_free: glutenFree,
            is_vegan: isVegan,
            is_vegetarian: isVegetarian,
            is_lactose_intolerant: isLactoseIntolerant,
            is_keto: isKeto,
            nut_allergy: nutAllergy,
            shellfish_allergy: shellfishAllergy,
        })
            .then(function (response) {
                console.log('Preferences updated successfully:', response.data);
            })
            .catch(function (error) {
                console.error('Error updating preferences:', error);
            });
    };
    useEffect(() => {
        // Fetch user preferences from the backend
        axios.get('user_preferences/')
            .then(function (response) {
                const preferences = response.data;
                setEmail(preferences.email);
                setGlutenFree(preferences.gluten_free);
                setIsVegan(preferences.is_vegan);
                setIsVegetarian(preferences.is_vegetarian);
                setIsLactoseIntolerant(preferences.is_lactose_intolerant);
                setIsKeto(preferences.is_keto);
                setNutAllergy(preferences.nut_allergy);
                setShellfishAllergy(preferences.shellfish_allergy);
            })
            .catch(function (error) {
                console.error('Error fetching user preferences:', error);
            });
    }, [email]);


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
            {/* Left section */}
            <div className="left-section">
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

            {/* Right section */}
            <div className="preferences-section">
                <h2 className="preferences-header">User Preferences</h2>
                <div className="preferences-columns">
                    {/* Left column */}
                    <div className="preferences-column">
                        <label>
                            <input type="checkbox" checked={glutenFree} onChange={() => setGlutenFree(!glutenFree)} />
                            Gluten-Free
                        </label>
                        <br />
                        <label>
                            <input type="checkbox" checked={isVegan} onChange={() => setIsVegan(!isVegan)} />
                            Vegan
                        </label>
                        <br />
                        <label>
                            <input type="checkbox" checked={isVegetarian} onChange={() => setIsVegetarian(!isVegetarian)} />
                            Vegetarian
                        </label>
                        <br />
                    </div>
                    {/* Right column */}
                    <div className="preferences-column">
                        <label>
                            <input type="checkbox" checked={isLactoseIntolerant} onChange={() => setIsLactoseIntolerant(!isLactoseIntolerant)} />
                            Lactose Intolerant
                        </label>
                        <br />
                        <label>
                            <input type="checkbox" checked={isKeto} onChange={() => setIsKeto(!isKeto)} />
                            Keto
                        </label>
                        <br />
                        <label>
                            <input type="checkbox" checked={nutAllergy} onChange={() => setNutAllergy(!nutAllergy)} />
                            Nut Allergy
                        </label>
                        <br />
                        <label>
                            <input type="checkbox" checked={shellfishAllergy} onChange={() => setShellfishAllergy(!shellfishAllergy)} />
                            Shellfish Allergy
                        </label>
                        <br />
                    </div>
                </div>
                {/* Button to update preferences */}
                <button type="button" onClick={updatePreferences} className="update-preferences-button">
                    Update Preferences
                </button>
            </div>
        </div>
    );

}

export default Profile;