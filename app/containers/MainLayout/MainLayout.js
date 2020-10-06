import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import MainDashboard from 'containers/MainDashboard/Loadable';
import Welcome from 'containers/Welcome/Loadable';
import EMMCases from 'containers/EMMCases/Loadable';
import EMMPublish from 'containers/EMMPublish/Loadable';
import EMM from 'containers/EMM/Loadable';
import EMMReports from 'containers/EMMReports';
import RequestEMM from 'containers/RequestEMM/Loadable';
import UserManagement from 'containers/UserManagement/Loadable';
import MyProfile from 'containers/MyProfile/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LoadingIndicator from 'components/LoadingIndicator';
import SSChecklist from 'containers/SSChecklist/Loadable';
import Efficiency from 'containers/Efficiency/Loadable';
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
      efficiencyAccess: false,
      isLoading: true
    }

    this.logoutRef = React.createRef();
  }

  resourcesGathered(roles) {
    this.setState({
      userLoggedIn: true,
      userManagementAccess: this.containsAny(roles,["ADMIN"]),
      emmAccess: this.containsAny(roles,["ENHANCED M&M VIEW"]),
      emmRequestAccess: this.containsAny(roles,["ENHANCED M&M EDIT"]),
      sscAccess:this.containsAny(roles,["SURGICAL CHECKLIST"]),
      efficiencyAccess:this.containsAny(roles,["EFFICIENCY"]),
    });

    this.getPageAccess();
  };

  containsAny(arr1,arr2){
    return arr1.some(r=>arr2.includes(r.toUpperCase()));
  }

  redirect() {
    this.setState({
      authenticated: false,
      isLoading:false
    });
  };

  getPageAccess() {
    Promise.all([this.getEMMPublishAccess()].map(function (e) {
        return e && e.then(function (result) {
          return result && result.data;
        }).catch(function () {
          return false;
        })
      })).then(([emmPublishAccess]) => {
        this.setState({
          emmPublishAccess, isLoading: false
        })
        this.props.setEMMPublishAccess(emmPublishAccess);
      }).catch(function (results) {
        this.notLoading();
      });
  }
  notLoading() {
    this.setState({ isLoading: false });
  }

  getEMMPublishAccess() {
    return globalFunctions.axiosFetch(process.env.EMMPUBLISHACCESS_API, 'get', this.props.userToken);
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
        <Route path="/dashboard" component={Welcome} />
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

        {(this.state.efficiencyAccess) &&
          <Route path="/efficiency" render={(props) => <Efficiency {...props} reportType={"EfficiencyReport"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/daysStarting" render={(props) => <Efficiency {...props} reportType={"DaysStartingOnTimeReport"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/turnoverTime" render={(props) => <Efficiency {...props} reportType={"TurnoverTimeReport"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/orUtilization" render={(props) => <Efficiency {...props} reportType={"ORUtilizationReport"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/caseAnalysis" render={(props) => <Efficiency {...props} reportType={"CaseAnalysisReport"} />} />
        }

        <Route path="/my-profile" component={MyProfile} />
        <Route path="" component={this.state.isLoading ? LoadingIndicator : NotFoundPage} />
      </Switch>
    } else {
      return this.state.isLoading ? <LoadingIndicator/> : ''
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
                  efficiencyAccess={this.state.efficiencyAccess}
                  pathname={this.props.location.pathname}
                  logoutRef={this.logoutRef}
                  isLoading={this.state.isLoading}
                  userLogin={<AzureLogin
                    resourcesGathered={(roles) => this.resourcesGathered(roles)}
                    redirect={() => this.redirect()}
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