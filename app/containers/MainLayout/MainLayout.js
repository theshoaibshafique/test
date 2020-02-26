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
      authenticated: true
    }

    this.logoutFunction = this.logoutFunction.bind(this);
  }

  resourcesGathered() {
    this.setState({
      userLoggedIn: true
    });
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

  getContainer() {
    if (!this.state.authenticated) {
      return <NoAccess/>
    }

    if (this.state.userLoggedIn) {
      return <Switch>
              <Route path="/usermanagement" component={() => <UserManagement userLoggedIn={this.state.userLoggedIn} /> }/>
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
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                anchor="left"
                // open={this.state.mobileOpen}
                // onClose={this.handleDrawerToggle}
              >
                <SSTNav />
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                variant="permanent"
                open
              >
                <SSTNav />
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