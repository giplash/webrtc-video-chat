import React, { useState, useRef, useEffect } from 'react';

export default (props) => {
    const element = useRef(null);

    useEffect(() => {
        if (props.stream && !element.current.srcObject) {
            element.current.srcObject = props.stream;
        }
    });

    return (
        <video
            ref={element}
            playsInline
            autoPlay
            className={props.className}
            muted={props.muted}
        />
    );
};
