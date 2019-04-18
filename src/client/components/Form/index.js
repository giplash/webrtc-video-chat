import React, { useState } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

import './index.less';

export default (props) => {
    const [ roomName, setRoomName ] = useState('');
    const [ shouldRedirectToRoom, setShouldRedirectToRoom ] = useState(false);
    const handleSubmit = (e, name) => {
        e.preventDefault();
        if (name === '') {
            return;
        }
        setShouldRedirectToRoom(true);
    };

    if (shouldRedirectToRoom) {
        return (
            <Redirect push to={`/${roomName}`} />
        );
    }

    return (
        <div className="chat-form">
            <div className="char-form__input-container">
                <form onSubmit={(e) => handleSubmit(e, roomName)}>
                    <input
                        type="text"
                        className="chat-form__input"
                        placeholder="Enter the room name"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="chat-form__submit-button button"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
