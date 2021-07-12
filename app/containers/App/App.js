/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from 'containers/Login/Loadable';
import MainLayout from 'containers/MainLayout/Loadable';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEdit, faTrash, faPlus, faUser, faMale, faFemale, faChevronRight, faChevronDown, faExternalLinkAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

library.add(faCog, faEdit, faTrash, faPlus, faUser, faMale, faFemale, faChevronRight, faChevronDown, faExternalLinkAlt, faExclamationTriangle)

const App = () => (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="" component={MainLayout} />
        </Switch>

);

export default App;
