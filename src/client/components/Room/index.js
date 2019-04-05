import React from 'react';

export default props => {
    const id = props.match.params.roomId;
    return (
        <h1>Room page {id}</h1>
    );
};
