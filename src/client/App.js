import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './less/index.less';

import Form from './components/Form';
import Room from './components/Room';

export default () => (
    <Switch>
        <Route exact path="/" component={Form} />
        <Route path="/:roomId/" component={Room} />
    </Switch>
);
