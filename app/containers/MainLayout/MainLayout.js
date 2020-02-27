/*
 * Distractions Page
 *
 */

import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import UserManagement from 'containers/UserManagement/Loadable';
import MyProfile from 'containers/MyProfile/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NoAccess from 'containers/NoAccess/Loadable';
import SSTNav from 'components/SSTNav';

import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import AzureLogin from 'components/AzureLogin';

export default class MainLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      authenticated: true,
      userManagementAccess: false,
      emmAccess: false
    }

    this.logoutFunction = this.logoutFunction.bind(this);
  }

  resourcesGathered() {
    this.setState({
      userLoggedIn: true
    });

    this.getUserManagementAccess();
  }

  logoutFunction(logout) {
    if (logout != undefined) {
      this.getLogoutFunction(logout)
    }
  }

  getLogoutFunction(logout) {
    // return logout;
    if (logout) {
    }
    return (() => logout)
  }

  redirect() {
    this.setState({
      authenticated: false
    });
  }

  getUserManagementAccess() {
    fetch(process.env.USERMANAGEMENTACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 403) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ userManagementAccess: true })
          }
        });
      }
    })
  }

  getEMMAccess() {
    fetch(process.env.EMMACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 403) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ emmAccess: true })
          }
        });
      }
    })
  }

  getContainer() {
    if (!this.state.authenticated) {
      return <NoAccess/>
    }

    if (this.state.userLoggedIn) {
      return <Switch>
              {(this.state.userManagementAccess) &&
                <Route path="/usermanagement" component={() => <UserManagement userLoggedIn={this.state.userLoggedIn} /> }/>
              } 
              {/* <Route path="/dashboard" component={() => <MainDashboard userLoggedIn={this.state.userLoggedIn} /> }/>
              <Route path="/distractions/category" component={() => <DistractionsCategory userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/distractions/procedure" component={() => <DistractionsProcedure userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/distractions/room" component={() => <DistractionsOR userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/distractions" component={() => <Distractions userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/user-manager" component={() => <UserManager userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/culture-survey/demographic" component={() => <CultureSurveyDemographic userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/culture-survey/question-results" component={() => <CultureSurveyResult userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/culture-survey" component={() => <CultureSurvey userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="/room-traffic" component={() => <RoomTraffic userLoggedIn={this.state.userLoggedIn} />} /> */}
              <Route path="/my-profile" component={() => <MyProfile userLoggedIn={this.state.userLoggedIn} />} />
              <Route path="" component={NotFoundPage} />
            </Switch> 
    } else {
      return ''
    }
  }

  render() {
    return (
      <div className="app-wrapper">
        <AzureLogin
          resourcesGathered={() => this.resourcesGathered()}
          logoutFunction={(logout) => this.logoutFunction(logout)}
          redirect={() => this.redirect()}
        />
        <CssBaseline />
        <Helmet
          titleTemplate="%s - SST Insight"
          defaultTitle="SST Insight"
        >
          <meta name="description" content="SST Insight web portal" />
        </Helmet>
        
        <div className="APP-MAIN-WRAPPER">

        <nav className="MAIN-NAVIGATION">
            <Hidden xsDown implementation="css">
              <Drawer
                variant="permanent"
                open
              >
                <SSTNav userManagementAccess={this.state.userManagementAccess} />
              </Drawer>
            </Hidden>
          </nav>
          <div className="Content-Wrapper inline overflow-y">
            {this.getContainer()}
          </div>
        </div>
      </div>
    );
  }
}