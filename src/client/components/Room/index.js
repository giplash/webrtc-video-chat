import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { omit } from 'lodash';

import Video from '../Video';

import './index.less';

const constraints = {
    audio: true,
    video: { facingMode: "user" }
};

const config = {
    'iceServers': [{
        'urls': ['stun:stun.l.google.com:19302']
    }]
};

const socket = io();

export default props => {
    const room = props.match.params.roomId;
    const [ localStream, setLocalStream ] = useState(null);
    const [ remoteStreams, setRemoteStreams ] = useState({});
    const [ peerConnections, setPeerConnections ] = useState({});

    useEffect(() => {

        socket.emit('join', room);

        function getUserMediaSuccess(stream) {
            setLocalStream(stream);
            socket.emit('ready');
        }

        function getUserMediaError(error) {
            console.error(error);
            setTimeout(getUserMediaDevices, 1000);
        }

        function getUserMediaDevices() {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(getUserMediaSuccess)
                .catch(getUserMediaError);
        }

        getUserMediaDevices();

        return () => {
            // socket.close();
        };
    }, []);

    useEffect(() => {
        if (localStream === null) {
            return;
        }

        const onReady = id => {
            const peerConnection = new RTCPeerConnection(config);
            setPeerConnections({ ...peerConnections, [id]: peerConnection });
            peerConnection.addStream(localStream);
            peerConnection.createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit('offer', id, peerConnection.localDescription);
                });
            peerConnection.onaddstream = event => {
                setRemoteStreams({ ...remoteStreams, [event.stream.id]: event.stream });
            };
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        };

        socket.on('ready', onReady);

        return () => {
            socket.removeListener('ready', onReady);
        };
    });

    useEffect(() => {

        if (localStream === null) {
            return;
        }
        const onOffer = (id, description) => {
            const peerConnection = new RTCPeerConnection(config);
            setPeerConnections({ ...peerConnections, [id]: peerConnection });
            peerConnection.addStream(localStream);
            peerConnection.setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit('answer', id, peerConnection.localDescription);
                });
            peerConnection.onaddstream = event => {
                setRemoteStreams({ ...remoteStreams, [event.stream.id]: event.stream });
            };
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        };

        socket.on('offer', onOffer);

        return () => {
            socket.removeListener('offer', onOffer);
        };
    });

    useEffect(() => {
        const onBye = (id) => {
            if (peerConnections[id]) {
                peerConnections[id].close();
            } else {
                return;
            }
            setPeerConnections(omit(peerConnections, [ id ]));
            const streams = peerConnections[id].getRemoteStreams();
            setRemoteStreams(omit(remoteStreams, [ streams.map(item => item.id) ]));
        };

        socket.on('bye', onBye);

        return () => {
            socket.removeListener('bye', onBye);
        };
    });

    useEffect(() => {
        const onCandidate = (id, candidate) => {
            peerConnections[id] && peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        };

        socket.on('candidate', onCandidate);

        return () => {
            socket.removeListener('candidate', onCandidate);
        };
    });

    useEffect(() => {
        const onAnswer = (id, description) => {
            peerConnections[id] && peerConnections[id].setRemoteDescription(description);
        };

        socket.on('answer', onAnswer);
        return () => {
            socket.removeListener('answer', onAnswer);
        };
    });

    return (
        <div className="room">
            <div className="room__local-video-container">
                <Video stream={localStream} className="room__local-video" muted/>
            </div>
            <div className="room__remote-video-container">
                {Object.values(remoteStreams).map((stream, i) => <Video stream={stream} className="room__remote-video" key={i} />)}
            </div>
        </div>
    );
};
