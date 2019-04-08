import React, { useEffect } from 'react';
import io from 'socket.io-client';

export default props => {
    const id = props.match.params.roomId;
    useEffect(() => {
        const socket = io();
        console.log(socket);
    });
    return (
        <h1>Room page {id}</h1>
    );
};
