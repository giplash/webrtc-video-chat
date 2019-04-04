import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default props => {
    const [ data, setData ] = useState(null)
    useEffect(() => {
        const socket = io('/');

        socket.on('server-test', data => {
            setData(data);
        });
    }, []);
    return (
        data ? <h1>{ data }</h1> : <h1>loading...</h1>
    )
}
