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
import Settings from 'containers/Settings/Loadable';
import MyProfile from 'containers/MyProfile/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LoadingIndicator from 'components/LoadingIndicator';
import SSChecklist from 'containers/SSChecklist/Loadable';
import Efficiency from 'containers/Efficiency/Loadable';
import EfficiencyV2 from 'components/Efficiency/Efficiency';
import TurnoverTime from 'components/Efficiency/TurnoverTime/TurnoverTime';
import BlockUtilization from 'components/Efficiency/BlockUtilization/BlockUtilization';
import CaseScheduling from 'components/Efficiency/CaseScheduling/CaseScheduling';
import CaseOnTime from 'components/Efficiency/CaseOnTime/CaseOnTime';
import NoAccess from 'containers/NoAccess/Loadable';
import Forbidden from 'containers/Forbidden/Loadable';

import SSTNav from 'components/SSTNav';

import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import CaseDiscovery from '../CaseDiscovery/CaseDiscovery';
import Login from '../Login';
import { UserFeedback } from '../../components/UserFeedback/UserFeedback';
import { SSTSnackbar } from '../../components/SharedComponents/SharedComponents';
import { SSTAdmin } from '../SSTAdmin/SSTAdmin';
import { SST_ADMIN_ID } from '../../constants';

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
      efficiencyV2Access: false,
      isLoading: true
    }
  }

  componentDidMount() {
    this.resourcesGathered(this.props.userRoles, this.props.userFacility || "")
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userRoles != this.props.userRoles || prevProps.userFacility != this.props.userFacility) {
      this.resourcesGathered(this.props.userRoles, this.props.userFacility || "")
    }
  }

  resourcesGathered(roles, userFacility) {
    if (!userFacility) {
      return;
    }
    const { productRoles: { cdRoles, effRoles, sscRoles, emmRoles, umRoles } } = this.props;
    this.setState({
      userLoggedIn: true,
      adminPanelAccess: (umRoles.isAdmin || umRoles.hasAccess),
      settingsAccess: effRoles.isAdmin || sscRoles.isAdmin,
      emmAccess: emmRoles.hasAccess,
      emmRequestAccess: emmRoles.isAdmin,//&& !cdRoles.hasAccess,
      sscAccess: sscRoles.hasAccess,
      efficiencyAccess: effRoles.hasAccess,
      //@TODO: Access role and update boolean below to use it
      efficiencyV2Access: true,
      caseDiscoveryAccess: cdRoles.hasAccess,
      emmPublishAccess: emmRoles.hasPublisher,
      sstAdminAccess: Boolean(roles?.[SST_ADMIN_ID]),
      isLoading: false
    });
    this.props.setEMMPublishAccess(emmRoles.hasPublisher);
    this.clearFilters();
    // this.getPageAccess();
  };

  containsAny(arr1, arr2) {
    return arr1?.some?.(r => arr2.includes(r.toLowerCase()));
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
    const { logger, userStatus } = this.props;
    if (userStatus && userStatus?.status == 'forbidden') {
      return <Switch>
        <Route path="/my-profile" component={MyProfile} />
        <Forbidden />
      </Switch>
    }
    if (!this.state.authenticated) {
      return <Switch>
        <Route path="/my-profile" component={MyProfile} />
        <NoAccess />
      </Switch>
    }

    if (this.state.userLoggedIn) {
      // console.log(this.state.userLoggedIn);
      if (this.props.emmReportID) {
        logger?.manualAddLog('session', `open-emm-report`, this.props.emmReportID);
      } else {
        logger?.manualAddLog('session', `open-${window.location.pathname.substring(1)}`);
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
        {(this.state.sstAdminAccess) &&
          <Route path="/sstAdmin" component={SSTAdmin} />
        }
        {(this.state.settingsAccess) &&
          <Route path="/settings/:index?" component={Settings} />
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

        {(this.state.efficiencyV2Access) &&
          <Route exact path="/efficiencyV2" render={(props) => <EfficiencyV2 {...props} />} />
        }
        {(this.state.efficiencyV2Access) &&
          <Route path="/efficiencyV2/case-on-time" render={(props) => <CaseOnTime {...props} />} />
        }
        {(this.state.efficiencyV2Access) &&
          <Route path="/efficiencyV2/turnover-time" render={(props) => <TurnoverTime {...props} />} />
        }
        {(this.state.efficiencyV2Access) &&
          <Route path="/efficiencyV2/or-utilization" render={(props) => <BlockUtilization {...props} />} />
        }

        {(this.state.efficiencyV2Access) &&
          <Route path="/efficiencyV2/case-scheduling" render={(props) => <CaseScheduling {...props} />} />
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
        <Login />
        <CssBaseline />
        <Helmet
          titleTemplate="%s - SST Insights"
          defaultTitle="SST Insights"
        >
          <meta name="description" content="SST Insights web portal" />
        </Helmet>
        <SSTSnackbar />
        {this.state.userLoggedIn ?
          <React.Fragment>
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
                      sstAdminAccess={this.state.sstAdminAccess}
                      emmRequestAccess={this.state.emmRequestAccess}
                      emmAccess={this.state.emmAccess}
                      emmPublishAccess={this.state.emmPublishAccess}
                      sscAccess={this.state.sscAccess}
                      efficiencyAccess={this.state.efficiencyAccess}
                      efficiencyV2Access={this.state.efficiencyV2Access}
                      caseDiscoveryAccess={this.state.caseDiscoveryAccess}
                      settingsAccess={this.state.settingsAccess}
                      pathname={this.props.location.pathname}
                      isLoading={this.state.isLoading}
                      logger={this.props.logger}
                      firstName={this.props.firstName}
                      lastName={this.props.lastName}
                      facility={this.props.facility}
                      facilityDetails={this.props.facilityDetails}
                    />
                  </Drawer>
                </Hidden>
              </nav>
              <div className={`Content-Wrapper ${this.props.emmReportID && 'hidden'}`}>
                {this.getContainer()}
              </div>
            </div>
            <UserFeedback />
          </React.Fragment>
          :
          <LoadingIndicator />
        }

      </div>
    );
  }
}
