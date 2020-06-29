import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import MainDashboard from 'containers/MainDashboard/Loadable';
import EMMCases from 'containers/EMMCases/Loadable';
import EMMPublish from 'containers/EMMPublish/Loadable';
import EMM from 'containers/EMM/Loadable';
import EMMReports from 'containers/EMMReports';
import RequestEMM from 'containers/RequestEMM/Loadable';
import UserManagement from 'containers/UserManagement/Loadable';
import MyProfile from 'containers/MyProfile/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import SSChecklist from 'containers/SSChecklist/Loadable';
import NoAccess from 'containers/NoAccess/Loadable';
import SSTNav from 'components/SSTNav';
import AzureLogin from 'components/AzureLogin';

import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import globalFunctions from '../../utils/global-functions';

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
      sscAccess: false,
      isLoading: true
    }

    this.logoutRef = React.createRef();
  }

  resourcesGathered() {
    this.setState({
      userLoggedIn: true
    });

    this.getPageAccess();
  };

  redirect() {
    this.setState({
      authenticated: false
    });
  };

  getPageAccess() {
    Promise.all([
      this.getUserManagementAccess(),
      this.getEMMRequestAccess(),
      this.getEMMAccess(),
      this.getEMMPublishAccess(),
      this.getSSCRequestAccess()].map(function (e) {
        return e.then(function (result) {
          return result && result.data;
        }).catch(function () {
          return false;
        })
      })).then(([userManagementAccess, emmRequestAccess, emmAccess, emmPublishAccess, sscAccess]) => {
        this.setState({
          userManagementAccess, emmRequestAccess, emmAccess, emmPublishAccess, sscAccess, isLoading: false
        })
        this.props.setEMMPublishAccess(emmPublishAccess);
      }).catch(function (results) {
        this.notLoading();
      });
  }
  notLoading() {
    this.setState({ isLoading: false });
  }

  getUserManagementAccess() {
    return globalFunctions.axiosFetch(process.env.USERMANAGEMENTACCESS_API, 'get', this.props.userToken);
  };

  getEMMAccess() {
    return globalFunctions.axiosFetch(process.env.EMMACCESS_API, 'get', this.props.userToken);
  };

  getEMMPublishAccess() {
    return globalFunctions.axiosFetch(process.env.EMMPUBLISHACCESS_API, 'get', this.props.userToken);
  };
  getEMMRequestAccess() {
    return globalFunctions.axiosFetch(process.env.EMMREQUESTACCESS_API, 'get', this.props.userToken);
  };
  getSSCRequestAccess() {
    return globalFunctions.axiosFetch(process.env.SSC_ACCESS_API, 'get', this.props.userToken);
  };

  getContainer() {
    if (!this.state.authenticated) {
      return <Switch>
        <Route path="/my-profile" component={MyProfile} />
        <NoAccess />
      </Switch>
    }

    if (this.state.userLoggedIn) {
      return <Switch>
        <Route path="/dashboard" component={MainDashboard} />
        {(this.state.emmAccess) &&
          <Route path="/emmcases" component={EMMCases} />
        }
        {(this.state.emmPublishAccess) &&
          <Route path="/emmpublish" component={EMMPublish} />
        }
        {(this.state.emmAccess) &&
          <Route path="/emm/:requestid" component={EMM} />
        }
        {(this.state.emmRequestAccess) &&
          <Route path="/requestemm" component={RequestEMM} />
        }
        {(this.state.userManagementAccess) &&
          <Route path="/usermanagement" component={UserManagement} />
        }
        {(this.state.sscAccess) &&
          <Route path="/sschecklist" render={(props) => <SSChecklist {...props} reportType={"SurgicalSafetyChecklistReport"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/complianceScore" render={(props) => <SSChecklist {...props} reportType={"ComplianceScoreReport"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/engagementScore" render={(props) => <SSChecklist {...props} reportType={"EngagementScoreReport"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/qualityScore" render={(props) => <SSChecklist {...props} reportType={"QualityScoreReport"} />} />
        }
        <Route path="/my-profile" component={MyProfile} />
        <Route path="" component={NotFoundPage} />
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
          {(this.props.emmReportID) &&
            <div className="EMM-Report-Overlay">
              <EMMReports />
            </div>
          }
          <nav className={"MAIN-NAVIGATION " + (this.props.emmReportID && 'hidden')}>
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
                  sscAccess={this.state.sscAccess}
                  pathname={this.props.location.pathname}
                  logoutRef={this.logoutRef}
                  isLoading={this.state.isLoading}
                  userLogin={<AzureLogin
                    resourcesGathered={() => this.resourcesGathered()}
                    redirect={() => this.redirect()}
                    notLoading={() => this.notLoading()}
                    logoutRef={this.logoutRef}
                  />}
                />
              </Drawer>
            </Hidden>
          </nav>
          <div className="inline overflow-y Content-Wrapper">
            {this.getContainer()}
          </div>
        </div>
      </div>
    );
  }
}