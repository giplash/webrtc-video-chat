import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './less/index.less';

import Form from './components/Form';
import Room from './components/Room';

export default () => (
    <Router>
        <Route path="/" exact component={Form} />
        <Route path="/:roomId/" component={Room} />
    </Router>
);
