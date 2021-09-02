import React from 'react';
import './style.scss';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import Welcome from 'containers/Welcome/Loadable';
import EMMCases from 'containers/EMMCases/Loadable';
import EMMPublish from 'containers/EMMPublish/Loadable';
import EMM from 'containers/EMM/Loadable';
import EMMReports from 'containers/EMMReports';
import RequestEMM from 'containers/RequestEMM/Loadable';
import AdminPanel from 'containers/AdminPanel/Loadable';
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
import CaseDiscovery from '../CaseDiscovery/CaseDiscovery';
import moment from 'moment';
import Login from '../Login';
import { UserFeedback } from '../../components/UserFeedback/UserFeedback';

export default class MainLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      authenticated: true,
      adminPanelAccess: false,
      emmAccess: false,
      emmRequestAccess: false,
      emmPublishAccess: false,
      sscAccess: false,
      efficiencyAccess: false,
      isLoading: true
    }
  }

  componentDidMount(){
    // const {refreshToken,expiresAt } = JSON.parse(localStorage.getItem('refreshToken')) || {};
    // if (!refreshToken){
    //   this.props.pushUrl('/');
    //   return;
    // }
    this.resourcesGathered(this.props.userRoles, this.props.userFacility || "")
  }
  componentDidUpdate(prevProps){
    if (prevProps.userRoles != this.props.userRoles || prevProps.userFacility != this.props.userFacility){
      this.resourcesGathered(this.props.userRoles, this.props.userFacility || "")
    }
  }

  resourcesGathered(roles, userFacility) {
    if (!userFacility){
      return;
    }
    this.setState({
      userLoggedIn: true,
      adminPanelAccess: this.containsAny(roles, ["ADMIN"]),
      emmAccess: this.containsAny(roles, ["ENHANCED M&M VIEW"]),
      emmRequestAccess: this.containsAny(roles, ["ENHANCED M&M EDIT"]),
      sscAccess: this.containsAny(roles, ["SURGICAL CHECKLIST"]),
      efficiencyAccess: this.containsAny(roles, ["EFFICIENCY"]),
      caseDiscoveryAccess: this.containsAny(roles, ["CASE DISCOVERY"]),
      emmPublishAccess: this.containsAny(roles, ["SSTADMIN"]),
      isLoading:false
    });
    this.props.setEMMPublishAccess(this.containsAny(roles, ["SSTADMIN"]));
    this.clearFilters();
    // this.getPageAccess();
  };

  containsAny(arr1, arr2) {
    return arr1 && arr1.some(r => arr2.includes(r.toUpperCase()));
  }

  clearFilters() {
    localStorage.removeItem('efficiencyFilter-' + this.props.userEmail);
    localStorage.removeItem('sscFilter-' + this.props.userEmail);
  }

  redirect() {
    this.setState({
      authenticated: false,
      isLoading: false
    });
  };

  notLoading() {
    this.setState({ isLoading: false });
  }

  getContainer() {
    if (!this.state.authenticated) {
      return <Switch>
        <Route path="/my-profile" component={MyProfile} />
        <NoAccess />
      </Switch>
    }
    const {logger} = this.props;
    if (this.state.userLoggedIn) {
      if (this.props.emmReportID){
        logger && logger.manualAddLog('session', `open-emm-report`, this.props.emmReportID);
      } else {
        logger && logger.manualAddLog('session', `open-${window.location.pathname.substring(1)}`);
      }
      
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

        {(this.state.adminPanelAccess) &&
          <Route path="/adminPanel/:index?" component={AdminPanel} />
        }
        {(this.state.sscAccess) &&
          <Route path="/sschecklist" render={(props) => <SSChecklist {...props} reportType={"Overview"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/compliance" render={(props) => <SSChecklist {...props} reportType={"Compliance"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/engagement" render={(props) => <SSChecklist {...props} reportType={"Engagement"} />} />
        }
        {(this.state.sscAccess) &&
          <Route path="/quality" render={(props) => <SSChecklist {...props} reportType={"Quality"} />} />
        }

        {(this.state.efficiencyAccess) &&
          <Route path="/efficiency" render={(props) => <Efficiency {...props} reportType={"efficiency"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/daysStarting" render={(props) => <Efficiency {...props} reportType={"firstCaseOnTimeStart"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/turnoverTime" render={(props) => <Efficiency {...props} reportType={"turnoverTime"} />} />
        }
        {(this.state.efficiencyAccess) &&
          <Route path="/orUtilization" render={(props) => <Efficiency {...props} reportType={"blockUtilization"} />} />
        }
        {(this.state.caseDiscoveryAccess) &&
          <Route path="/caseDiscovery" render={(props) => <CaseDiscovery {...props} showEMMReport={this.props.showEMMReport} />} />
        }

        <Route path="/my-profile" component={MyProfile} />
        <Route path="" component={this.state.isLoading ? LoadingIndicator : NotFoundPage} />
      </Switch>
    } else {
      return this.state.isLoading ? <LoadingIndicator /> : ''
    }
  };

  render() {
    return (
      <div className="app-wrapper">
        <Login/>
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
          <nav className={`MAIN-NAVIGATION ${this.props.emmReportID && 'hidden'}`}>
            <Hidden xsDown implementation="css">
              <Drawer
                variant="permanent"
                open
              >
                <SSTNav
                  adminPanelAccess={this.state.adminPanelAccess}
                  emmRequestAccess={this.state.emmRequestAccess}
                  emmAccess={this.state.emmAccess}
                  emmPublishAccess={this.state.emmPublishAccess}
                  sscAccess={this.state.sscAccess}
                  efficiencyAccess={this.state.efficiencyAccess}
                  caseDiscoveryAccess={this.state.caseDiscoveryAccess}
                  pathname={this.props.location.pathname}
                  isLoading={this.state.isLoading}
                />
              </Drawer>
            </Hidden>
          </nav>
          <div className={`Content-Wrapper ${this.props.emmReportID && 'hidden'}`}>
            {this.getContainer()}
          </div>
        </div>
        <UserFeedback/>
      </div>
    );
  }
}