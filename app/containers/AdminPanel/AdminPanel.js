import React from 'react';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import EfficiencySettings from './EfficiencySettings/Loadable';
import UserManagement from './UserManagement/Loadable';
import SSCSettings from './SSCSettings/Loadable';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';

export default class AdminPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    }
  }
  handleChange(obj, tabIndex) {
    this.setState({ tabIndex });
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const tabIndex = parseInt(params.index);
    if (tabIndex == params.index) {
      this.setState({ tabIndex: Math.min(Math.max(tabIndex, 0), 2) })
    }
    this.getEfficiencyConfig();
    this.getSSCConfig();
  }

  async getEfficiencyConfig() {
    return await globalFunctions.genericFetch(process.env.EFFICIENCY_API + "/config?facility_id=" + this.props.facilityName, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        // result = JSON.parse(result)
        this.setState({ fcotsThreshold: result.fcotsThreshold, turnoverThreshold: result.turnoverThreshold, hasEMR: result.hasEMR });
      });

  }

  async submitEfficiencyConfig(jsonBody) {
    const url = `${process.env.EFFICIENCY_API}/config`;
    return await globalFunctions.genericFetch(url, 'put', this.props.userToken, jsonBody)
      .then(result => {
        if (!result) {
          return;
        }
        // result = JSON.parse(result)
        this.setState({ fcotsThreshold: result.fcotsThreshold, turnoverThreshold: result.turnoverThreshold, hasEMR: result.hasEMR });
      });
  }

  async getSSCConfig() {
    return await globalFunctions.genericFetch(process.env.SSC_API + "/config?facility_id=" + this.props.facilityName, 'get', this.props.userToken, {})
      .then(sscConfig => {
        if (!sscConfig) {
          return;
        }
        // const sscConfig = JSON.parse(result);
        this.setState({ sscConfig });
      });
  }

  async submitSSCConfig(jsonBody) {
    const url = `${process.env.SSC_API}/config`;
    return await globalFunctions.genericFetch(url, 'put', this.props.userToken, jsonBody)
      .then(sscConfig => {
        if (!sscConfig) {
          return;
        }
        // const sscConfig = JSON.parse(result);
        this.setState({ sscConfig });
      });
  }

  render() {

    return (
      <div className="admin-panel">
        <div className="header">
          Admin Panel
        </div>
        <StyledTabs
          value={this.state.tabIndex}
          onChange={(obj, value) => this.handleChange(obj, value)}
          indicatorColor="primary"
          textColor="primary"
        >
          <StyledTab label="User Management" />
          <StyledTab label="Efficiency" />
          {(this.state.sscConfig && this.state.sscConfig.checklists.length > 0) && <StyledTab label="Surgical Safety Checklist" />}
        </StyledTabs>
        <TabPanel value={this.state.tabIndex} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          <EfficiencySettings
            fcotsThreshold={this.state.fcotsThreshold}
            turnoverThreshold={this.state.turnoverThreshold}
            hasEMR={this.state.hasEMR}
            submit={(updates) => this.submitEfficiencyConfig(updates)}
          />
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={2}>
          <SSCSettings
            sscConfig={this.state.sscConfig}
            submit={(updates) => this.submitSSCConfig(updates)}
          />
        </TabPanel>

      </div>
    );
  }
}