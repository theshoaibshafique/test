import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import MainDashboard from 'containers/MainDashboard/Loadable';
import EMMCases from 'containers/EMMCases/Loadable';
import EMMPublish from 'containers/EMMPublish/Loadable';
import EMM from 'containers/EMM/Loadable';
import RequestEMM from 'containers/RequestEMM/Loadable';
import UserManagement from 'containers/UserManagement/Loadable';
import MyProfile from 'containers/MyProfile/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NoAccess from 'containers/NoAccess/Loadable';
import SSTNav from 'components/SSTNav';
import AzureLogin from 'components/AzureLogin';

import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

export default class MainLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      authenticated: true,
      userManagementAccess: false,
      emmAccess: false,
      emmRequestAccess: false,
      emmPublishAccess: false,
      isLoading: true
    }

    this.logoutFunction = this.logoutFunction.bind(this);
  }

  resourcesGathered() {
    this.setState({
      userLoggedIn: true
    });

    this.getUserManagementAccess();
    this.getEMMRequestAccess();
    this.getEMMAccess();
    this.getEMMPublishAccess();
  };

  logoutFunction(logout) {
    if (logout != undefined) {
      this.getLogoutFunction(logout)
    }
  };

  getLogoutFunction(logout) {
    // return logout;
    if (logout) {
    }
    return (() => logout)
  };

  redirect() {
    this.setState({
      authenticated: false
    });
  };

  getUserManagementAccess() {
    fetch(process.env.USERMANAGEMENTACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ userManagementAccess: true })
          }
        });
      }
    })
  };

  getEMMAccess() {
    fetch(process.env.EMMACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ emmAccess: true })
          }
        });
      }
    })
  };

  getEMMPublishAccess() {
    fetch(process.env.EMMACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ emmPublishAccess: true })
          }
        });
      }
    })
  };

  getEMMRequestAccess() {
    fetch(process.env.EMMREQUESTACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ emmRequestAccess: true })
          }
        });
      }
    })
  };

  getContainer() {
    if (!this.state.authenticated) {
      return <Switch>
                <Route path="/my-profile" component={MyProfile}/>
                <NoAccess />
             </Switch>
    }

    if (this.state.userLoggedIn) {
      return <Switch>
              <Route path="/maindashboard" component={MainDashboard}/> }/>
              {(this.state.emmAccess) &&
                  <Route path="/emmcases" component={EMMCases}/>
              }
              {(this.state.emmPublishAccess) &&
                  <Route path="/emmpublish" component={EMMPublish}/>
              }
              {(this.state.emmAccess) &&
                  <Route path="/emm/:requestid" component={EMM} />
              }
              {(this.state.emmRequestAccess) &&
                  <Route path="/requestemm" component={RequestEMM}/>
              }
              {(this.state.userManagementAccess) &&
                  <Route path="/usermanagement" component={UserManagement}/>
              }
              <Route path="/my-profile" component={MyProfile}/>
              <Route path="" component={NotFoundPage}/>
            </Switch> 
    } else {
      return ''
    }
  };

  render() {
    return (
        <div className="app-wrapper">
          
          <CssBaseline />
          <Helmet
            titleTemplate="%s - SST Insights"
            defaultTitle="SST Insights"
          >
            <meta name="description" content="SST Insights web portal" />
          </Helmet>
          
          <div className="APP-MAIN-WRAPPER">

          <nav className="MAIN-NAVIGATION">
              <Hidden xsDown implementation="css">
                <Drawer
                  variant="permanent"
                  open
                >
                  <SSTNav 
                    userManagementAccess={this.state.userManagementAccess} 
                    emmRequestAccess={this.state.emmRequestAccess}
                    emmAccess={this.state.emmAccess}
                    emmPublishAccess={this.state.emmPublishAccess}
                    userLogin={<AzureLogin
                      resourcesGathered={() => this.resourcesGathered()}
                      logoutFunction={(logout) => this.logoutFunction(logout)}
                      redirect={() => this.redirect()}
                    />}
                  />
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