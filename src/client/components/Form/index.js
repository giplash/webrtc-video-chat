import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import './index.less';

export default () => {
    const [ roomName, setRoomName ] = useState('');
    const [ shouldRedirectToRoom, setShouldRedirectToRoom ] = useState(false);
    const handleClick = (name) => {
        if (name === '') {
            return;
        }
        setShouldRedirectToRoom(true);
    };

    if (shouldRedirectToRoom) {
        return <Redirect to={roomName} />;
    }

    return (
        <div className="chat-form">
            <div className="char-form__input-container">
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
                    onClick={() => handleClick(roomName)}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};
